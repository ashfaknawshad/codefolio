from fastapi import APIRouter, HTTPException, Header, Body
import httpx
from typing import Optional
from pydantic import BaseModel
from ..services.llm_service import DeepSeekService
from ..services.gdocs_service import GoogleDocsService

# APIRouter allows us to create a self-contained set of routes
router = APIRouter()

GITHUB_API_URL = "https://api.github.com"

# Request models
class EnhanceReposRequest(BaseModel):
    repos: list
    deepseek_api_key: str

class GoogleDocsRequest(BaseModel):
    doc_url: str

@router.get("/connect")
async def connect_github(authorization: str = Header(...)):
    """
    Authenticates a user with their GitHub token.
    It expects the token to be in the 'Authorization' header.
    Example: "token ghp_YourTokenHere"
    """
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{GITHUB_API_URL}/user", headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Invalid GitHub token or failed to authenticate")
    
    return response.json()

@router.get("/fetch_repos")
async def fetch_repos(authorization: str = Header(...)):
    """
    Fetches all public and private repositories for the authenticated user.
    """
    headers = {"Authorization": authorization}
    # We add params to get all repos, not just the first 30
    params = {"per_page": 100}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{GITHUB_API_URL}/user/repos", headers=headers, params=params)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Could not fetch repositories")
    
    return response.json()


@router.post("/enhance_repos")
async def enhance_repos(request: EnhanceReposRequest, authorization: str = Header(...)):
    """
    Enhance ALL repositories with AI-generated descriptions.
    Fetches README files and uses DeepSeek to generate professional descriptions.
    """
    try:
        headers = {"Authorization": authorization}
        llm_service = DeepSeekService(api_key=request.deepseek_api_key)
        
        print(f"Starting AI enhancement for {len(request.repos)} repositories...")
        
        async def fetch_readme(repo_full_name: str) -> Optional[str]:
            """Fetch README content from GitHub using the user's token"""
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(
                        f"{GITHUB_API_URL}/repos/{repo_full_name}/readme",
                        headers={**headers, "Accept": "application/vnd.github.raw+json"}
                    )
                    if response.status_code == 200:
                        content = response.text
                        print(f"✓ Fetched README for {repo_full_name} ({len(content)} chars)")
                        return content
                    else:
                        print(f"✗ No README found for {repo_full_name} (status: {response.status_code})")
            except Exception as e:
                print(f"✗ Error fetching README for {repo_full_name}: {e}")
            return None
        
        # Process each repo and enhance ALL descriptions
        enhanced_repos = []
        for idx, repo in enumerate(request.repos, 1):
            print(f"\n[{idx}/{len(request.repos)}] Processing {repo['name']}...")
            
            # Fetch README content
            readme = await fetch_readme(repo['full_name'])
            
            if readme and len(readme.strip()) > 10:  # Make sure README has content
                print(f"  Generating AI description...")
                try:
                    new_description = llm_service.generate_project_description(
                        readme, 
                        repo['name']
                    )
                    if new_description and len(new_description) > 10:
                        repo['description'] = new_description
                        print(f"  ✓ Generated: {repo['description'][:100]}...")
                    else:
                        print(f"  ✗ AI returned empty description")
                        repo['description'] = repo.get('description') or f"GitHub project: {repo['name']}"
                except Exception as e:
                    print(f"  ✗ AI generation failed: {e}")
                    repo['description'] = repo.get('description') or f"GitHub project: {repo['name']}"
            else:
                # No README, keep original or create basic description
                if not repo.get('description'):
                    repo['description'] = f"GitHub project: {repo['name']}"
                    print(f"  → No README, using basic description")
                else:
                    print(f"  → Keeping original: {repo['description'][:100]}...")
            
            enhanced_repos.append(repo)
        
        print(f"\n✓ Enhanced {len(enhanced_repos)} repositories successfully!")
        return enhanced_repos
        
    except Exception as e:
        print(f"\n✗ Error enhancing repos: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/parse_google_doc")
async def parse_google_doc(request: GoogleDocsRequest):
    """
    Parse a Google Doc (must be shared with 'Anyone with the link') 
    and extract CV information.
    """
    try:
        doc_id = GoogleDocsService.extract_doc_id(request.doc_url)
        content = await GoogleDocsService.fetch_doc_content(doc_id)
        parsed_data = GoogleDocsService.parse_cv_content(content)
        
        return parsed_data
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error parsing Google Doc: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")
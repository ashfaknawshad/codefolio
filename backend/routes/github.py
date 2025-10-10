from fastapi import APIRouter, HTTPException, Header
import httpx

# APIRouter allows us to create a self-contained set of routes
router = APIRouter()

GITHUB_API_URL = "https://api.github.com"

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
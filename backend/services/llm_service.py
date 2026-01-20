# backend/services/llm_service.py

import os
from openai import OpenAI

class DeepSeekService:
    def __init__(self, api_key: str = None):
        """Initialize DeepSeek API client"""
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        if not self.api_key:
            raise ValueError("DeepSeek API key not provided")
        
        # DeepSeek uses OpenAI-compatible API
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.deepseek.com"
        )
    
    def generate_project_description(self, readme_content: str, repo_name: str) -> str:
        """
        Generate a concise project description from README content
        
        Args:
            readme_content: The README file content
            repo_name: Name of the repository
            
        Returns:
            A concise 1-2 sentence project description
        """
        try:
            # Limit content to avoid token limits
            content_preview = readme_content[:3000]
            
            prompt = f"""You are a professional resume writer. Based on the README from a GitHub repository named "{repo_name}", write a concise, impactful 1-2 sentence description for a resume.

README Content:
{content_preview}

Requirements:
- Focus on WHAT the project does and WHY it's valuable
- Mention key technologies/frameworks used
- Use professional, active language
- Keep it under 150 words
- No markdown formatting
- Start directly with the description (no "This project..." or "This is...")

Example style: "Full-stack e-commerce platform built with React and Node.js, featuring real-time inventory management and payment processing for 10K+ daily transactions."

Your description:"""

            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are a professional resume writer who creates concise, impactful project descriptions. Write clear, direct descriptions without unnecessary preamble."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            description = response.choices[0].message.content.strip()
            # Remove quotes if present
            description = description.strip('"\'')
            # Remove common prefixes
            for prefix in ["This project ", "This is ", "This repository ", "A project that "]:
                if description.startswith(prefix):
                    description = description[len(prefix):]
                    # Capitalize first letter
                    description = description[0].upper() + description[1:]
            
            return description
            
        except Exception as e:
            print(f"Error generating description: {e}")
            import traceback
            traceback.print_exc()
            return f"GitHub project: {repo_name}"
    
    def enhance_project_descriptions(self, projects: list, readme_fetcher) -> list:
        """
        Enhance projects with AI-generated descriptions where missing
        
        Args:
            projects: List of project dictionaries
            readme_fetcher: Function to fetch README content
            
        Returns:
            Enhanced projects list
        """
        enhanced = []
        for project in projects:
            if not project.get('description') or project.get('description') == '':
                # Fetch README and generate description
                readme = readme_fetcher(project['full_name'])
                if readme:
                    project['description'] = self.generate_project_description(
                        readme, 
                        project['name']
                    )
            enhanced.append(project)
        return enhanced

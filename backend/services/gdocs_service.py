# backend/services/gdocs_service.py

import re
from typing import Dict, List, Any

class GoogleDocsService:
    """
    Service to parse Google Docs content and extract CV information.
    For public docs, we can fetch via the export API without auth.
    """
    
    @staticmethod
    def extract_doc_id(doc_url: str) -> str:
        """Extract document ID from Google Docs URL"""
        patterns = [
            r'/document/d/([a-zA-Z0-9-_]+)',
            r'id=([a-zA-Z0-9-_]+)'
        ]
        for pattern in patterns:
            match = re.search(pattern, doc_url)
            if match:
                return match.group(1)
        raise ValueError("Invalid Google Docs URL")
    
    @staticmethod
    async def fetch_doc_content(doc_id: str) -> str:
        """
        Fetch document content as plain text.
        Uses the public export API for documents shared with 'Anyone with the link'
        """
        import httpx
        
        # Export as plain text
        export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(export_url)
            if response.status_code == 200:
                return response.text
            else:
                raise Exception(f"Failed to fetch document: {response.status_code}. Make sure the document is shared with 'Anyone with the link'")
    
    @staticmethod
    def parse_cv_content(content: str) -> Dict[str, Any]:
        """
        Parse CV content from plain text and extract structured information.
        Expects sections like:
        
        PERSONAL INFORMATION
        Name: John Doe
        Email: john@example.com
        Phone: +1234567890
        LinkedIn: linkedin.com/in/johndoe
        GitHub: github.com/johndoe
        Job Title: Software Engineer
        
        EDUCATION
        - University Name | Degree | 2018-2022 | Description
        - Another University | Another Degree | 2016-2018 | Description
        
        EXPERIENCE
        - Company Name | Position | 2020-Present | Job description and achievements
        
        SKILLS
        - Python, JavaScript, React, Node.js
        """
        lines = content.split('\n')
        result = {
            "user_details": {},
            "sections": []
        }
        
        current_section = None
        current_items = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check for section headers
            upper_line = line.upper()
            if 'PERSONAL' in upper_line or 'CONTACT' in upper_line or 'INFO' in upper_line:
                current_section = 'personal'
                continue
            elif 'EDUCATION' in upper_line:
                if current_section == 'personal' and current_items:
                    # Save previous section
                    pass
                current_section = 'education'
                current_items = []
                continue
            elif 'EXPERIENCE' in upper_line or 'EMPLOYMENT' in upper_line or 'WORK' in upper_line:
                if current_section == 'education' and current_items:
                    result['sections'].append({
                        'id': f'sec_{len(result["sections"])+1}',
                        'title': 'Educational Qualifications',
                        'items': current_items
                    })
                current_section = 'experience'
                current_items = []
                continue
            elif 'SKILL' in upper_line:
                if current_section == 'experience' and current_items:
                    result['sections'].append({
                        'id': f'sec_{len(result["sections"])+1}',
                        'title': 'Employment History',
                        'items': current_items
                    })
                current_section = 'skills'
                current_items = []
                continue
            
            # Parse content based on current section
            if current_section == 'personal':
                GoogleDocsService._parse_personal_info(line, result['user_details'])
            elif current_section in ['education', 'experience']:
                item = GoogleDocsService._parse_section_item(line)
                if item:
                    current_items.append(item)
            elif current_section == 'skills':
                # Parse comma-separated skills
                skills = [s.strip() for s in line.replace('•', '').replace('-', '').split(',') if s.strip()]
                for skill in skills:
                    current_items.append({
                        'id': f'item_{len(current_items)+1}',
                        'primary': skill,
                        'secondary': '',
                        'timeline': '',
                        'description': ''
                    })
        
        # Add remaining section
        if current_section == 'education' and current_items:
            result['sections'].append({
                'id': f'sec_{len(result["sections"])+1}',
                'title': 'Educational Qualifications',
                'items': current_items
            })
        elif current_section == 'experience' and current_items:
            result['sections'].append({
                'id': f'sec_{len(result["sections"])+1}',
                'title': 'Employment History',
                'items': current_items
            })
        elif current_section == 'skills' and current_items:
            result['sections'].append({
                'id': f'sec_{len(result["sections"])+1}',
                'title': 'Skills',
                'items': current_items
            })
        
        return result
    
    @staticmethod
    def _parse_personal_info(line: str, user_details: dict):
        """Parse personal information line"""
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip().lower()
            value = value.strip()
            
            if 'name' in key:
                user_details['name'] = value
            elif 'email' in key:
                user_details['email'] = value
            elif 'phone' in key:
                user_details['phone'] = value
            elif 'linkedin' in key:
                # Ensure full URL
                if not value.startswith('http'):
                    value = f"https://{value}"
                user_details['linkedin'] = value
            elif 'github' in key:
                # Extract username
                github_username = value.replace('github.com/', '').replace('https://', '').replace('http://', '').strip('/')
                user_details['github_username'] = github_username
            elif 'job' in key or 'title' in key or 'role' in key:
                user_details['job_title'] = value
    
    @staticmethod
    def _parse_section_item(line: str) -> Dict[str, str]:
        """
        Parse a section item in format:
        - Primary | Secondary | Timeline | Description
        or
        • Primary | Secondary | Timeline | Description
        """
        line = line.lstrip('-•').strip()
        if not line:
            return None
        
        parts = [p.strip() for p in line.split('|')]
        
        if len(parts) >= 3:
            return {
                'id': f'item_{id(line)}',
                'primary': parts[0],
                'secondary': parts[1],
                'timeline': parts[2],
                'description': parts[3] if len(parts) > 3 else ''
            }
        return None

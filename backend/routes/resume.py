# backend/routes/resume.py

from fastapi import APIRouter, Body
from fastapi.responses import Response
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from pydantic import BaseModel
from typing import List, Dict, Any

# Define a Pydantic model to validate the incoming data structure
class ResumeData(BaseModel):
    user_details: Dict[str, Any]
    sections: List[Dict[str, Any]]
    template: str

router = APIRouter()
env = Environment(loader=FileSystemLoader('backend/templates'))

@router.post("/generate_resume")
async def generate_resume(data: ResumeData): # <-- Use our Pydantic model for validation
    
   
    # Convert the Pydantic model to a standard Python dictionary
    # The .model_dump() method is the modern way to do this in Pydantic v2
    resume_dict = data.model_dump() 
    
    template_name = resume_dict.get("template", "resume_modern") + ".html"
    template = env.get_template(template_name)

    import json
    print("---- DATA GOING TO TEMPLATE ----")
    print(json.dumps(resume_dict, indent=2))
    print("--------------------------------")
    
    # Pass the dictionary to the template, not the Pydantic model
    html_content = template.render(resume_dict)
    
    pdf_bytes = HTML(string=html_content).write_pdf()

    return Response(content=pdf_bytes, media_type='application/pdf')
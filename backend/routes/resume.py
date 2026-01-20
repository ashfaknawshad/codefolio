# backend/routes/resume.py

from fastapi import APIRouter, Body
from fastapi.responses import Response, HTMLResponse
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel
from typing import List, Dict, Any
from weasyprint import HTML, CSS
from io import BytesIO

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
    
    # Generate PDF using WeasyPrint
    try:
        pdf_bytes = HTML(string=html_content).write_pdf()
        print(f"PDF generated successfully: {len(pdf_bytes)} bytes")
        return Response(content=pdf_bytes, media_type='application/pdf')
        
    except Exception as e:
        print(f"Exception during PDF generation: {e}")
        import traceback
        traceback.print_exc()
        # Return HTML as fallback
        return HTMLResponse(content=html_content)
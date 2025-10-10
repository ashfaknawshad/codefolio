from fastapi import APIRouter, Body
from fastapi.responses import FileResponse
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import json

router = APIRouter()

env = Environment(loader=FileSystemLoader('backend/templates'))

@router.post("/generate_resume")
async def generate_resume(data: dict = Body(...)):
    template = env.get_template(f"{data['template']}.html")
    html_content = template.render(data)
    pdf = HTML(string=html_content).write_pdf()

    with open("resume.pdf", "wb") as f:
        f.write(pdf)

    return FileResponse("resume.pdf", media_type='application/pdf', filename='resume.pdf')

@router.get("/templates")
async def get_templates():
    return ["resume_basic", "resume_modern"]
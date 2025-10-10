from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import github, resume
app = FastAPI()
origins = [
"chrome-extension://<YOUR_EXTENSION_ID>",
]
app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=[""],
allow_headers=[""],
)
app.include_router(github.router)
app.include_router(resume.router)
@app.get("/")
def read_root():
    return {"message": "GitHub Resume Sync Backend"}
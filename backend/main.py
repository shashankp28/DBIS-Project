from routes import general, person, university, admin
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(general.router)
app.include_router(person.router)
app.include_router(university.router)
app.include_router(admin.router)
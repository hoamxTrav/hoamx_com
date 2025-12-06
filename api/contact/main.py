from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, Text, DateTime, func
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://hoamx_app:password@localhost:5432/hoamx_prod")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    association = Column(Text)
    role = Column(Text)
    message = Column(Text)
    source_page = Column(Text, nullable=False, default="contact.html")
    ip_address = Column(Text)
    user_agent = Column(Text)

# create table if it doesn't exist
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    association: str | None = None
    role: str | None = None
    message: str

app = FastAPI()

# Allow your site to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.hoamx.com", "https://hoamx.com"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.post("/api/contact")
async def create_contact(
    payload: ContactPayload,
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        client_host = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        cm = ContactMessage(
            name=payload.name.strip(),
            email=payload.email.strip(),
            association=(payload.association or "").strip() or None,
            role=(payload.role or "").strip() or None,
            message=payload.message.strip(),
            source_page="contact.html",
            ip_address=client_host,
            user_agent=user_agent,
        )
        db.add(cm)
        db.commit()
        db.refresh(cm)

        return {"ok": True, "id": cm.id}
    except Exception as e:
        # in real life: log this properly
        raise HTTPException(status_code=500, detail="Unable to submit message")

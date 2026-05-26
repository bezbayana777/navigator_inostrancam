from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()  # ← Загружает переменные из .env в окружение

from database import engine, Base, SessionLocal, get_db
from models import Building as DBBuilding, Room, Step as DBStep, Article, User
from auth import (
    UserCreate, UserLogin, Token, 
    create_access_token, get_password_hash, 
    verify_password, get_current_user
)

# Создаём таблицы при первом запросе
tables_created = False
def create_tables_if_needed():
    global tables_created
    if not tables_created:
        Base.metadata.create_all(bind=engine)
        tables_created = True

app = FastAPI(
    title="Navigator API",
    description="API для системы адаптации иностранных студентов",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# PYDANTIC SCHEMAS
# =============================================================================
class BuildingBase(BaseModel):
    name: str
    address: str
    description: Optional[str] = None
    lat: float
    lon: float
    class Config:
        orm_mode = True

class BuildingCreate(BuildingBase):
    pass

class BuildingResponse(BuildingBase):
    id: int

class StepBase(BaseModel):
    title: str
    icon: str
    order: int = 0
    class Config:
        orm_mode = True

class StepCreate(StepBase):
    id: int
    title_en: Optional[str] = None

class StepResponse(StepBase):
    id: int
    title_en: Optional[str] = None

class ArticleBase(BaseModel):
    title: str
    content: str
    content_en: Optional[str] = None
    order: int = 0
    checklist: Optional[List[dict]] = None  # ← Добавлено поле checklist
    class Config:
        orm_mode = True

class ArticleCreate(ArticleBase):
    step_id: int

class ArticleResponse(ArticleBase):
    id: int
    step_id: int

# =============================================================================
# AUTH ENDPOINTS
# =============================================================================
@app.post("/api/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password),
        country=user.country
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# =============================================================================
# API ENDPOINTS
# =============================================================================
@app.get("/health")
def health_check():
    create_tables_if_needed()
    return {"status": "ok"}

# --- BUILDINGS ---
@app.get("/api/buildings", response_model=List[BuildingResponse])
def get_buildings(db: Session = Depends(get_db)):
    return db.query(DBBuilding).all()

@app.post("/api/buildings", response_model=BuildingResponse)
def create_building(
    building: BuildingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_building = DBBuilding(**building.dict())
    db.add(db_building)
    db.commit()
    db.refresh(db_building)
    return db_building

# --- STEPS ---
@app.get("/api/steps", response_model=List[StepResponse])
def get_steps(db: Session = Depends(get_db)):
    return db.query(DBStep).order_by(DBStep.order).all()

@app.post("/api/steps", response_model=StepResponse)
def create_step(
    step: StepCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(DBStep).filter(DBStep.id == step.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Step with this ID already exists")
    db_step = DBStep(**step.dict())
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

# --- ARTICLES ---
@app.get("/api/steps/{step_id}/articles", response_model=List[ArticleResponse])
def get_step_articles(step_id: int, db: Session = Depends(get_db)):
    return db.query(Article).filter(Article.step_id == step_id).order_by(Article.order).all()

@app.post("/api/articles", response_model=ArticleResponse)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@app.put("/api/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    for key, value in article.dict().items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

@app.delete("/api/articles/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted"}

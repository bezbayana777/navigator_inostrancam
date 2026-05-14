# backend/tests/test_api.py

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def test_app_imports():
    """Тест что приложение импортируется без ошибок"""
    from main import app
    assert app is not None
    assert app.title == "Navigator API"

def test_app_has_routes():
    """Тест что в приложении есть эндпоинты"""
    from main import app
    routes = [r.path for r in app.routes]
    assert "/health" in routes
    assert "/api/steps" in routes
    assert "/api/buildings" in routes
    assert "/api/auth/register" in routes
    assert "/api/auth/login" in routes

def test_pydantic_schemas():
    """Тест что схемы данных импортируются"""
    from auth import UserCreate, UserLogin, Token
    from main import BuildingCreate, ArticleCreate, StepCreate
    
    # Проверяем что можно создать экземпляры
    user = UserCreate(email="t@t.com", username="test", password="123")
    assert user.email == "t@t.com"
    
    building = BuildingCreate(name="Test", address="Test", lat=1.0, lon=1.0)
    assert building.name == "Test"

def test_auth_functions():
    """Тест что функции аутентификации работают"""
    from auth import get_password_hash, verify_password
    
    password = "test123"
    hashed = get_password_hash(password)
    
    assert hashed != password  # Хеш не равен паролю
    assert verify_password(password, hashed)  # Пароль проверяется верно
    assert not verify_password("wrong", hashed)  # Неверный пароль не проходит
# backend/tests/test_api.py

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_steps():
    response = client.get("/api/steps")
    assert response.status_code == 200
    assert len(response.json()) == 6

def test_get_buildings():
    response = client.get("/api/buildings")
    assert response.status_code == 200
    assert len(response.json()) == 10

def test_get_articles():
    response = client.get("/api/steps/0/articles")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_login():
    response = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "test123"
    })
    assert response.status_code in [200, 401]

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_loan_prediction_approved():
    """Test loan prediction with parameters that should result in approval"""
    request_data = {
        "income": 75000,
        "credit_score": 750,
        "employment_type": "employed"
    }
    
    response = client.post("/loan/predict", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "approved" in data
    assert "probability" in data
    assert "reasoning" in data
    assert isinstance(data["approved"], bool)
    assert isinstance(data["probability"], float)
    assert 0 <= data["probability"] <= 1
    assert isinstance(data["reasoning"], str)

def test_loan_prediction_rejected():
    """Test loan prediction with parameters that should result in rejection"""
    request_data = {
        "income": 20000,
        "credit_score": 400,
        "employment_type": "unemployed"
    }
    
    response = client.post("/loan/predict", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "approved" in data
    assert "probability" in data
    assert "reasoning" in data
    assert isinstance(data["approved"], bool)
    assert data["probability"] < 0.5  # Should have low approval probability

def test_loan_prediction_invalid_income():
    """Test loan prediction with invalid income"""
    request_data = {
        "income": -5000,
        "credit_score": 700,
        "employment_type": "employed"
    }
    
    response = client.post("/loan/predict", json=request_data)
    
    assert response.status_code == 400
    assert "Income must be positive" in response.json()["detail"]

def test_loan_prediction_invalid_credit_score():
    """Test loan prediction with invalid credit score"""
    request_data = {
        "income": 50000,
        "credit_score": 900,  # Above valid range
        "employment_type": "employed"
    }
    
    response = client.post("/loan/predict", json=request_data)
    
    assert response.status_code == 400
    assert "Credit score must be between 300 and 850" in response.json()["detail"]

def test_loan_prediction_invalid_employment_type():
    """Test loan prediction with invalid employment type"""
    request_data = {
        "income": 50000,
        "credit_score": 700,
        "employment_type": "invalid_type"
    }
    
    response = client.post("/loan/predict", json=request_data)
    
    assert response.status_code == 400
    assert "Employment type must be" in response.json()["detail"]

def test_model_info():
    """Test the model info endpoint"""
    response = client.get("/loan/model-info")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "model_type" in data
    assert "features" in data
    assert "accuracy" in data
    assert "description" in data
    assert data["model_type"] == "Logistic Regression"

def test_loan_prediction_different_employment_types():
    """Test loan prediction with different employment types"""
    base_request = {
        "income": 50000,
        "credit_score": 650
    }
    
    employment_types = ["employed", "self-employed", "unemployed"]
    
    for emp_type in employment_types:
        request_data = {**base_request, "employment_type": emp_type}
        response = client.post("/loan/predict", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "approved" in data
        assert "probability" in data
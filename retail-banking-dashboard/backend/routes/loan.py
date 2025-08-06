from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.loan_predictor import LoanPredictor

router = APIRouter(prefix="/loan", tags=["loan"])

# Initialize loan predictor
loan_predictor = LoanPredictor()

class LoanRequest(BaseModel):
    income: float
    credit_score: int
    employment_type: str

class LoanResponse(BaseModel):
    approved: bool
    probability: float
    reasoning: str

@router.post("/predict", response_model=LoanResponse)
def predict_loan_approval(request: LoanRequest):
    """Predict loan approval based on customer financial data"""
    try:
        # Validate input
        if request.income < 0:
            raise HTTPException(status_code=400, detail="Income must be positive")
        if not (300 <= request.credit_score <= 850):
            raise HTTPException(status_code=400, detail="Credit score must be between 300 and 850")
        if request.employment_type.lower() not in ['unemployed', 'employed', 'self-employed']:
            raise HTTPException(status_code=400, detail="Employment type must be 'unemployed', 'employed', or 'self-employed'")
        
        # Make prediction
        result = loan_predictor.predict(
            income=request.income,
            credit_score=request.credit_score,
            employment_type=request.employment_type
        )
        
        return LoanResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/model-info")
def get_model_info():
    """Get information about the loan prediction model"""
    if not loan_predictor.is_trained:
        accuracy = loan_predictor.train()
    else:
        # Calculate accuracy on training data (for demo purposes)
        data = loan_predictor.prepare_training_data()
        X = data[loan_predictor.feature_names]
        y = data['approved']
        X_scaled = loan_predictor.scaler.transform(X)
        accuracy = loan_predictor.model.score(X_scaled, y)
    
    return {
        "model_type": "Logistic Regression",
        "features": loan_predictor.feature_names,
        "accuracy": round(accuracy, 3),
        "description": "Predicts loan approval based on income, credit score, and employment status"
    }
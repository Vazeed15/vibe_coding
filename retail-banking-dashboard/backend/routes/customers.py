from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from models import Customer, AccountType
from pydantic import BaseModel

router = APIRouter(prefix="/customers", tags=["customers"])

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    account_type: str
    balance: float
    credit_score: int
    income: float
    employment_type: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    """Get list of all customers"""
    customers = db.query(Customer).all()
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get customer profile by ID"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
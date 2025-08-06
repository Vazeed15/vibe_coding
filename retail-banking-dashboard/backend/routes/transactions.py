from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, date
from db.database import get_db
from models import Transaction, Customer, TransactionType, TransactionCategory
from pydantic import BaseModel

router = APIRouter(prefix="/transactions", tags=["transactions"])

class TransactionResponse(BaseModel):
    id: int
    customer_id: int
    amount: float
    transaction_type: str
    category: str
    description: str
    date: datetime
    
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    customer_id: int
    amount: float
    transaction_type: str
    category: str
    description: str

class SpendingAnalytics(BaseModel):
    category: str
    total_amount: float
    transaction_count: int

@router.get("/{customer_id}", response_model=List[TransactionResponse])
def get_customer_transactions(
    customer_id: int, 
    limit: int = Query(20, le=100),
    transaction_type: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get transactions for a specific customer with optional filters"""
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Build query
    query = db.query(Transaction).filter(Transaction.customer_id == customer_id)
    
    # Apply filters
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    if category:
        query = query.filter(Transaction.category == category)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    # Order by date and limit
    transactions = query.order_by(desc(Transaction.date)).limit(limit).all()
    
    return transactions

@router.post("/add", response_model=TransactionResponse)
def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Add a new transaction"""
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == transaction.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Create transaction
    db_transaction = Transaction(
        customer_id=transaction.customer_id,
        amount=transaction.amount,
        transaction_type=TransactionType(transaction.transaction_type),
        category=TransactionCategory(transaction.category),
        description=transaction.description,
        date=datetime.utcnow()
    )
    
    db.add(db_transaction)
    
    # Update customer balance
    if transaction.transaction_type == "credit":
        customer.balance += transaction.amount
    else:
        customer.balance -= transaction.amount
    
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.get("/{customer_id}/analytics", response_model=List[SpendingAnalytics])
def get_spending_analytics(customer_id: int, db: Session = Depends(get_db)):
    """Get spending analytics by category for a customer"""
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Get spending by category (only debit transactions)
    query = db.query(
        Transaction.category,
        db.func.sum(Transaction.amount).label('total_amount'),
        db.func.count(Transaction.id).label('transaction_count')
    ).filter(
        Transaction.customer_id == customer_id,
        Transaction.transaction_type == TransactionType.DEBIT
    ).group_by(Transaction.category)
    
    analytics = query.all()
    
    return [
        SpendingAnalytics(
            category=result.category.value,
            total_amount=result.total_amount,
            transaction_count=result.transaction_count
        )
        for result in analytics
    ]
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class AccountType(enum.Enum):
    SAVINGS = "savings"
    CHECKING = "checking"
    BUSINESS = "business"

class TransactionType(enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"

class TransactionCategory(enum.Enum):
    FOOD = "food"
    BILLS = "bills"
    SHOPPING = "shopping"
    EMI = "emi"
    SALARY = "salary"
    TRANSFER = "transfer"
    OTHER = "other"

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    account_type = Column(Enum(AccountType))
    balance = Column(Float, default=0.0)
    credit_score = Column(Integer, default=600)
    income = Column(Float, default=0.0)
    employment_type = Column(String, default="employed")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship("Transaction", back_populates="customer")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    amount = Column(Float)
    transaction_type = Column(Enum(TransactionType))
    category = Column(Enum(TransactionCategory))
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("Customer", back_populates="transactions")
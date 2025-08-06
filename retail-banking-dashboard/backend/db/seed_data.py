import pandas as pd
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Customer, Transaction, AccountType, TransactionType, TransactionCategory
from datetime import datetime
import os

def load_sample_data():
    """Load sample data from CSV files into the database"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Customer).first():
            print("Database already contains data. Skipping seed.")
            return
        
        # Load customers
        customers_file = os.path.join(os.path.dirname(__file__), '../../data/sample_customers.csv')
        customers_df = pd.read_csv(customers_file)
        
        print(f"Loading {len(customers_df)} customers...")
        
        for _, row in customers_df.iterrows():
            customer = Customer(
                id=row['id'],
                name=row['name'],
                email=row['email'],
                phone=row['phone'],
                account_type=AccountType(row['account_type']),
                balance=row['balance'],
                credit_score=row['credit_score'],
                income=row['income'],
                employment_type=row['employment_type']
            )
            db.add(customer)
        
        # Load transactions
        transactions_file = os.path.join(os.path.dirname(__file__), '../../data/transactions.csv')
        transactions_df = pd.read_csv(transactions_file)
        
        print(f"Loading {len(transactions_df)} transactions...")
        
        for _, row in transactions_df.iterrows():
            transaction = Transaction(
                id=row['id'],
                customer_id=row['customer_id'],
                amount=row['amount'],
                transaction_type=TransactionType(row['transaction_type']),
                category=TransactionCategory(row['category']),
                description=row['description'],
                date=datetime.strptime(row['date'], '%Y-%m-%d %H:%M:%S')
            )
            db.add(transaction)
        
        db.commit()
        print("Sample data loaded successfully!")
        
    except Exception as e:
        print(f"Error loading sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_sample_data()
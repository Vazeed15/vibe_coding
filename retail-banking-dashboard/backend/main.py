from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import create_tables
from routes import customers, transactions, loan

# Create FastAPI app
app = FastAPI(
    title="Smart Retail Banking Dashboard API",
    description="A comprehensive banking dashboard with ML-powered loan predictions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(customers.router)
app.include_router(transactions.router)
app.include_router(loan.router)

@app.on_event("startup")
def startup_event():
    """Create database tables on startup"""
    create_tables()

@app.get("/")
def read_root():
    """Root endpoint with API information"""
    return {
        "message": "Smart Retail Banking Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "customers": "/customers",
            "transactions": "/transactions",
            "loan_prediction": "/loan/predict",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "banking-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
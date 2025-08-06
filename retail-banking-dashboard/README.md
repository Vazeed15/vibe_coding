# 🏦 Smart Retail Banking Dashboard

A full-stack banking dashboard application with AI-powered loan approval prediction, built with modern technologies and best practices.

![Banking Dashboard](https://img.shields.io/badge/Version-1.0.0-blue) ![Python](https://img.shields.io/badge/Python-3.11+-green) ![React](https://img.shields.io/badge/React-18+-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

## 🎯 Features

### 🔐 Authentication
- **Role-based Access**: Customer and Staff roles with different permissions
- **Mock Authentication**: Simulated login system for demo purposes
- **Session Management**: Persistent login state with localStorage

### 👤 Customer Module
- **Profile Management**: View personal information, account details, and financial data
- **Account Overview**: Balance, credit score, account type, and income information
- **User-friendly Interface**: Clean, modern design with Tailwind CSS

### 💰 Transaction Management
- **Transaction History**: View last 20 transactions with filtering options
- **Filter by Date/Type**: Advanced filtering by transaction type, category, and date range
- **Add Transactions**: RESTful API for adding new transactions
- **Real-time Balance Updates**: Automatic balance calculations

### 📊 Spending Analytics
- **Visual Charts**: Interactive bar charts using Recharts library
- **Category Breakdown**: Spending analysis by categories (food, bills, shopping, EMI, etc.)
- **Monthly Insights**: Comprehensive spending patterns and trends

### 🤖 AI-Powered Loan Prediction
- **Machine Learning Model**: Logistic regression with scikit-learn
- **Real-time Predictions**: Instant loan approval predictions
- **Explainable AI**: Detailed reasoning for each prediction
- **Financial Factors**: Income, credit score, and employment status analysis
- **Improvement Suggestions**: Actionable recommendations for rejected applications

### 📄 Additional Features
- **API Documentation**: Auto-generated OpenAPI docs with FastAPI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Comprehensive error management and user feedback
- **Testing Suite**: PyTest for backend, Jest for frontend
- **Docker Support**: Containerized deployment with Docker Compose
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (with PostgreSQL support)
- **ORM**: SQLAlchemy
- **ML**: Scikit-learn for loan prediction
- **Testing**: PyTest with asyncio support
- **Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom banking theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Testing**: Jest with React Testing Library

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Railway/Render ready
- **Security**: Trivy vulnerability scanning
- **Monitoring**: Health checks and logging

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### 🐳 Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd retail-banking-dashboard
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### 🖥️ Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd db && python seed_data.py  # Load sample data
cd .. && uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔑 Demo Accounts

### Customer Account
- **Email**: `john.doe@email.com`
- **Password**: `demo123`
- **Features**: Dashboard, transactions, loan predictions

### Staff Account
- **Email**: `staff@bank.com`
- **Password**: `staff123`
- **Features**: Customer management, system overview

## 📚 API Documentation

The API is fully documented with OpenAPI/Swagger. Access the interactive documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Customer Management
- `GET /customers/` - List all customers
- `GET /customers/{id}` - Get customer profile

#### Transaction Management
- `GET /transactions/{customer_id}` - Get customer transactions
- `POST /transactions/add` - Add new transaction
- `GET /transactions/{customer_id}/analytics` - Get spending analytics

#### Loan Prediction
- `POST /loan/predict` - Predict loan approval
- `GET /loan/model-info` - Get model information

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Test Coverage
- Backend: Comprehensive API testing with FastAPI TestClient
- Frontend: Component testing with React Testing Library
- Integration: End-to-end workflow testing

## 🏗️ Project Structure

```
retail-banking-dashboard/
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── models.py           # Database models
│   ├── routes/             # API route handlers
│   │   ├── customers.py
│   │   ├── transactions.py
│   │   └── loan.py
│   ├── ml/                 # Machine learning
│   │   └── loan_predictor.py
│   ├── db/                 # Database management
│   │   ├── database.py
│   │   └── seed_data.py
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utilities and API calls
│   └── public/
├── data/                   # Sample data
│   ├── sample_customers.csv
│   └── transactions.csv
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Multi-container setup
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
└── README.md
```

## 🚀 Deployment

### Environment Variables

#### Backend
```env
DATABASE_URL=sqlite:///./banking.db
# For PostgreSQL: postgresql://user:password@localhost/banking
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:8000
```

### Production Deployment

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

#### Render
1. Create new web service
2. Connect repository
3. Configure build and start commands

#### Manual Docker
```bash
# Build images
docker build -f Dockerfile.backend -t banking-backend .
docker build -f Dockerfile.frontend -t banking-frontend .

# Run containers
docker run -d -p 8000:8000 banking-backend
docker run -d -p 3000:80 banking-frontend
```

## 🔧 Configuration

### Database Migration
For PostgreSQL setup:
1. Update `DATABASE_URL` in environment
2. Install PostgreSQL dependencies
3. Run migrations

### ML Model Customization
The loan prediction model can be retrained:
```python
from ml.loan_predictor import LoanPredictor

predictor = LoanPredictor()
accuracy = predictor.train()
predictor.save_model('./loan_model.pkl')
```

## 🛡️ Security Features

- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **CORS Configuration**: Properly configured cross-origin requests
- **Security Headers**: Implemented in Nginx configuration
- **Vulnerability Scanning**: Automated security scans in CI/CD

## 🎨 Design System

The application uses a custom banking-themed design system built with Tailwind CSS:

- **Primary Colors**: Blue-based palette for trust and professionalism
- **Banking Theme**: Custom color scheme for financial applications
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Docker Build Fails**
```bash
# Clear Docker cache
docker system prune -f
docker-compose build --no-cache
```

**Database Connection Error**
```bash
# Reset database
rm backend/banking.db
cd backend/db && python seed_data.py
```

**Port Already in Use**
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**Frontend Build Issues**
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For support, email support@banking-dashboard.com or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced ML models (Random Forest, XGBoost)
- [ ] Mobile app with React Native
- [ ] Advanced reporting with PDF generation
- [ ] Multi-tenant architecture
- [ ] Real-time transaction monitoring
- [ ] Integration with external banking APIs
- [ ] Advanced fraud detection
- [ ] Cryptocurrency support
- [ ] Investment portfolio tracking

---

**Made with ❤️ for modern banking experiences**
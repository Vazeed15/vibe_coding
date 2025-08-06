from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
import joblib
import os

class LoanPredictor:
    def __init__(self):
        self.model = LogisticRegression(random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = ['income', 'credit_score', 'employment_type_encoded']
        
    def prepare_training_data(self):
        """Create synthetic training data for the loan prediction model"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate features
        income = np.random.normal(50000, 20000, n_samples)
        credit_score = np.random.normal(650, 100, n_samples)
        employment_type = np.random.choice([0, 1, 2], n_samples)  # 0=unemployed, 1=employed, 2=self-employed
        
        # Create realistic loan approval logic
        # Higher income, better credit score, and employment increase approval probability
        approval_probability = (
            0.3 * (income / 100000) +  # Income factor
            0.4 * ((credit_score - 300) / 550) +  # Credit score factor (normalized 300-850)
            0.2 * (employment_type / 2) +  # Employment factor
            0.1 * np.random.normal(0, 0.1, n_samples)  # Random noise
        )
        
        # Convert to binary approval (0 or 1)
        approved = (approval_probability > 0.5).astype(int)
        
        # Create DataFrame
        data = pd.DataFrame({
            'income': income,
            'credit_score': credit_score,
            'employment_type_encoded': employment_type,
            'approved': approved
        })
        
        return data
    
    def train(self):
        """Train the loan prediction model"""
        # Get training data
        data = self.prepare_training_data()
        
        # Prepare features and target
        X = data[self.feature_names]
        y = data['approved']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        return self.model.score(X_scaled, y)
    
    def predict(self, income, credit_score, employment_type):
        """Predict loan approval for given parameters"""
        if not self.is_trained:
            self.train()
        
        # Encode employment type
        employment_mapping = {
            'unemployed': 0,
            'employed': 1,
            'self-employed': 2
        }
        employment_encoded = employment_mapping.get(employment_type.lower(), 1)
        
        # Prepare features
        features = np.array([[income, credit_score, employment_encoded]])
        features_scaled = self.scaler.transform(features)
        
        # Make prediction
        prediction = self.model.predict(features_scaled)[0]
        probability = self.model.predict_proba(features_scaled)[0][1]
        
        # Get feature importance for explanation
        coefficients = self.model.coef_[0]
        feature_contributions = features_scaled[0] * coefficients
        
        return {
            'approved': bool(prediction),
            'probability': float(probability),
            'reasoning': self._generate_explanation(
                income, credit_score, employment_type, 
                feature_contributions, probability
            )
        }
    
    def _generate_explanation(self, income, credit_score, employment_type, contributions, probability):
        """Generate human-readable explanation for the prediction"""
        explanations = []
        
        # Income analysis
        if income >= 60000:
            explanations.append(f"Good income level (${income:,.0f})")
        elif income >= 40000:
            explanations.append(f"Moderate income level (${income:,.0f})")
        else:
            explanations.append(f"Lower income level (${income:,.0f}) may impact approval")
        
        # Credit score analysis
        if credit_score >= 750:
            explanations.append(f"Excellent credit score ({credit_score:.0f})")
        elif credit_score >= 700:
            explanations.append(f"Good credit score ({credit_score:.0f})")
        elif credit_score >= 650:
            explanations.append(f"Fair credit score ({credit_score:.0f})")
        else:
            explanations.append(f"Lower credit score ({credit_score:.0f}) reduces approval chances")
        
        # Employment analysis
        if employment_type.lower() == 'employed':
            explanations.append("Stable employment status")
        elif employment_type.lower() == 'self-employed':
            explanations.append("Self-employed status (moderate risk)")
        else:
            explanations.append("Unemployment status significantly impacts approval")
        
        # Final decision
        if probability >= 0.7:
            decision = "Strong approval likelihood"
        elif probability >= 0.5:
            decision = "Moderate approval likelihood"
        else:
            decision = "Low approval likelihood"
        
        return f"{decision}. {'. '.join(explanations)}. Approval probability: {probability:.1%}"
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.is_trained:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler
            }, filepath)
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        if os.path.exists(filepath):
            loaded = joblib.load(filepath)
            self.model = loaded['model']
            self.scaler = loaded['scaler']
            self.is_trained = True
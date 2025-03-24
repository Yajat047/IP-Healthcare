from flask import Flask, request, jsonify, make_response
import pickle
import pandas as pd
from flask_cors import CORS
import logging

# Instantiate the app
app = Flask(__name__)

# Apply CORS to the entire app
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load the model
try:
    model = pickle.load(open('model.pkl', 'rb'))
    app.logger.info("Model loaded successfully")
except Exception as e:
    app.logger.error(f"Error loading model: {e}")

@app.route('/')
def index():
    return "Welcome to the Thyroid Predictor API"

@app.route('/thyroid/predict', methods=['POST'])
def predict():
    try:
        # Parsing the incoming JSON data
        data = request.get_json()
        app.logger.debug(f"\nReceived data: {data}\n")

        # Extracting the features
        features = [
            data['age'],
            data['sex'],
            data['on_thyroxine'],
            data['on_antithyroid_medication'],
            data['goitre'],
            data['hypopituitary'],
            data['psych'],
            data['T3'],
            data['TT4'],
            data['T4U'],
            data['FTI']
        ]
        
        # Converting to DataFrame
        df = pd.DataFrame([features], columns=[
            'age', 'sex', 'on_thyroxine', 'on_antithyroid_medication',
            'goitre', 'hypopituitary', 'psych', 'T3', 'TT4', 'T4U', 'FTI'
        ])
        app.logger.debug(f"Data prepared for prediction: {df}")

        # Predicting the result
        prediction = model.predict(df)
        app.logger.debug(prediction)
        result = 'Condition Present' if prediction[0] == 1 else 'Condition Not Present'
        
        # Example recommendation logic (this can be customized based on your needs)
        recom = 'Maintain a healthy lifestyle!'
        if df['TT4'][0] > 150:
            recom = 'Consider consulting a doctor about your thyroid levels.'

        return make_response(jsonify({'prediction': result, 'recommendation': recom}))
    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return make_response(jsonify({'error': 'An error occurred during prediction'}), 500)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

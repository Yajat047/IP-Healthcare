from flask import Flask, jsonify, make_response, request 
import pickle
import pandas as pd 
from flask_cors import CORS
import logging

fileName='heart.pkl'

app=Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

logging.basicConfig(level=logging.DEBUG)

try:
    model = pickle.load(open(fileName, 'rb'))
    app.logger.info("Model loaded successfully")
except Exception as e:
    app.logger.error(f"Error loading model: {e}")

@app.route('/')
def home():
    return "Welcome to the Heart Disease API"


@app.route('/heart-disease/predict' , methods=['POST'])
def predict():
    try:
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")

        features=[
             data['age'],
             data['sex'],
             data['cp'],
             data['trestbps'],
             data['chol'],
             data['fbs'],
             data['restecg'],
             data['thalach'],
             data['exang'],
             data['oldpeak'],
             data['slope'],
             data['ca'],
             data['thal']
        ]

        

        df = pd.DataFrame([features], columns=[
            'age', 'sex', 'cp', 'trestbps',
            'chol', 'fbs', 'restecg', 'thalach','exang','oldpeak','slope','ca','thal'
        ])

        app.logger.debug(f"Data prepared for prediction: {df}")
        prediction = model.predict(df)
        result = 'Probability of Heart Disease' if prediction[0] == 1 else 'No Probability of Heart Disease'
    
       
        return make_response(jsonify({'prediction': result}))
    
    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return make_response(jsonify({'error': 'An error occurred during prediction'}), 500)
    

if __name__ == '__main__':
    app.run(debug=True)
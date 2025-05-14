import React, { useState } from "react";
import { Navbar } from "../Components/Navbar";

const DiabetesPredictor = () => {
  // Define state for each form input
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heartDisease: "",
    smoking: "",
    bmi: "",
    hbg4: "",
    glucose: "",
  });

  const [predictionResult, setPredictionResult] = useState("");
  const [recommendation, setRecommendation] = useState("");

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert form data to numeric values as needed
    const genderNumeric = formData.gender === "male" ? 0 : formData.gender === "female" ? 1 : 2;
    const hypertensionNumeric = formData.hypertension === "yes" ? 1 : 0;
    const heartNumeric = formData.heartDisease === "yes" ? 1 : 0;
    let smokingNumeric;
    switch (formData.smoking) {
      case "never":
        smokingNumeric = 0;
        break;
      case "ever":
        smokingNumeric = 3;
        break;
      case "current":
        smokingNumeric = 1;
        break;
      case "not current":
        smokingNumeric = 2;
        break;
    }

    // Prepare the data object to be sent to the backend
    const preparedData = {
      gender: genderNumeric,
      age: parseInt(formData.age),
      hypertension: hypertensionNumeric,
      heart_disease: heartNumeric,
      smoking_history: smokingNumeric,
      bmi: parseFloat(formData.bmi),
      HbA1c_level: parseFloat(formData.hbg4),
      blood_glucose_level: parseFloat(formData.glucose),
    };


    fetch("http://localhost:5000/diabetes/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(preparedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Prediction result:", data);
        setPredictionResult("Predicted Result: " + data.prediction);
        setRecommendation("Recommendation: " + data.recommendation);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tl from-green-400 to-blue-500 p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          Diabetes Predictor
        </h2>
        <form
          id="diabetes-form"
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <div className="form-group mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender:
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Age:
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hypertension:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hypertension"
                  value="yes"
                  checked={formData.hypertension === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hypertension"
                  value="no"
                  checked={formData.hypertension === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Disease:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="heartDisease"
                  value="yes"
                  checked={formData.heartDisease === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="heartDisease"
                  value="no"
                  checked={formData.heartDisease === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="smoking"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Smoking History:
            </label>
            <select
              name="smoking"
              id="smoking"
              value={formData.smoking}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">select</option>
              <option value="never">Never</option>
              <option value="ever">Ever</option>
              <option value="current">Current</option>
              <option value="not current">Not current</option>
            </select>
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="bmi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              BMI:
            </label>
            <input
              type="number"
              step="any"
              name="bmi"
              id="bmi"
              value={formData.bmi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="hbg4"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Haemoglobin level (g/dL):
            </label>
            <input
              type="number"
              step="any"
              name="hbg4"
              id="hbg4"
              value={formData.hbg4}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="glucose"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Glucose level (mg/dL):
            </label>
            <input
              type="number"
              step="any"
              name="glucose"
              id="glucose"
              value={formData.glucose}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Predict
          </button>
        </form>
        {predictionResult && (
          <div className="mt-6 p-4 w-full max-w-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-md">
            {predictionResult}
          </div>
        )}
        {recommendation && (
          <div className="mt-4 p-4 w-full max-w-lg bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md shadow-md">
            {recommendation}
          </div>
        )}
        {/* {alert(predictionResult)} */}
      </div>
    </>
  );
};

export default DiabetesPredictor;

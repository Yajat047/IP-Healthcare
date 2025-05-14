import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "../Components/Navbar";

const ThyroidPredictor = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    on_thyroxine: "",
    on_antithyroid_medication: "",
    goitre: "",
    hypopituitary: "",
    psych: "",
    T3: "",
    TT4: "",
    T4U: "",
    FTI: "",
  });

  const [predictionResult, setPredictionResult] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // Prepare the data object to be sent to the backend
    const preparedData = {
      age: parseInt(formData.age),
      sex: formData.sex === "male" ? 0 : 1,
      on_thyroxine: formData.on_thyroxine === "yes" ? 1 : 0,
      on_antithyroid_medication:
        formData.on_antithyroid_medication === "yes" ? 1 : 0,
      goitre: formData.goitre === "yes" ? 1 : 0,
      hypopituitary: formData.hypopituitary === "yes" ? 1 : 0,
      psych: formData.psych === "yes" ? 1 : 0,
      T3: parseFloat(formData.T3),
      TT4: parseFloat(formData.TT4),
      T4U: parseFloat(formData.T4U),
      FTI: parseFloat(formData.FTI),
    };

    try {
      const response = await fetch("http://localhost:5000/thyroid/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(preparedData),
      });

      const data = await response.json();
      if (response.ok) {
        setPredictionResult(data.prediction);
        setRecommendation(data.recommendation);
      } else {
        setError(data.error || "An error occurred during prediction");
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tl from-green-400 to-blue-500 p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          Hypothyroidism Predictor
        </h2>
        <form
          id="medical-form"
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group mb-4">
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700 mb-2 capitalize"
              >
                {key.replace(/_/g, " ")}:
              </label>
              {[
                "sex",
                "on_thyroxine",
                "on_antithyroid_medication",
                "goitre",
                "hypopituitary",
                "psych",
              ].includes(key) ? (
                <select
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">select</option>
                  {key === "sex" ? (
                    <>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </>
                  ) : (
                    <>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={key === "age" ? "number" : "text"}
                  step={
                    ["T3", "TT4", "T4U", "FTI"].includes(key)
                      ? "any"
                      : undefined
                  }
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Predict
          </button>
        </form>
        {predictionResult && (
          <div className="mt-6 p-4 w-full max-w-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-md">
            Predicted Result: {predictionResult}
          </div>
        )}
        {recommendation && (
          <div className="mt-4 p-4 w-full max-w-lg bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md shadow-md">
            Recommendation: {recommendation}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 w-full max-w-lg bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-md">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default ThyroidPredictor;

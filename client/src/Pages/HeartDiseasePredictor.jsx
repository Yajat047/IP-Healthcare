import React, { useState } from "react";
import { Navbar } from "../Components/Navbar";

const HeartDiseasePredictor = () => {
const [formData, setFormData] = useState({
  age: "",
  sex: "",
  chestPainType: "",
  restingBloodPressure: "",
  serumCholesterol: "",
  fastingBloodSugar: "",
  restingECGresults: "",
  maxHeartRate: "",
  exerciseInducedAngina: "",
  stDepression: "",
  slopeOfPeakExSTsegment: "",
  numberOfMajorVessels: "",
  thalassemia: "",
});

const [predictionResult, setPredictionResult] = useState("");
const [recommendation, setRecommendation] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleSubmit = (e) => {
  e.preventDefault();

  const genderNumeric = formData.sex === "male" ? 1 : 0;
  let chectptypeNumeric;
  if (formData.chestPainType === "typical angina") {
    chectptypeNumeric = 0;
  } else if (formData.chestPainType === "atypical angina") {
    chectptypeNumeric = 1;
  } else if (formData.chestPainType === "non anginal") {
    chectptypeNumeric = 2;
  } else if (formData.chestPainType === "asymptotic") {
    chectptypeNumeric = 3;
  }

  const bloodSugarNumeric = formData.fastingBloodSugar === "greater" ? 1 : 0;

  const ecgNumeric =
    formData.restingECGresults === "normal"
      ? 0
      : formData.restingECGresults === "abnormal"
      ? 1
      : 2;

  const exerciseanNumeric = formData.exerciseInducedAngina === "yes" ? 1 : 0;

  const slopeSegment =
    formData.slopeOfPeakExSTsegment === "upslopping"
      ? 0
      : formData.slopeOfPeakExSTsegment === "flat"
      ? 1
      : 2;

  const thalaNumeric =
    formData.thalassemia === "normal"
      ? 3
      : formData.thalassemia === "fixed defect"
      ? 6
      : 7;

  const preparedData = {
    age: parseInt(formData.age),
    sex: genderNumeric,
    cp: chectptypeNumeric,
    trestbps: parseInt(formData.restingBloodPressure),
    chol: parseInt(formData.serumCholesterol),
    fbs: bloodSugarNumeric,
    restecg: ecgNumeric,
    thalach: parseInt(formData.maxHeartRate),
    exang: exerciseanNumeric,
    oldpeak: parseFloat(formData.stDepression),
    slope: slopeSegment,
    ca: parseInt(formData.numberOfMajorVessels),
    thal: thalaNumeric,
  };

  fetch("http://localhost:5000/heart-disease/predict", {
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
      setPredictionResult("Prediction Result: " + data.prediction);
      setRecommendation("Recommendation: " + data.recommendation);
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
};


  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tl from-green-400 to-blue-500 p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          Heart Disease Predictor
        </h2>

        <form
          id="heartdiseaseForm"
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
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
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sex:
            </label>

            <select
              name="sex"
              id="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="chestPainType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chest Pain Type:
            </label>

            <select
              name="chestPainType"
              id="chestPainType"
              value={formData.chestPainType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="typical angina">Typical Angina</option>
              <option value="atypical angina">Atypical Angina</option>
              <option value="non anginal">Non-anginal Pain</option>
              <option value="asymptotic">Asymptomatic</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="restingBloodPressure"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resting Blood Pressure
            </label>

            <input
              type="number"
              step="any"
              name="restingBloodPressure"
              id="restingBloodPressure"
              value={formData.restingBloodPressure}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="serumCholesterol"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Serum Cholesterol:
            </label>

            <input
              type="number"
              step="any"
              name="serumCholesterol"
              id="serumCholesterol"
              value={formData.serumCholesterol}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="fastingBloodSugar"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fasting Blood Sugar:
            </label>

            <select
              name="fastingBloodSugar"
              id="fastingBloodSugar"
              value={formData.fastingBloodSugar}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="greater">Greater than 120 mg/dl</option>
              <option value="lesser">Less than 120 mg/dl</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="restingECGresults"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resting ECG Results:
            </label>

            <select
              name="restingECGresults"
              id="restingECGresults"
              value={formData.restingECGresults}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="abnormal">Having ST-T wave abnormality</option>
              <option value="other">
                Probable or definite left ventricular hypertrophy by Estes'
                criteria
              </option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="maxHeartRate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Max Heart Rate:
            </label>

            <input
              type="number"
              step="any"
              name="maxHeartRate"
              id="maxHeartRate"
              value={formData.maxHeartRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Induced Angina:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exerciseInducedAngina"
                  value="yes"
                  checked={formData.exerciseInducedAngina === "yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exerciseInducedAngina"
                  value="no"
                  checked={formData.exerciseInducedAngina === "no"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="stDepression"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ST Depression:
            </label>

            <input
              type="number"
              step="any"
              name="stDepression"
              id="stDepression"
              placeholder="ST depression, typically in [0-6.2]"
              value={formData.stDepression}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="slopeOfPeakExSTsegment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slope of the Peak Exercise ST Segmen:
            </label>

            <select
              name="slopeOfPeakExSTsegment"
              id="slopeOfPeakExSTsegment"
              value={formData.slopeOfPeakExSTsegment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="upslopping">Upslopping</option>
              <option value="flat">Flat</option>
              <option value="down">Down Slopping</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="numberOfMajorVessels"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Major Vessels:
            </label>

            <input
              type="number"
              step="any"
              name="numberOfMajorVessels"
              id="numberOfMajorVessels"
              placeholder="Typically in [0-4]"
              value={formData.numberOfMajorVessels}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="thalassemia"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thalassemia:
            </label>

            <select
              name="thalassemia"
              id="thalassemia"
              value={formData.thalassemia}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="fixed defect">Fixed Defect</option>
              <option value="reversible defect">Reversible Defect</option>
            </select>
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
      </div>
    </>
  );
};

export default HeartDiseasePredictor;

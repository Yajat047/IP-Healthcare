# E-Healthcare Management System

Welcome to Aaragya, a cutting-edge platform designed to revolutionize healthcare delivery and management. Built with the powerful MERN stack, our system ensures a seamless and efficient experience for both healthcare providers and patients.

1\. Introduction
----------------

### 1.1 Purpose

The purpose of this document is to provide a comprehensive overview of the requirements for the e-HMS (Electronic Health Management System) website. This system is designed to streamline and manage healthcare services, including patient appointments, doctor schedules, and administrative tasks, with integrated machine learning for health predictions.

### 1.2 Scope

The e-HMS website is a centralized platform built using the MERN stack. It includes three main user modules (Patient, Doctor, Admin) and integrates several machine learning models to predict health conditions. The system supports secure user authentication and data management, cloud-based image storage, and robust form validation.

2\. Screenshots
---------------
![1](https://github.com/biswarup-naha/E-healthcare-Management-System/assets/110123267/b63bcbb1-5204-4c41-951c-2e68828a7585)
![2](https://github.com/biswarup-naha/E-healthcare-Management-System/assets/110123267/4dd31c7f-99e3-4ad1-8b9c-afe166fb2d19)
![3](https://github.com/biswarup-naha/E-healthcare-Management-System/assets/110123267/33bda2cf-a48d-4d35-85d9-06801aab7abb)




3\. Description
-----------------------

### 3.1 Product Perspective

The e-HMS website is designed to be a standalone application that integrates various aspects of healthcare management. It provides a unified platform for patients, doctors, and administrators, enabling seamless interaction and data management.

### 3.2 Product Features

-   **Patient Module**: Appointment booking, dashboard for viewing appointment status.
-   **Doctor Module**: Personalized dashboard for managing appointments (accept/reject).
-   **Admin Module**: User management (add/remove doctors and admins), query handling.
-   **Frontend**: UI is developed using React and tailwindCSS.
-   **Backend**: The native server is built using Node and Express with RESTful API design.
-   **Machine Learning Models**: Predictive analytics for heart disease, diabetes, and thyroid conditions.
-   **Secure Authentication**: Stateful JWT for managing user sessions.
-   **Cloud Storage**: Cloudinary for managing image uploads.
-   **Form Validation**: Zod for validating user inputs.
-   **Database**: MongoDB for storing user and appointment data.

### 3.3 User Classes and Characteristics

-   **Patients**: Users who can book appointments and view their status. They require an intuitive interface and easy navigation.
-   **Doctors**: Users who manage appointments. They need a personalized dashboard to efficiently accept or reject appointments.
-   **Admins**: Users who manage the system, including adding/removing doctors and handling user queries. They need access to comprehensive user management tools.

### 3.4 Operating Environment

-   **Frontend**: React.js, compatible with modern web browsers.
-   **Backend**: Node.js with Express.js, hosted on a server or cloud platform.
-   **Database**: MongoDB, either locally hosted or cloud-based (e.g., MongoDB Atlas).
-   **Cloud Storage**: Cloudinary for image storage.
-   **Machine Learning API**: Flask-based API for model integration.

### 3.5 Design and Implementation Constraints

-   **Scalability**: The system should be designed to handle a growing number of users and data.
-   **Security**: Data must be protected with secure authentication and storage practices.
-   **Performance**: The system should provide quick responses and minimal downtime.            

### 3.6 **Benefits:**

* **Enhanced Patient Care:** Streamlined processes and easy access to medical records improve patient outcomes.
    
* **Operational Efficiency:** Automated scheduling, billing, and record-keeping reduce administrative burdens.
    
* **Secure & Compliant:** Adherence to healthcare regulations ensures data privacy and security.
    
* **Scalable & Flexible:** The MERN stack provides a robust foundation that can scale with your needs.

import React from "react";
import { Navbar } from "../Components/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-12">
          About Us
        </h1>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-teal-600 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg">
                Our mission is to revolutionize the healthcare industry by
                leveraging technology to provide efficient, accessible, and
                comprehensive healthcare services. We strive to enhance patient
                care through seamless integration of digital solutions.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="health-tech.jpg"
                alt="Healthcare Technology"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:order-2">
              <img
                src="doctors.webp"
                alt="Doctors"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="md:order-1">
              <h2 className="text-3xl font-semibold text-teal-600 mb-4">
                Our Team
              </h2>
              <p className="text-gray-700 text-lg">
                We are a diverse team of professionals dedicated to improving
                healthcare outcomes. Our team includes experts from the fields
                of medicine, technology, and customer service, all working
                together to provide exceptional service.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-teal-600 mb-4">
                Our Values
              </h2>
              <p className="text-gray-700 text-lg">
                We believe in compassion, innovation, and integrity. Our values
                drive us to constantly seek better ways to serve our patients
                and to deliver healthcare solutions that are not only effective
                but also empathetic and ethical.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="./values.jpg"
                alt="Values and Ethics"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-teal-600 mb-8">
            Meet the Team
          </h2>
          <div className="flex justify-center gap-16 flex-wrap">
            {[
              {
                name: "Yajat Dureja",
                role: "Lead Developer",
                image: "blank.png",
              },
              {
                name: "Yajur Harit",
                role: "Lead Developer",
                image: "blank.png",
              },
            ].map((teamMember, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-4">
                  <img
                    src={teamMember.image}
                    alt={teamMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {teamMember.name}
                </h3>
                <p className="text-teal-600">{teamMember.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;

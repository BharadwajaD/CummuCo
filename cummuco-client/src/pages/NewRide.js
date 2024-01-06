import React, { useState } from "react";
import "../styles/NewRide.css";

const NewRide = () => {
  const [rideDetails, setTripDetails] = useState({
    rideId: "",
    driverName: "",
    driverPhone: "",
    cabNo: "",
    companionNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDetails({ ...rideDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rideDetails),
      });

      if (response.ok) {
        console.log("Data sent successfully");
        // Handle success, reset the form, etc.
      } else {
        console.error("Failed to send data");
        // Handle failure, show error message, etc.
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="ride-form">
      <form onSubmit={handleSubmit}>
        <div className="form-block">
          <label htmlFor="rideId">Trip ID:</label>
          <input
            type="text"
            id="rideId"
            name="rideId"
            value={rideDetails.rideId}
            onChange={handleChange}
          />

          <label htmlFor="driverName">Driver Name:</label>
          <input
            type="text"
            id="driverName"
            name="driverName"
            value={rideDetails.driverName}
            onChange={handleChange}
          />

          <label htmlFor="driverPhone">Driver Phone No:</label>
          <input
            type="text"
            id="driverPhone"
            name="driverPhone"
            value={rideDetails.driverPhone}
            onChange={handleChange}
          />

          <label htmlFor="cabNo">Cab No:</label>
          <input
            type="text"
            id="cabNo"
            name="cabNo"
            value={rideDetails.cabNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-block">
          <label htmlFor="companionNumber">Companion Number:</label>
          <input
            type="text"
            id="companionNumber"
            name="companionNumber"
            value={rideDetails.companionNumber}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewRide;

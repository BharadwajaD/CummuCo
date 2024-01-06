import React, { useState } from "react";
import { postFetch } from "../utils/fetch";
import "../styles/NewRide.css";

const NewRide = () => {

    const [isError, setIsError] = useState(false);
    const [rideId, setRideId] = useState('');

  const [rideDetails, setRideDetails] = useState({
    driver_name: "",
    driver_phone: "",
    cab_number: "",
    companion_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails({ ...rideDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = 'http://127.0.0.1:8000/ride'

      postFetch(url, rideDetails)
          .then(body => {
              setRideId(body.rideId)
          })
          .catch(err => {
              setIsError(true)
          })
  };

  return (
    <div className="ride-form">
      <h2> Share your ride </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-block">

          <label htmlFor="driver_name">Driver Name:</label>
          <input
            type="text"
            id="driver_name"
            name="driver_name"
            value={rideDetails.driver_name}
            onChange={handleChange}
          />

          <label htmlFor="driver_phone">Driver Phone No:</label>
          <input
            type="text"
            id="driver_phone"
            name="driver_phone"
            value={rideDetails.driver_phone}
            onChange={handleChange}
          />

          <label htmlFor="cab_number">Cab No:</label>
          <input
            type="text"
            id="cab_number"
            name="cab_number"
            value={rideDetails.cab_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-block">
          <label htmlFor="companion_number">Companion Number:</label>
          <input
            type="text"
            id="companion_number"
            name="companion_number"
            value={rideDetails.companion_number}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Send Link</button>
      </form>
      {rideId.length > 0 && <p className="rideid"> Your ride id: {rideId}</p>}
    </div>
  );
};

export default NewRide;

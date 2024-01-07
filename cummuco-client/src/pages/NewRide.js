import React, { useState } from "react";
import { postFetch } from "../utils/fetch";
import "../styles/NewRide.css";
import { setValue } from "../utils/storage";

const NewRide = ({setRole_}) => {

    setRole_('traveller')

    const [rideId, setRideId] = useState('');
    const [rideDetails, setRideDetails] = useState({
        driver_name: "",
        driver_phone: "",
        cab_number: "",
        pickup_point: "",
        drop_point: "",
        location: null,
        companion_number: "",
    });

    const [isError, setIsError] = useState(false);

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

                if(body.token){
                    setValue('token', body.token)
                }
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


          <label htmlFor="drop_point">Drop Point:</label>
          <input
            type="text"
            id="drop_point"
            name="drop_point"
            value={rideDetails.drop_point}
            onChange={handleChange}
          />

          <label htmlFor="pickup_point">Pickup Point:</label>
          <input
            type="text"
            id="pickup_point"
            name="pickup_point"
            value={rideDetails.pickup_point}
            onChange={handleChange}
          />
        </div>

          <label htmlFor="companion_number">CompanionNumber:</label>
          <input
            type="text"
            id="companion_number"
            name="companion_number"
            value={rideDetails.companion_number}
            onChange={handleChange}
          />

        <button type="submit">Send Link</button>
      </form>
      {isError && <p className="error-message"> 'Something went wrong' </p>}
      {rideId.length > 0 && <p className="rideid"> Your ride id: {rideId}</p>}
      {rideId.length > 0 && <p className="rideid"> Message sent to : {rideDetails.companion_number}</p>}
    </div>
  );
};

export default NewRide;

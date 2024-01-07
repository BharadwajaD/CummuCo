//TODO: style this page
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFetch } from "../utils/fetch";
import  SignIn  from "./SignIn";
import "../styles/ViewRide.css";

export function ViewRide(){

    const {id: ride_id} = useParams()

    const updateTime = parseInt(process.env.UPDATE_TIME, 10) || 5*1000

    const [rideInfo, setRideInfo] = useState(null)
    const [isError, setIsError] = useState(false);


    //To get data for first time
    useEffect(() => {
        const url = `http://127.0.0.1:8000/ride/${ride_id}?share=true`
        getFetch(url).then(body => setRideInfo(body)).catch(() => setIsError(true))
    }, [])

    //pooling to get updated location
    useEffect(() => {
        const url = `http://127.0.0.1:8000/ride/${ride_id}`
        const intervalId = setInterval(() => {
            getFetch(url).then(body => setRideInfo(body)).catch(() => setIsError(true))
        }, updateTime)

        return () => clearInterval(intervalId)
    }, [])

    
    return (
        <div className="ride-view">
            {isError && <SignIn redirect={window.location.href}/>}
            {rideInfo && (
                <div className="ride-details">
                <h2>Ride Details</h2>
                <div className="driver-details">
                <p>
                <strong>Driver Name:</strong> {rideInfo.driver_name}
                </p>
                <p>
                <strong>Driver Contact No:</strong> {rideInfo.driver_phone}
                </p>
                <p>
                <strong>Cab No:</strong> {rideInfo.cab_number}
                </p>
                </div>
                <div className="location-details">
                <p>
                <strong>Pickup Point:</strong> {rideInfo.pickup_point}
                </p>
                <p>
                <strong>Drop Point:</strong> {rideInfo.drop_point}
                </p>
                </div>
                </div>
            )}
        </div>
    );
}


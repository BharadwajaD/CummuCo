//TODO: style this page
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getFetch } from "../utils/fetch";
import  SignIn  from "./SignIn";
import Map from "../utils/Map";
import "../styles/ViewRide.css";

export function ViewRide(){

    const {id: ride_id} = useParams()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const share = params.get('share');

    const updateTime = parseInt(process.env.UPDATE_TIME, 10) || 5*1000

    const [rideInfo, setRideInfo] = useState(null)
    const [isError, setIsError] = useState(false);
    const [isForbidden, setIsForbidded] = useState(false);


    //To get data for first time
    useEffect(() => {
        let url = `http://127.0.0.1:8000/ride/${ride_id}?share=false`
        if(share){
            console.log(share)
            url = `http://127.0.0.1:8000/ride/${ride_id}?share=true`
        }
        getFetch(url).then(body => {
            setRideInfo(body)
            setIsForbidded(false)
        }
        ).catch(() => setIsError(true))
    }, [])

    //pooling to get updated location
    useEffect(() => {
        if(!isForbidden){
            console.log('running this ')
            const url = `http://127.0.0.1:8000/ride/${ride_id}`
            const intervalId = setInterval(() => {
                getFetch(url).then(body => setRideInfo(body)).catch((e) => {
                    setIsError(true)
                    if(e.message === 'forbidden'){
                        setIsForbidded(true)
                        setIsError(false)
                    }
                }
                )
            }, updateTime)

            return () => clearInterval(intervalId)
        }
    }, [isForbidden])


    
    return (
        <div className="ride-view">
            {isForbidden && <p> You donot have access to this ride</p>}
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
                {rideInfo && rideInfo.location && <Map latitude={rideInfo.location.latitude} longitude={rideInfo.location.longitude}/>}
        </div>
    );
}


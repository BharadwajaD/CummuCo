//TODO: style this page
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getFetch } from "../utils/fetch";

export function ViewRide(){

    const {id: ride_id} = useParams()
    const qparams = new URLSearchParams(useLocation().search)
    const share = qparams.get('share')

    const updateTime = parseInt(process.env.UPDATE_TIME, 10) || 5*1000

    const [rideInfo, setRideInfo] = useState(null)
    const [isError, setIsError] = useState(false);


    //To get data for first time
    useEffect(() => {
        const url = `http://127.0.0.1:8000/ride/${ride_id}?share=${share}`
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
            {isError && <p className="error-message"> 'Something went wrong' </p>}
            {rideInfo && (
                <div>
                <div className="ride-info">
                {Object.entries(rideInfo).map(([key, value]) => (
                    <div key={key}>
                        <span className="ride-info-key"> {('_'+key).replace(/_([a-z])/g, (_, match) => match.toUpperCase())}: </span>
                        <span className="ride-info-value"> {JSON.stringify(value)} </span>
                    </div>
                ))}
                </div>
                </div>
        )}
        </div>
    );
}

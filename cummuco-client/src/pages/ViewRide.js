//TODO: style this page
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFetch } from "../utils/fetch";

export function ViewRide(){

    const [rideInfo, setRideInfo] = useState(null)
    const [isError, setIsError] = useState(false);

    //TODO: write a function which updates location after every t time
    
    const [location, setLocation] = useState(rideInfo && rideInfo.current_location);

    const {id: ride_id} = useParams()

    const url = `http://127.0.0.1:8000/ride/${ride_id}`

    useEffect(() => {
        getFetch(url).then(body => setRideInfo(body)).catch(() => setIsError(true))
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
                        <span className="ride-info-value"> {value} </span>
                    </div>
                ))}
                </div>
                    <div className="ride-location">
                        {location && <p>location</p>}
                     </div>
                </div>
        )}
        </div>
    );
}

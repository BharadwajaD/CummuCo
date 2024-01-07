import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import NewRide from "./pages/NewRide";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import { ViewRide } from "./pages/ViewRide";
import { postFetch } from "./utils/fetch";
import { getValue } from "./utils/storage";


function App() {

    const updateTime = parseInt(process.env.UPDATE_TIME, 10) || 5*1000

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [role, setRole] = useState('');
    
    //console.log(role)

    //location watch and update should be done from travellers side
    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        const successCallback = (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            //console.log(position, 'location: ', location)
            console.log(position, location)
            setError(null);
        };

        const errorCallback = (err) => {
            setError(`Error getting location: ${err.message}`);
        };

        if(role == 'traveller'){
            const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

            const apiIntervalId = setInterval(() => {
                if (location) {
                    updateLocation(location);
                }
            }, updateTime);

            return () => {
                navigator.geolocation.clearWatch(watchId);
                clearInterval(apiIntervalId);
            }
        };
    }, [role]); 

    const updateLocation = (updatedLocation) => {
        const rideId = getValue('ride_id')
        console.log(rideId)
        const url = `http://127.0.0.1:8000/ride/${rideId}`
        console.log('update :', location, url)
        postFetch(url, {'location': updatedLocation}).then().catch(err => console.error(err.message))
    };

    return (
        <Router>

        <Routes>

        <Route path="/" element = <Home /> />
        <Route path="/signin" element = <SignIn /> />
        <Route path="/signup" element = <Signup /> />
        <Route path="/newride" element = <NewRide setRole_ = {setRole} /> />
        <Route path="/ride/:id" element = <ViewRide /> />
        <Route path="/error" element={<Error />} />

        </Routes>
        </Router>
    );
}

export default App;

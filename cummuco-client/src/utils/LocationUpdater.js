import { useEffect, useState } from 'react';
import { postFetch } from './fetch';

const LocationUpdater = ({ ride_id }) => {
    const updateTime = parseInt(process.env.UPDATE_TIME, 10) || 5 * 1000;
    const [locationPermission, setLocationPermission] = useState(null);

 // Function to fetch the device's location
  const fetchLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Make a POST request with the current location to your API
      const { latitude, longitude } = position.coords;
      const apiUrl = `http://127.0.0.1:8000/ride/${ride_id}`;
      const updatedLocation = {
        latitude,
        longitude,
      };

      console.log(ride_id, updatedLocation);

      // should I need await here ???
      await postFetch(apiUrl, { location: updatedLocation });
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    // Set the interval for fetching and updating location
    const intervalId = setInterval(() => {
        fetchLocation();
    }, updateTime);

    return () => clearInterval(intervalId);
  }, [locationPermission, updateTime]);

  return null;
};

export default LocationUpdater;

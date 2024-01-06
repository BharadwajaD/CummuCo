import { useState, useEffect } from 'react';

const fetchDataAndUpdateState = (setData) => {
  const fetchData = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT');
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const intervalId = setInterval(() => {
    fetchData();
  }, 5000); //TODO: Get time from env variable

  return () => clearInterval(intervalId);
};

const useDataUpdater = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const clearInterval = fetchDataAndUpdateState(setData);
    return clearInterval;
  }, []); 

  return data;
};

export default useDataUpdater;

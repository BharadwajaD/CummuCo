import {  useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import NewRide from "./pages/NewRide";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import { ViewRide } from "./pages/ViewRide";
import LocationUpdater from "./utils/LocationUpdater";


function App() {

    const [role, setRole] = useState('');
    const [ride_ids, setRideids] = useState('');

    return (
        <Router>
            {role === 'traveller' && <LocationUpdater ride_id={ride_ids}/>}
        <Routes>

        <Route path="/" element = <SignIn /> />
        <Route path="/signin" element = <SignIn /> />
        <Route path="/signup" element = <Signup /> />
        <Route path="/newride" element = <NewRide setRole_ = {setRole}  setRideids_ = {setRideids}/> />
        <Route path="/ride/:id" element = <ViewRide /> />
        <Route path="/error" element={<Error />} />

        </Routes>
        </Router>
    );
}

export default App;

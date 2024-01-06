import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import NewRide from "./pages/NewRide";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import { ViewRide } from "./pages/ViewRide";

function App() {
   
  return (
    <Router>

      <Routes>

        <Route path="/" element = <Home /> />
        <Route path="/signin" element = <SignIn /> />
        <Route path="/newride" element = <NewRide /> />
        <Route path="/ride/:id" element = <ViewRide /> />
        <Route path="/error" element={<Error />} />

      </Routes>
    </Router>
  );
}

export default App;

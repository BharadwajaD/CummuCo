import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";
import { postFetch } from "../utils/fetch";

const Signup = () => {

    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password_, setPassword_] = useState("")

    const handleSignIn = () => {
        const url = "http://localhost:8000/account/signup"

        postFetch(url, {'username': username, 'password': password}, false).then(body => {
            navigate("/signin")
        }).catch(() => {
            setIsError(true)
        })

    };

    return (
        <div className="SignIn">
        <h2>Register</h2>
        <div className="userdetails">
        <label htmlFor="username">Username:</label>
        <input autoComplete="off" type="text" id="username" name="username" value={username} 
        onChange={(e) => {setUsername(e.target.value)
        }}/>

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password}
        onChange = {e => setPassword(e.target.value)}
        />

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input type="password" id="password" name="password" value={password_}
        onChange = {e => setPassword_(e.target.value)}
        />

        </div>

        {isError && (
            <p className="SignInError">Error: Invaild Username or Password</p>
        )}

        {password_.length > 0 && password_ != password && 
            <p className="SignInError">Password and Confirm Password are not same</p>
        }

        <button onClick={handleSignIn}>Register</button>
        </div>
    );
};

export default Signup;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";
import { postFetch } from "../utils/fetch";
import { setValue } from "../utils/storage";

const SignIn = ({redirect="/newride"}) => {

    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = () => {
        const url = "http://localhost:8000/account/signin"

        postFetch(url, {'username': username, 'password': password}, false).then(body => {
            const token = body.token
            setValue('token', token)
            window.location.replace(redirect)
        }).catch(() => {
            setIsError(true)
        })

    };

    return (
        <div className="SignIn">
        <h2>Sign In</h2>
        <div className="userdetails">
        <label htmlFor="username">Username:</label>
        <input type="text" autoComplete="off" id="username" name="username" value={username} 
        onChange={(e) => {setUsername(e.target.value)
        }}/>

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password}
        onChange = {e => setPassword(e.target.value)}
        />
        </div>

        {isError && (
            <p className="SignInError">Error: Invaild Username or Password</p>
        )}

        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={() => navigate('/signup')}>Register</button>
        </div>
    );
};

export default SignIn;


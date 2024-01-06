import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

const SignIn = () => {

  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

  const handleSignIn = () => {

      fetch("https://your-backend-url.com/api/auth/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({"username": username, "password": password}),
      }).then((response) => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error("Sign-in failed");
              }
          })
          .then((data) => {
              // Handle the response data, which should include your JWT access and refresh tokens
              console.log(data);
          })
          .catch((error) => {
              console.error(error);
              setIsError(true);
              return;
          });

      navigate("/newride");
  };

    return (
        <div className="SignIn">
        <h2>Sign In</h2>
        <div className="userdetails">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={username} 
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
        </div>
    );
};

export default SignIn;

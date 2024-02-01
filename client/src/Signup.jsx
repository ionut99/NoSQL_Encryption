import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', {name, email, password})
        .then(response => {
            if (response.status === 409) {
                // Handle user already exists error
                console.log(response.data.message);
            }
            if (response.status === 201) {
                // Handle success
                console.log('User created successfully');
                navigate('/login');
            }
            // Handle other statuses
        })
        .catch(error => {
            if (error.response && error.response.data) {
                // Handle errors returned by server
                console.log(error.response.data.message);
            } else {
                // Handle other errors like network errors
                console.log(error.message);
            }
        });
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          autoComplete="off"
                          name="email"
                          className="form-control rounded-0"
                          onChange={(e) => setName(e.target.value)}
                          />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Email"
                          autoComplete="off"
                          name="email"
                          className="form-control rounded-0"
                          onChange={(e) => setEmail(e.target.value)}
                          />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                          type="password"
                          placeholder="Enter Password"
                          name="password"
                          className="form-control rounded-0"
                          onChange={(e) => setPassword(e.target.value)}
                          />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                    </form>
                    <p>Already Have an Account</p>
                    <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Login 
                    </Link>
                
            </div>
        </div>
    );
}

export default Signup;
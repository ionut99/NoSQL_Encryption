import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Home() {

    const [title, setTitle] = useState()
    const [author, setAuthor] = useState()
    const [year, setYear] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/submit', {title, author, year})
        .then(response => {
            if (response.status === 409) {
                // Handle the book already exist
                console.log(response.data.message);
                // de afișat textul criptat ce urmează să fie introdus în baza de date.. 
            }
            if (response.status === 201) {
                // Handle success
                console.log('Book information was inserted successfully');
                //navigate('/login');
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


    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-55">
                <h2>Insert data of a new book</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title">
                            <strong>Title</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter book title"
                          autoComplete="off"
                          name="title"
                          className="form-control rounded-0"
                          onChange={(e) => setTitle(e.target.value)}
                          />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="author">
                            <strong>Author</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter author"
                          autoComplete="off"
                          name="author"
                          className="form-control rounded-0"
                          onChange={(e) => setAuthor(e.target.value)}
                          />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>The year of publication</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter the year"
                          autoComplete="off"
                          name="author"
                          className="form-control rounded-0"
                          onChange={(e) => setYear(e.target.value)}
                          />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Submit
                    </button>
                    </form>
                    <p></p>
                    <Link to="/search" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Book Search
                    </Link>
                
            </div>
        </div>
    )
}

export default Home;
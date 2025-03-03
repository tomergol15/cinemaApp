import { useState } from "react";
import SelectSeatsModal from "./SelectSeatsModal"; 
import "../components/Movie.css";

const Movie = ({ movie }) => {
    const [showModal, setShowModal] = useState(false);

    const updateBooking = (updatedMovie) => {
        updateMovie(updatedMovie); 
    };

    return (
        <div className="movie-card" >
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-image" onClick={() => setShowModal(true)} />
            <strong>{movie.title}</strong>
            <p>{movie.overview}</p>
            {showModal && (<SelectSeatsModal movie={movie} onClose={() => setShowModal(false)} updateMovie={updateBooking} />)}
        </div>
    );
};

export default Movie;

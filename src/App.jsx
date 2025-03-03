import { useEffect, useState } from "react";
import Movie from "./components/Movie";
import LoginModal from "./components/LoginModal";
import "./App.css"

function App() {
  const [movies, setMovies] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/movies") 
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div>
        <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <h1 className="header">Welcome To Cinema City</h1>
      <div className="movies-container">
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;

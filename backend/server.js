import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import Movie from "../backend/models/Movie.js";
import User from "../backend/models/User.js";


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(error => console.error("MongoDB connection error:", error));

    app.get("/fetchMovies", async (req, res) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
            const movies = response.data.results.slice(0, 10); 
    
            await Movie.deleteMany({});
            await Movie.insertMany(movies);
    
            res.json({ message: "fetched 10 movies", movies });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching movies" });
        }
    });

    app.get("/movies", async (req, res) => {
        try {
            const movies = await Movie.find().limit(10); 
            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error showing movies" });
        }
    });
   
    app.post("/login", async (req, res) => {
        try {
            console.log("Login Request Body:", req.body); 
    
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Missing username or password" });
            }
            const user = await User.findOne({ username });
    
            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Wrong username or password" });
            }
        res.json({ message: "Login successful" });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
    });
    

    app.post("/book", async (req, res) => {
        try {
            const { movieId, time, selectedSeats } = req.body;
            const movie = await Movie.findOne({ id: movieId });
    
            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }
            const screening = movie.screenings.find(screan => screan.time === time);
    
            selectedSeats.forEach(seatIndex => {
                screening.seats[seatIndex] = true; 
            });
    
            setTimeout(async () => {
                const movieToUpdate = await Movie.findOne({ id: movieId });
                const screeningToUpdate = movieToUpdate.screenings.find(s => s.time === time);
    
                selectedSeats.forEach(seatIndex => {
                    screeningToUpdate.seats[seatIndex] = false; 
                });
    
                await movieToUpdate.save();
                console.log(`Seats released for movie: ${movieId}, time: ${time}`);
            }, 15 * 60 * 1000); 

            await movie.save();
            res.json({ message: "Booking successful!" });
        } catch (error) {
            console.error("Error booking seats:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

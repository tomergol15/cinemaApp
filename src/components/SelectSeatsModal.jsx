import { useState, useEffect } from "react";
import "../components/SelectSeatsModal.css";

const SelectSeatsModal = ({ movie, onClose }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seats, setSeats] = useState([]);
    const [timer, setTimer] = useState(15 * 60); 

    useEffect(() => {
        if (selectedTime) {
            const screening = movie.screenings.find(s => s.time === selectedTime);
            setSeats(screening.seats);
        }
    }, [selectedTime, movie.screenings]);

    useEffect(() => {
        if (selectedSeats.length > 0) {
            const time = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        handleTimeout();
                        clearInterval(time);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(time);
        }
    }, [selectedSeats]);

    const handleTimeout = () => {
        alert("Your reservation expired!");
        setSelectedSeats([]);
    };

    const handleSeatClick = (index) => {
        if (seats[index]) return; 
        if (selectedSeats.includes(index)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== index));
        } else if (selectedSeats.length < 4) {
            setSelectedSeats([...selectedSeats, index]);
        }
    };

    const bookingMovie = async () => {
        if (!selectedTime || selectedSeats.length === 0) {
            alert("Please select a time and at least one seat");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movieId: movie.id,
                    time: selectedTime,
                    selectedSeats,
                }),
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                const updatedSeats = seats.map((seat, index) =>
                    selectedSeats.includes(index) ? true : seat
                );
                setSeats(updatedSeats);
                setSelectedSeats([]); 
                updateMovies(); 
                onClose(); 
            }
        } catch (error) {
            console.error("Error booking seats:", error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <strong>Select Seats for {movie.title}</strong>

                <div className="showtime-options">
                    {movie.screenings.map((screening, index) => (
                        <button key={index} className={`showtime-button ${selectedTime === screening.time ? "selected" : ""}`} 
                        onClick={() => setSelectedTime(screening.time)}> {screening.time} </button>
                    ))}
                </div>

                {selectedTime && (
                    <div className="seats-container">
                        {seats.map((seat, index) => (
                            <button key={index} className={`seat ${seat ? "taken" : selectedSeats.includes(index) ? "selected" : ""}`}
                            onClick={() => handleSeatClick(index)} disabled={seat}> {index + 1} </button>
                        ))}
                    </div>
                )}

                {selectedSeats.length > 0 && (
                    <div className="timer"> Time left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</div>)}

                <div className="modal-buttons">
                    <button onClick={bookingMovie} className="book-button">Book</button>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default SelectSeatsModal;

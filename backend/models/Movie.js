import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true }, 
    popularity: { type: Number, required: true },
    screenings: {
        type: [
            {
                time: { type: String, required: true }, 
                seats: { 
                    type: [Boolean], 
                    default: () => new Array(50).fill(false), 
                    validate: seats => seats.length === 50
                }
            }
        ],
        default: [
            { time: "19:30", seats: Array(50).fill(false) },
            { time: "22:00", seats: Array(50).fill(false) },
            { time: "23:00", seats: Array(50).fill(false) }
        ]
    }
});

export default mongoose.model("Movie", MovieSchema);

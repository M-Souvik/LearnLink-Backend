import mongoose from 'mongoose';

const lectureSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    video:{
        type: String,
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

export const Lecture=mongoose.model("Lectures",lectureSchema);
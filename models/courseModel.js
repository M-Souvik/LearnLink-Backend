import mongoose from 'mongoose'

const courseSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    users:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userModel"
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lectures'
    }]
});

export const Courses=mongoose.model("Courses", courseSchema)
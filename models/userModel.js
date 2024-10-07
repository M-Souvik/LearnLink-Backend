import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "user",
    },
    subscription:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses"
        }
    ]
},{
    timestamp: true
})

const userModel = mongoose.model("userModel", userSchema);

export default userModel;
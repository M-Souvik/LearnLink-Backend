import mongoose from "mongoose";

const  informationSchema=mongoose.Schema({
userId:{
    type: mongoose.Schema.Types.ObjectId,
     ref: "userModel"
},

preferences:[{
    type: String,
    required: true
}],

dob:{
    type:Date,
    required:true
},

studyingIn:{
type: String,
required:true
},

phone:{
    type:Number,
    required: true
}
})

const Information=mongoose.model("information",informationSchema);

export default Information
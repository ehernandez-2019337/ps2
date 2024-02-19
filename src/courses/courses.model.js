import mongoose, { Schema, model } from "mongoose"

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    students:[{
        type: Schema.Types.ObjectId,
        ref: "student",
        required: false
    }],
    teacher:{
        type: Schema.Types.ObjectId,
        ref: "student",
        required: false
    }
    
},
{
    versionKey: false //deshabilita el guien bajo v
})

export default model('course', courseSchema)

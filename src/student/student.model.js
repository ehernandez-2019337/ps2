import mongoose from 'mongoose'

const studentSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    courses: {
        type: Number,
        default: 0,
        requerid: false
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['STUDENT', 'TEACHER'],
        default: 'STUDENT',
        required: true
    }
})


export default mongoose.model('student', studentSchema)

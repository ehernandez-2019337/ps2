'use strict';
 
import Course from './courses.model.js';
import Student from  '../student/student.model.js'
import {checkUpdate } from '../utils/validator.js';

export const test = (req, res)=>{
    console.log('server is running')
    res.send({message:'test function is running '})
}

export const save = async(req, res)=>{
    try{
        //Capturar la data
        let data = req.body
         // crear la instancia 
        let course = new Course(data)
        //verificar que no este asignado a mas de 3

        // guardar
       
            await course.save()

       //responder si todo esta bien
       return res.send({message: 'course saved succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error saving course'})
    }
}


export const addStudent = async (req, res) => {
    try {
        // Mandar a llamar a un estudiante
        let { student } = req.body;
        console.log(student)
        // idcurso a asignar
        let { id } = req.params;
        // validar que curso y student existan 
        const course = await Course.findOne({ _id: id });
        const user = await Student.findOne({ _id: student, role: 'STUDENT' });
        if (!course || !user) {
            return res.status(400).send({ message: 'Course or Student not exists' });
        }
        // validar que no este asignado al curso
        if (course.students.includes(student)) {
            return res.status(400).send({ message: 'Already has enrolled' });
        }
        // Vverificar que el alumno se enrole a menos de 4
        if (user.courses >= 3) {
            user.courses
            return res.status(400).send({ message: 'Maximum number of courses reached' });
        }
        
        user.courses += 1;
        await user.save();

        // agregar al curo al estudiante
        course.students.push(student);
        await course.save();

        // Responder al user
        return res.send({ message: 'Student enrolled successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error enrolling student' });
    }
        
}


export const addTeacher = async(req, res) =>{
    try{
        // LLamar al profesor a asignar
        let { teacher } = req.body
        // llamar al curso a asignar
        let { id } = req.params
        // Validar si ambos existen 
        const course = await Course.findOne({_id: id})
        const user = await Student.findOne({_id: teacher, role: 'TEACHER'})
        if(!course || !user) return res.status(400).send({message: 'Course or Teacher not exists'})
        // validar que no tenga un profesor asignado
        if(course.teacher) return res.status(400).send({message: 'Already has a teacher'})
        // Asignar al profesor al curso
        course.teacher = teacher;
        await course.save();
        // responder al user 
        return res.send({message: 'Teacher enrolled succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error editing course'})
        
    }  
}
 


export const update = async(req, res) =>{
    try{
        //jalar el id
        let { id } = req.params
        // validar que el curso exista
        let course = await Course.findOne({_id: id})
        if(!course) return res.status(404).send({message: 'course not exists'})
        // jalar los datos
        let data = req.body
        // Validar que el teacher sea el dueño del curso
        const user = await Student.findOne({_id: data.teacher,role: 'TEACHER'})
        if (!user || !course.teacher.equals(data.teacher)) {
            return res.status(403).send({ message: 'you do not have acces to update this course' });
        }
        //update 
        await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )    
        // Responder al usuario
        return res.send({message: ' updated successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'error updating course'})
    }
}

export const deleteCourse = async(req, res) =>{
    try{
        // Capturar el id del curso
        let { id } = req.params
        // teacher
        let { teacher} = req.body
        // valida que si exista el curso
        let course = await Course.findOne({_id: id})
        if(!course) return res.status(404).send({message: 'course not exists'})
        // validar que el curso perteneca al
        const user = await Student.findOne({_id: teacher,role: 'TEACHER'})
            console.log(teacher)
            console.log(course.teacher)
            if (!user || !course.teacher.equals(teacher)) {
                return res.status(403).send({ message: 'you do not have acess to delete this course' });
            }
        //Delete
        let courses = await Course.findOneAndDelete({_id: id})
        let students = await Student.findOne({_id: courses.students})
        students.courses -= 1;
        await students.save()
        // DeleteCOurse
        return res.send({message: 'deleted course successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'error deleting course'})
    }
}

export const search = async(req, res) =>{
    try{
        // Tllamar al estudiante por id
        const { id } = req.params;
        // Velidar que existe
        const student = await Student.findOne({ _id: id, role: 'STUDENT' });
        if (!student) {
            return res.status(404).send({ message: 'student not found' });
        }
        // llamar a los cursos
        let courses = await Course.find({ students: id }).populate('students', ['name', 'username']  );

        // Velidar que este asignado a un curso
        if (courses.length === 0) {
            return res.status(404).send({ message: 'student is not enrolled to any courses' });
        }
        // Responder al usuario
        return res.send({ courses });
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'error searching courses'})
    } 
}


 
export const get = async(req, res)=>{
    try{
        let courses = await Course.find()
        if(!courses) return res.status(404).send({message:'not found'})
        return res.send({courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error getting courses'})
    }

}
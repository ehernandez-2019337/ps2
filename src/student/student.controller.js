'use strict'

import Student from './student.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

//register student
export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Guardar la información en la BD
        let student = new Student(data) // guardar base de datos
        await student.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with email use ${student.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

//update stutend
export const update = async(req, res)=>{
    try{
        //obtener id usuario a actualizar
        let {id} = req.params
        //obtener datos a actualizar 
        let data = req.body
        //validar si tene datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message:'Have submited some data that cannot be update or missing data'})
        //validar si tiene permisos(tokenizacion) 
        //Actualizar DB
        let updateStudent = await Student.findOneAndUpdate(
            {_id: id}, //Object id (hexadecimales=> Hora sys, Version Mongo)
            data,
            {new:true} //Datos que se mandan a actualizar 
        )
        //validar la actualizacion
        if(!updateStudent) return res.status(404).send({message:'user not found and not update'})
        //responder al usuario
            return res.send({message:'update user ', updateStudent})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message:`Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message:'Error updating account'})
    }
}

export const login = async (req, res)=>{
    try{ 
        //capturar los datos del body
        let {username, password } = req.body
        // validar que el usurio exista
        let student = await Student.findOne({username})// Buscar un solo  registro Username 
        // Verificar que la contrasenia coincida
        if(student && await checkPassword(password, student.password)){
            let loggedStudent ={
                uid: student._id,
                username: student.username,
                name: student.name,
                role: student.role
            }

        //generar jwt
            let token = await generateJwt(loggedStudent)

        // se le responde al usuario
    return res.send({message:`Welcome ${loggedStudent.name}`, loggedStudent, token})
    } return res.status(404).send({message: 'Invalid credential'})
    
}catch(err){
    console.error(err)
    return res.status(500).send({message: 'error logged user in'})
}

}


export const deleteStudent = async (req,res)=>{
    try{  
        //obtener id
        let { id} = req.params
        //eliminar (delete one: solo lo elimina) o (FindOneAndDelete: elimina y devuelde el objeto)
        let deleteStudent = await Student.findOneAndDelete({_id: id})
        //verificar que se elimino
        if(!deleteStudent) return res.status(404).send({message:'Account not found and not deleted'})
        //responder
        res.send({message: `account with username ${deleteStudent.username} delated succesfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error deleting account'})
    }
}
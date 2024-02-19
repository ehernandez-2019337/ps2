'use strict'

import { request } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../student/student.model.js'

export const validateJwt =  async(req,res,next)=>{
    try{
        //obtener llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los header
        let { token } =req.headers
        //verificar si viene el token
        if(!token) return res.status(401).send({message:'unauthorized'})
        //obtener ek uid del usuario
        let {uid}= jwt.verify(token, secretKey)
        //calidar si aun existe en la DB
        let student = await Student.findOne({_id:uid})
        if(!student) return res.status(404).send({message: 'user not found - unauthorized'})
        req.student = student
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message:'invalid token'})
    }
}

export const isTeacher = async(req,res,next)=>{
        let { student } = req
        let {id} = req.params
        if(!student || student.role !== 'TEACHER'){
            if(student.id !== id)  return res.status(403).send({message:`you dont have acess`})

            next()
        } else{
            next()
        }
    }

    
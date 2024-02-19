import express from 'express'

import { test, register, update, deleteStudent, login} from './student.controller.js';
import { isTeacher, validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

api.get('/test',test)
api.post('/login', login)
api.post('/register', register)
api.put('/update/:id',[validateJwt],[ isTeacher], update)
api.delete('/delete/:id',[validateJwt], [ isTeacher], deleteStudent )

export default api


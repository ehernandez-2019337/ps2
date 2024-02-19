import {Router} from 'express'
import {  test, save, addStudent, search, update, deleteCourse,get, addTeacher} from './courses.controller.js';
import { validateJwt, isTeacher } from '../middlewares/validate-jwt.js';

const api = Router();

api.get('/test', test)
api.post('/save', [validateJwt],save)
api.put('/addStudent/:id',[validateJwt], addStudent)
api.get('/search/:id',[validateJwt], search)
api.get('/get',[validateJwt], get)
api.put('/update/:id',[validateJwt], update)
api.delete('/deleteCourse/:id',[validateJwt],deleteCourse)
api.put('/addTeacher/:id',[validateJwt], addTeacher)




/*

*/



export default api
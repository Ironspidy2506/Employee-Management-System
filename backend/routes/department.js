import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addDepartment, getDepartments, getDepartment, updateDepartment , deleteDepartment} from '../controllers/departmentController.js';


const router = express.Router();

router.get('/', authMiddleware, getDepartments);
router.post('/add', authMiddleware, addDepartment);
router.get('/:_id', authMiddleware, getDepartment);
router.put('/:_id', authMiddleware, updateDepartment);
router.delete('/:_id', authMiddleware, deleteDepartment);


export default router;
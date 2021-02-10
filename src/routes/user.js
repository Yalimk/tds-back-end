// Native modules import
import express from 'express';
// import {body, validationResult} from 'express-validator';

//Personal modules import
import {userById, getUsers, getUser, updateUser, deleteUser, userPhoto, hasAuthorization/*, userByPseudo*/} from '../controllers/user.js';
import {requireSignin} from '../controllers/auth.js';

// Constants declaration
const router = express.Router();

// Route for getting all the users
router.get('/users', getUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);
router.get('/user/photo/:userId', userPhoto);

// Router to check for user id in parameters
router.param('userId', userById);

export default router;
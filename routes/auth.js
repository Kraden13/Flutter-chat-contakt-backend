/*
    path: api/login

*/
const { Router } = require('express');
const { check } = require('express-validator');

const { newUser, login, renewToken } = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();



router.post('/new', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
    validate
], newUser );

router.post('/', [
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
], login );


router.get('/renew', validateJWT, renewToken );

module.exports = router;

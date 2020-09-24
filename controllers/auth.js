const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const user = require('../models/user');

const newUser = async (req, res = response ) => {

    const { email, password } = req.body;

    try {

        const existEmail = await User.findOne({ email });
        if( existEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar mi JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            user,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const userDB = await User.findOne({ email });
        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // validatear el password
        const validatePassword = bcrypt.compareSync( password, userDB.password );
        if ( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }


        // Generar el JWT
        const token = await generateJWT( userDB.id );
        
        res.json({
            ok: true,
            user: userDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const renewToken = async( req, res = response) => {

    const uid = req.uid;

    // generar un nuevo JWT, generateJWT... uid...
    const token = await generateJWT( uid );

    // Obtener el usuario por el UID, Usuario.findById...
    const user = await User.findById( uid );

    res.json({
        ok: true,
        user,
        token
    });

}


module.exports = {
    newUser,
    login,
    renewToken
}

const passport = require('passport');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const config = require('../config/db');
const session = require('express-session');
const app = express();



app.use(session({secret: 'tsunamit',saveUninitialized: true,
cookie:{maxAge:10},resave: true}));

var sess; 


router.post('/register', (req, res) => {
    let newAdmin = new Admin({
        nom : req.body.nom,
        prenom: req.body.prenom,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    Admin.addAdmin(newAdmin, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username est déja utilisé. ";
            if (err.errors.email) message += "Adresse mail est déja utilisée.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Admin a été ajouté avec succés."
            });
        }
    });
});


router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    sess = req.session;
	sess.username = req.body.username; 
    // console.log(sess);

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin non trouvé."
            }); 
        }
 
        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "admins",
                    data: {
                        _id: admin._id,
                        nom: admin.nom,
                        prenom: admin.prenom,
                        username: admin.username,
                        password:admin.password,
                        email: admin.email 
                    }
                }, config.secret, {
                    expiresIn: 604800 // le token expire aprés une semaine
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: false,
                    message: "mot de passe erroné."
                });
            }
        });
    });
});




router.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
		// console.log(sess);
	});
 

});

router.get('/profile', passport.authenticate('jwt', {
    session: true
}), (req, res) => {
    sess = req.session;
	if(sess.username) {
    // console.log(req.user);
    return res.json(
        req.user
        );
    }
});


router.get('/getAdminById/:id', (req, res ) => {
    Admin.find( { _id: req.params.id },(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/getAllAdmins', (eq, res) => {
    Admin.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.put('/updateAdminById/:id',(req, res) =>{
    let _id = req.params.id;

    Admin.findById(_id)
        .then(admin => {
            admin.nom =req.body.nom;
            admin.prenom = req.body.prenom;
            admin.username = req.body.username;
            admin.email = req.body.email;
            admin.password = req.body.password;
            admin.save()
                .then(post => {
                    res.send({message: 'Admin a été modifié avec succés ', satus:'success',admin: admin})
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))


})

module.exports = router;
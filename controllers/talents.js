const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Talent = require('../models/talents');
const config = require('../config/db');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
app.use(session({secret: 'tsunamit',saveUninitialized: true,
cookie:{maxAge:10},resave: true}));

var sess;  




router.post('/register', (req, res) => {
    let newTalent = new Talent({

                nom: req.body.nom,  
                prenom: req.body.prenom,
                dateDeNaissance: req.body.dateDeNaissance,
                sexe: req.body.sexe,
                adresse: req.body.adresse,
                telephone: req.body.telephone,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                createdAt: req.body.createdAt,
                statut: req.body.statut,
                etape: req.body.etape,
                presentation: req.body.presentation,
                remarque: req.body.remarque,
                profession: req.body.profession,
                domaine: req.body.domaine
            });

    Talent.addTalent(newTalent, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message 
            });
        } else {

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'tsunamiittest@gmail.com',
                  pass: "tsunami123*"
                }
              });
              var mailOptions = {
                from: 'tsunamiittest@gmail.com',
                to: req.body.email,
                subject: ' Mail De Bienvenue',
                html: "<p> Bonjour   "+ (req.body.username) + ",<br> <p> Bienvenue  <B> <br><p> Vos infomrations de Login sont : <br><p> Username :  " +" "+ req.body.username +"<br><p> Mot De Passe : "+" "+ req.body.password
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });


            return res.json({
                success: true,
                message: "talent registration is successful."
            });


        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Talent.getTalentByUsername(username, (err, talent) => {
        if (err) throw err;
      
        if (!talent) {
            return res.json({
                success: false,
                message: "talent not found."
            });
        }

        Talent.comparePassword(password, talent.password, (err, isMatch) => {
            if (err) throw err;
            
            if (isMatch) { 
                const talentID=talent._id
                const token = jwt.sign({
                    type: "talent",
                    data: {
                                                _id: talent._id,
                                                nom: talent.nom,
                                                prenom: talent.prenom,
                                                dateDeNaissance: talent.dateDeNaissance,
                                                sexe: talent.sexe,
                                                adresse: talent.adresse,
                                                telephone: talent.telephone, 
                                                email: talent.email,
                                                username: talent.username,
                                                password: talent.password,
                                                createdAt: talent.createdAt,
                                                statut: talent.statut,
                                                etape: talent.etape,
                                                presentation: talent.presentation,
                                                remarque: talent.remarque,
                                                profession: talent.profession,
                                                domaine: talent.domaine
                    }
                }, config.secret, {
                    expiresIn: 604800 // le token exipre aprés une semaine 
                });
                
                return res.json({
                    success: true,
                    talentID,
                    token: "JWT " + token
                });
          
            } else {
                    return res.json({
                    success: false,
                    message: "mot de passe erroné" 
                                
            }) ;
        
            }       
        });
    });
    
});


router.get('/',(req,res) => {
    res.send("vous devez vous connecter tt d'abord");
    console.log("vous devez vous connecter tt d'abord");
	}
);


router.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
		// console.log(sess);
	});

});


router.get('/getTalentById/:id', (req, res ) => {
    Talent.find( { _id: req.params.id },{_id:0,password:0},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/getAllTalents', ( req, res) => {
    Talent.find({},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.put('/updateTalentById/:id',(req, res) =>{
    let _id = req.params.id;
 
    Talent.findById(_id)
        .then(talent => {

            talent.nom =req.body.nom;
            talent.prenom = req.body.prenom;
            talent.dateDeNaissance = req.body.dateDeNaissance;
            talent.sexe = req.body.sexe;
            talent.adresse = req.body.adresse;
            talent.telephone = req.body.telephone;
            talent.email = req.body.email;
            talent.username = req.body.username;
            talent.password = req.body.password;
            talent.createdAt = req.body.createdAt;
            talent.statut = req.body.statut;
            talent.etape = req.body.etape;
            talent.presentation = req.body.presentation;
            talent.remarque = req.body.remarque;
            talent.profession = req.body.profession;
            talent.domaine = req.body.domaine;

            talent.save()
                .then(post => {
                    res.send({message: 'Talent a été  modifié avec succés ', satus:'success',talent: talent})
                })
                .catch(err => console.log(err))
        }) 
        .catch(err => console.log(err))
 
})


router.put('/desactiverTalent/:id', (req, res ) => {
    Talent.updateOne({ _id: req.params.id },{$set: {"statut":"desactive"}} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;







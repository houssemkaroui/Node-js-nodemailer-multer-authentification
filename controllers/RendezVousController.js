

var ObjectId = require('mongoose').Types.ObjectId;
var { RendezVous } = require('../models/RendezVous');
var nodemailer = require('nodemailer');
// need to add in case of self-signed certificate connection
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
var moment = require('moment');
var Talent  = require('../models/talents') 
var cron = require('node-schedule');
moment.suppressDeprecationWarnings = true;

const express = require('express');
var router = express.Router();

  
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'tsunamiittest@gmail.com',
    pass: 'tsunami123*'
  },

});


router.post('/send',	function(req, res, next) {
    var array=req.body;
    console.log(array['tab'].length)
    
		var attachementList = [];
		for (var i = 0; i < array['tab'].length; i++) {
      var nom = array['tab'][i].substring(36,array['tab'][i].length);
      console.log("nom"+nom);
      var str2  = array['tab'][i].replace("http://localhost:3000",".");
      console.log("str2"+str2);
			attachementList.push({
				filename: nom,
				path: str2
			});
		}

		//console.log(attachementList);

		var mailOptions = {
		   from: 'tsunamiittest@gmail.com',
		 	to:  req.body.emails ,
		   subject:  "Here are the attachements Files" ,
	      attachments: attachementList,
		
		};

	//	console.log(mailOptions)

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		    res.json(info);
		});
});



// CREATE Rendez-Vous + Mail de confirmation de rendezVous + mail avant 2 jours et un autre avant 24h du jour J
//http://localhost:3000/restapi/rendez
router.post('', (req, res) => {

  var rendezVous = new RendezVous({

    idTalent: req.body.idTalent,
    responsable: req.body.responsable,
    type: req.body.type,
    remarque: req.body.remarque,
    dateDeCreation: req.body.dateDeCreation,
    dateDeRendezVous: req.body.dateDeRendezVous

  });
  rendezVous.save((err, doc) => {
    if (!err) {
      res.send(doc);
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
        subject: 'Tsunami IT: Appointment confirmation',
        html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to welcome you for an interview on <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <p> Please login to your account to confirm your presence , Here is the link :  <A href=\"\https://www.google.com\"> Arrimer </A> </p> <br> Kind Regards"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      var dateBeforeOneDay = moment(req.body.dateDeRendezVous).subtract(1, 'day').format('llll')
      var dateBeforeTwoDay = moment(req.body.dateDeRendezVous).subtract(2, 'day').format('llll')

      //BEFORE ONE DAY
      cron.scheduleJob(dateBeforeOneDay, function () {
        console.log(new Date(), " Reminder before 24 hours is ready to sent !");
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tsunamiittest@gmail.com',
            pass: "tsunami123*"
          }
        });
        var mailOptions = {
          from: 'tsunamiittest@gmail.com',
          to: req.body.email,
          subject: 'Tsunami IT: Appointment after 24 hours ',
          html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to remind you for your next appointment <B> " + (req.body.dateDeRendezVous) + "</B> <br> <br> Kind Regards"

        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        }); });


      //BEFORE TWO DAY
      cron.scheduleJob(dateBeforeTwoDay, function () {
        console.log(new Date(), " Reminder before 2 Days is ready to sent !" );
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tsunamiittest@gmail.com',
            pass: "tsunami123*"
          }
        });
        var mailOptions = {
          from: 'tsunamiittest@gmail.com',
          to: req.body.email,
          subject: 'Tsunami IT: Appointment after 2 days ',
          html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to remind you for your next appointment <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <br> Kind Regards"

        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
      
      );}
    else { console.log('Error in rendezVous Save :' + JSON.stringify(err, undefined, 2)); }
  });
});

//GET all rendez-vous
//http://localhost:3000/restapi/rendez
router.get("", (req, res, next) => {
  RendezVous.find().then(documents => {
    res.status(200).json({
      message: " RendezVous fetched successfully!",
      RendezVous: documents
    });
  });
});


// DELETE rendez-vous By Id
//http://localhost:3000/restapi/rendez/:idRendezVous
router.delete("/:id", (req, res, next) => {
  RendezVous.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "RendezVous deleted!" });
  });
});

// GET RendezVous By Talent Id
//http://localhost:3000/restapi/rendez/987/rendi

router.get("/rendi/:idTalent", (req, res, next) => {
  RendezVous.find({ idTalent: req.params.idTalent }).then(document => {
    res.status(200).json({
      message: " RendezVous fetched successfully!",
      RendezVous: document
    });
  });
});


//Update Rendez vous + Mail d'information d'update + 2 Mail de Rappel avant 2jours et 24 heures 
//http://localhost:3000/restapi/rendez/:idRendezVous
router.put('/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
  var t = {


    responsable: req.body.responsable,
    type: req.body.type,
    remarque: req.body.remarque,
    dateDeCreation: req.body.dateDeCreation,
    dateDeRendezVous: req.body.dateDeRendezVous ,
    status : req.body.status 

  };

  RendezVous.findByIdAndUpdate(req.params.id, { $set: t }, { new: true }, (err, doc) => {
    if (!err) {
       res.send(doc);


       if ((req.body.status) == "disapproved"){

         //Mail de confirmation 
         var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tsunamiittest@gmail.com',
            pass: "tsunami123*"
          }
        });
        var mailOptions = {
          from: 'tsunamiittest@gmail.com',
          to: req.body.email,
          subject: 'Tsunami IT: Appointment confirmation',
          html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to welcome you for an interview on <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <p> Please login to your account to confirm your presence , Here is the link :  <A href=\"\https://www.google.com\"> Arrimer </A> </p> <br> Kind Regards"
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });



       }else  if ((req.body.status) == "approved") {

      //Mail d'information d'update

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tsunamiittest@gmail.com',
          pass: "tsunami123*"
        }
      });
      var mailOptions = {
        from: 'tsunamiittest@gmail.com',
        to: req.body.email,
        subject: 'Tsunami IT: Appointment updated',
        html: "<p> Dear  "+ (req.body.username) +",<br> <p> We want to inform you that your appointment has been delighted to  <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <br>  Kind Regards"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

       }
 
    //Mail de rappel avant  2jrs et avant 24h
       var dateBeforeOneDay = moment(req.body.dateDeRendezVous).subtract(1, 'day').format('llll')
       var dateBeforeTwoDay = moment(req.body.dateDeRendezVous).subtract(2, 'day').format('llll')
 
       //BEFORE ONE DAY
       cron.scheduleJob(dateBeforeOneDay, function () {
         console.log(new Date(), "Somthing important is going to happen today!");
         var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
             user: 'tsunamiittest@gmail.com',
             pass: "tsunami123*"
           }
         });
         var mailOptions = {
           from: 'tsunamiittest@gmail.com',
           to: req.body.email,
           subject: 'Tsunami IT: Appointment after 24 hours ',
           html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to remind you for your next appointment <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <br> Kind Regards"
 
         };
         transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
             console.log(error);
           } else {
             console.log('Email sent: ' + info.response);
           }
         }); });
 
 
       //BEFORE TWO DAY
       cron.scheduleJob(dateBeforeTwoDay, function () {
         console.log(new Date(), "Somthing important is going to happen today!");
         var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
             user: 'tsunamiittest@gmail.com',
             pass: "tsunami123*"
           }
         });
         var mailOptions = {
           from: 'tsunamiittest@gmail.com',
           to: req.body.email,
           subject: 'Tsunami IT: Appointment after 2 days ',
           html: "<p> Dear  "+ (req.body.username) +",<br> <p> We would be delighted to remind you for your next appointment <B> " + (req.body.dateDeRendezVous) + "</B>  <br> <br> Kind Regards"
 
         };
         transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
             console.log(error);
           } else {
             console.log('Email sent: ' + info.response);
           }
         });
       }
       
       );
    
    }
    else { console.log('Error in RendezVous Update :' + JSON.stringify(err, undefined, 2)); }
  });
});


//Update Status Rendez vous 
//http://localhost:3000/restapi/rendez/st/:idRendezVous
router.put('/st/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
  var t = {
    status: req.body.status,
  };

  RendezVous.findByIdAndUpdate(req.params.id, { $set: t }, { new: true }, (err, doc) => {
    if (!err) { res.send(doc); }
    else { console.log('Error in Status RendezVous Update :' + JSON.stringify(err, undefined, 2)); }
  });
});



//Get Distinct Type
//http://localhost:3000/restapi/rendez/tp
router.get('/tp', (eq, res) => {
  RendezVous.distinct('type', (err, docs) => {
    if (!err) { res.send(docs); }
    else { console.log('Error in Retriving Question :' + JSON.stringify(err, undefined, 2)); }
  });
});


// GET RendezVous By DateRendezVous
//http://localhost:3000/restapi/rendez/dateR/:dateRendezVous

router.get("/dateR/:dateR", (req, res, next) => {
  RendezVous.find({ dateDeRendezVous: req.params.dateR }).then(document => {
    res.status(200).json({
      message: " RendezVous fetched successfully!",
      RendezVous: document
    });
  });
});

// GET RendezVous By Responsable
//http://localhost:3000/restapi/rendez/res/:resp

router.get("/res/:resp", (req, res, next) => {
  RendezVous.find({ responsable: req.params.resp }).then(document => {
    res.status(200).json({
      message: " RendezVous fetched successfully!",
      RendezVous: document
    });
  });
});

router.put('/down/:id', async function(req, res) {
  var rd = new RendezVous ();
  rd = await RendezVous.findById({_id:req.params.id}).exec();
  //console.log(rd);
  await Talent.updateOne({_id : rd['idTalent'] }, { $inc : {"absence" : 1}});

   tl = await Talent.findById({_id:rd['idTalent'] }).exec();
  //console.log(tl['absence']);
  if(tl['absence']===2)
  {
    await Talent.updateOne({_id : rd['idTalent'] }, { $set : {"statut" : "Desactive"}}) ; 
  }

  RendezVous.updateOne({_id : req.params.id }, { $set : {Action : "down"}}).then(document => {
    res.status(200).json({
      message: " RendezVous updated successfully!",
      RendezVous: document
    });
  });


  
});

module.exports = router;
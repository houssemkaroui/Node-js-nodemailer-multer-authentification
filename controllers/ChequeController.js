const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const  Cheque  = require('../models/T3_Cheque');
const multer = require("multer");
var fs = require('fs');
const Talent = require('../models/talents');

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Extension de l\'image est Invalide");
    if (isValid) {
      error = null;
    }
    cb(error, "./imagesCheques/");
  },
 filename: (req,file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
 
    cb(null, name  );
  }
}); 

   

 


// CREATE Cheque and add it to a Talent
router.post('/:idTalent',  multer({ storage: storage , 
  limits: {
  fileSize: 1024 * 1024 * 5
},
}).single("imageCheque"), async function(req, res) {

  const url = req.protocol + "://" + req.get("host");

  var rd = new Talent ();

  rd = await Talent.findById({_id:req.params.idTalent}).exec();

var extt = req.file.mimetype ; 

const ext = MIME_TYPE_MAP[extt];

var nom = 'Cheque_De_' + rd['username']+'.'+ext;
 
 fs.rename('./imagesCheques/'+req.file.filename, './imagesCheques/'+nom, (err) => {

  if (err) throw err;

  console.log('Rename complete!');

});

var cheque = new Cheque({
    numero: req.body.numero,
    paiement: req.body.paiement,
    reponse: req.body.reponse,
    DateDeReponse: req.body.DateDeReponse,
    DateDeCreation: req.body.dateDeCreation,
    DateEnvoie:req.body.DateEnvoie,
    DateDeEncaissement : req.body.DateDeEncaissement,
    idTalan: req.params.idTalent,
    imageCheque: url + "/imagesCheques/" + nom
   
  }); 
  cheque.save().then(createdCheque => {
    res.status(201).json({
      message: "",
      cheque: {
        ...createdCheque,
        id: createdCheque._id
      }
    });
  }); 
});


// UPDATE cheque  
router.put(
  "/:id",
  multer({ storage: storage }).single("imageCheque"),
  async function(req, res, next) {
    
   var OldCheque = new Cheque ();
  
   OldCheque =  await Cheque.findById({_id:req.params.id}).exec();

  
  var str = OldCheque["imageCheque"];
  var nom = str.substring(36,str.lenght);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });
   
let imageCheque = req.body.imageCheque;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imageCheque = url + "/imagesCheques/" + nom
    }
 
    fs.rename('./imagesCheques/'+req.file.filename, './imagesCheques/'+nom, (err) => {

      if (err) throw err;
    
      //console.log('Rename complete!');
    
    });


    const cheque = new Cheque({
      _id: req.params.id,
      numero: req.body.numero,
      paiement: req.body.paiement,
      reponse: req.body.reponse,
      DateDeReponse: req.body.DateDeReponse,
      DateDePaiement:req.body.DateDePaiement,
      DateEnvoie:req.body.DateEnvoie,
      DateDeEncaissement : req.body.DateDeEncaissement,
      imageCheque: imageCheque
    });
    //console.log(cheque);
    Cheque.updateOne({ _id : req.params.id }, cheque ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);

// GET ALL cheques 
router.get("", (req, res, next) => {
  Cheque.find().then(documents => {
    res.status(200).json({
      message: "cheques récupérés avec succès!",
      cheques: documents
    });
  });
});

// GET Cheque By User Id
router.get("/:idTalent/chequi", (req, res, next) => {
  Cheque.find({idTalan: req.params.idTalent }).then(document => {
    res.status(200).json({
      message: "Cheque récuperé avec succés!",
      cheque: document
    });
  });
});

// GET cheque By Id
router.get("/:id", (req, res, next) => {
  Cheque.findById(req.params.id).then(cheque => {
    if (cheque) {
      res.status(200).json(cheque);
    } else {
      res.status(404).json({ message: "Cheque récupéré avec succès!" });
    }
  });
});

// GET Cheque By Id of a specific Talent
router.get("/:idTalent/:id", (req, res, next) => {
  Cheque.find({ $and : [ {_id:req.params.id }, {idTalent: req.params.idTalent }]}).then(cheque => {
    if (cheque) {
      res.status(200).json(cheque);
    } else {
      res.status(404).json({ message: "Paiement not found!" });
    }
  });
});

// DELETE cheque By Id
router.delete("/:id", async function(req, res, next)  {
  
  var OldCheque = new Cheque ();  
   OldCheque =   await Cheque.findById({_id:req.params.id}).exec();

  console.log("old cheque : .. ", OldCheque);
  
  var str = OldCheque["imageCheque"];
  console.log("str:   ", str);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });

    Cheque.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Ce Cheque a été supprimé avec succés!" });
  });
});

module.exports = router;
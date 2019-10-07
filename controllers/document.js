const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
const  Document  = require('../models/document');
const multer = require("multer");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpeg": "jpeg",
  "application/pdf" : "pdf",
  "application/msword": "msword"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Extension du fichier est Invalide");
    if (isValid) {
      error = null;
    }
    cb(error, "./uploads/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name );
  }
});


// CREATE Document and add it to a Talent
router.post('/:idTalent',  multer({ storage: storage , 
  limits: {
  fileSize: 1024 * 1024 * 5
},
}).single("image"),async function(req, res) {
  const url = req.protocol + "://" + req.get("host");
  
  var rd = new Talent ();

  rd = await Talent.findById({_id:req.params.idTalent}).exec();

  var extt = req.file.mimetype ; 

  const ext = MIME_TYPE_MAP[extt];

  var nom = 'Document_De_' + rd['username']+'.'+ext;
 
  fs.rename('./uploads/'+req.file.filename, './uploads/'+nom, (err) => {

  if (err) throw err;

  console.log('Rename complete!');

});
  
  var document = new Document({
    idTalent: req.params.idTalent,
    nom: req.body.nom,
    DateDeCreation: req.body.DateDeCreation,
    image: url + "/uploads/" + nom
   
  }); 
  document.save().then(createdDocument => {
    res.status(201).json({
      message: "Document ajouté avec succès",
      document: {
        ...createdDocument,
        id: createdDocument._id
      }
    });
  }); 
});

// UPDATE File 

router.put("/updateDocument/:id",
  multer({ storage: storage }).single("image"),
  async function(req, res, next) {
    let image = req.body.image;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      image = url + "/image/" + req.file.filename
    }
   var oldDocument = new Document ();
  
  oldDocument =  await Document.findById({_id:req.params.id}).exec();

  console.log("old document : .. ", oldDocument);
  
  var str = oldDocument["image"];
  console.log("str:   ", str);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });

    const document = new Document({
      _id: req.params.id,
      nom: req.body.nom,
      DateDeCreation: req.body.DateDeCreation,
      image: image
    });
    Document.updateOne({ _id : req.params.id }, document ).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);



// GET ALL documents 
router.get("/getAllDocuments", (req, res, next) => {
  Document.find().then(documents => {
    res.status(200).json({
      message: "Documents récupérés avec succès!",
      documents: documents
    });
  });
}); 

// GET ALL Document Talent By Talent Id
router.get("/:idTalent/document", (req, res, next) => {
  Document.find({idTalent: req.params.idTalent }).then(document => {
    res.status(200).json({
      message: "Document récupéré avec succès!!",
      document: document
    });
  });
});

// GET Document By Id
router.get("/:id", (req, res, next) => {
  Document.findById(req.params.id).then(document => {
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: "Document récupéré avec succès!" });
    }
  });
});

// GET Document By Id d'un Talent

router.get("/:idTalent/:id", (req, res, next) => {
  Document.find({ $and : [ {_id:req.params.id }, {idTalent: req.params.idTalent }]}).then(document => {
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  });
});

// DELETE document By Id
router.delete("/:id", (req, res, next) => {
  Document.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Document deleted!" });
  });
});


router.delete("/:id", async function(req, res, next)  {
  
  var oldDocument = new Document ();  
   oldDocument =   await Document.findById({_id:req.params.id}).exec();

  console.log("old Document : .. ", oldDocument);
  
  var str = oldDocument["image"];
  console.log("str:   ", str);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });

    Document.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Ce document a été supprimé avec succés!" });
  });
});

module.exports = router;
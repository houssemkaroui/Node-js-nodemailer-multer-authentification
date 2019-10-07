const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const  Paiement  = require('../models/T3_Paiement');



// CREATE Paiement and add it to a Talent
router.post('/:idTalent', (req, res) => {

  var pay = new Paiement({
    montant: req.body.montant,
    type: req.body.type,
    facture: req.body.facture,
    idTalan:req.params.idTalent,
    
    DateDePaiement:req.body.DateDePaiement   
  });
  pay.save().then(createdPaiement => {
    res.status(201).json({
      message: "Paiement ajouté avec succés",
     pay: {
        ...createdPaiement,
        id: createdPaiement._id
      }
    });
  });
});


// UPDATE Paiement
router.put(
  "/:id",
  (req, res, next) => {
   
    const pay = new Paiement({
      _id: req.body.id,
      montant: req.body.numero,
    type: req.body.paiement,
    facture: req.body.reponse,
    DateDePaiement:req.body.DateDePaiement   
    });
    console.log(pay);
    Paiement.updateOne({ _id: req.params.id }, pay).then(result => {
      res.status(200).json({ message: "mis à jour avec succés!" });
    });
  }
);

// GET ALL Paiements
router.get("", (req, res, next) => {
  Paiement.find().then(documents => {
    res.status(200).json({
      message: "Paiements récupérés avec succès!!",
      Paiements: documents
    });
  });
});

// GET ALL Paiements By User Id
router.get("/:idTalent/Paiements", (req, res, next) => {
  Paiement.find({idTalan: req.params.idTalent }).then(documents => {
    res.status(200).json({
      message: "Paiements récupérés avec succès!!",
      Paiements: documents
    });
  });
});

// GET Paiement By Id
router.get("/:id", (req, res, next) => {
  Paiement.findById(req.params.id).then(pay => {
    if (pay) {
      res.status(200).json(pay);
    } else {
      res.status(404).json({ message: "Paiement n'a pas été trouvé!" });
    }
  });
});

// GET Paiement By Id of a specific Talent
router.get("/:idTalent/:id", (req, res, next) => {
  Paiement.find({ $and : [ {_id:req.params.id }, {idTalent: req.params.idTalent }]}).then(pay => {
    if (pay) {
      res.status(200).json(pay);
    } else {
      res.status(404).json({ message: "Paiement not found!" });
    }
  });
});

// DELETE paiement By Id
router.delete("/:id", (req, res, next) => {
  Paiement.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Paiement a été supprimé avec succés!" });
  });
});

module.exports = router;
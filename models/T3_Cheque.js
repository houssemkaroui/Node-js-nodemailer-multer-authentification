
const mongoose = require("mongoose");

const chequeSchema = mongoose.Schema({
  numero: { type: Number},
  paiement: { type: Number},
  imageCheque:  { type: String },
  reponse : {type : String},
  DateDeCreation: {type : Date,default : Date.now },
  DateEnvoie:{type : Date},
  DateDeReponse:{type : Date},
  DateDeEncaissement: {type : Date},

  idTalan: {type: String}
});

module.exports = mongoose.model("Cheque", chequeSchema);




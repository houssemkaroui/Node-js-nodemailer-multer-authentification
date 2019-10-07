
const mongoose = require("mongoose");

const paiementSchema = mongoose.Schema({
  montant: { type: Number, required: true },
  type: { type: String, required: true },
  facture: { type: Number },
  dateDePaiement: {type : Date,default : Date.now },

  idTalan: {type: String}
});

module.exports = mongoose.model("Paiement", paiementSchema);




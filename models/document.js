
const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  idTalent: {
     type: String
    },

  nom: {
    type :String},

  image:  {
     type: String 
    },

  DateDeCreation: {
    type : Date,default : Date.now
   }

});

module.exports = mongoose.model("Document", documentSchema);




const mongoose = require('mongoose');
const groupOffreSchema = mongoose.Schema({

idGroupe:{
	type:String
},
idOffre:{
	type:String
}

});
module.exports = mongoose.model("GroupOffre", groupOffreSchema);

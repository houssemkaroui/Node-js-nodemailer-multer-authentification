const mongoose = require('mongoose');
const offreSchema = mongoose.Schema({

    id: {
        type:Number
    },
    statut: {
        type:String,
        default :"Active"
    },
    domaine: {type: String},
    motCle: {type: String},
    systeme: {type: String},
    numero: {type:Number},
    description: {type:String},
    email: {
        type:String,
        upsert: true

    },
    dateDePostulation: {
        type:Date, 
        default: Date.now 
    },
    
    
});
offreSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


module.exports = mongoose.model("Offre", offreSchema);


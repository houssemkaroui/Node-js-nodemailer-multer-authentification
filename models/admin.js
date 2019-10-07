const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');


const adminSchema = mongoose.Schema({
    
    nom: {
        type: String,
        required: true
    },
     prenom: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
  
});


adminSchema.pre("save", function(next) {
    var admin = this
    if (!admin.isModified('password')) return callback()
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err)
      bcrypt.hash(admin.password, salt, function(err, hash) {
        if (err) return next(err)
        admin.password = hash
          const currentDate = new Date
          admin.updated_at = currentDate
          next()
      })
    }) 

  })



adminSchema.plugin(uniqueValidator);

const Admin = module.exports = mongoose.model('Admin', adminSchema);

adminSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');



// Get Admin by ID
module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

// Get Admin by username
module.exports.getAdminByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Admin.findOne(query, callback);
}

// Créer compte Admin
module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

// Comparer les mots de passe
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

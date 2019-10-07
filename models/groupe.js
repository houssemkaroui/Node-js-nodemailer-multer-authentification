const mongoose = require('mongoose');
const groupSchema = mongoose.Schema({

name:{

	type:String,
	unique:true
}
});

module.exports = mongoose.model("Group", groupSchema);

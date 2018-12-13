const mongoose = require('mongoose')


const Schema = mongoose.Schema

const RegisterSchema = new Schema({
	id_user: {
		type: String,
		required : true
	},
	id_event: {
		type: String,
		required : true
	}
})

module.exports = mongoose.model('Register',RegisterSchema)
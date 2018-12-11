const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

//define a schema
const Schema = mongoose.Schema

const AdminSchema = new Schema({
	email: {
		type: String,
		required : true
	},
	name: {
		type: String,
		required : true
	},
	passwd1:{
		type: String,
		required: true
	}
})
//hash user password before saving into database
AdminSchema.pre('save',function(next){
	var admin = this
	if(!admin.isModified('passwd1')) return next()

	//generate a salt
	bcrypt.genSalt(saltRounds,(err,salt)=>{
		if(err) return next(err)

			//hash the password along with our new salt
		bcrypt.hash(admin.passwd1, salt, (err,hash)=>{
			if(err) return next(err)

				//override the cleartext password with the hashed one
			admin.passwd1 = hash
			next()
		})
	})
})

module.exports = mongoose.model('Admin',AdminSchema)

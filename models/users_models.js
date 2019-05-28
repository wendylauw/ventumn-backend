const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

//define a schema
const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: {
		type: String,
		required : true
	},
	name: {
		type: String,
		required : true
	},
	tanggalLahir: {
		type: String,
		required : true
	},
	passwd1:{
		type: String,
		required: true
	}
})
//hash user password before saving into database
UserSchema.pre('save',function(next){
	var user = this
	if(!user.isModified('passwd1')) return next()

	//generate a salt
	bcrypt.genSalt(saltRounds,(err,salt)=>{
		if(err) return next(err)

			//hash the password along with our new salt
		bcrypt.hash(user.passwd1, salt, (err,hash)=>{
			if(err) return next(err)

				//override the cleartext password with the hashed one
			user.passwd1 = hash
			next()
		})
	})
})

module.exports = mongoose.model('User',UserSchema)

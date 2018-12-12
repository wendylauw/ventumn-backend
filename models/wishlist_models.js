const mongoose = require('mongoose')


const Schema = mongoose.Schema

const WishlistSchema = new Schema({
	id_user: {
		type: String,
		required : true
	},
	id_event: {
		type: String,
		required : true
	}
})

module.exports = mongoose.model('Wishlist',WishlistSchema)
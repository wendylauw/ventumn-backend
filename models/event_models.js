const mongoose = require('mongoose')

//define a schema
const Schema = mongoose.Schema

const EventSchema = new Schema({
	prodi: {
		type: String,
		required : true
	},
	nama: {
		type: String,
		required : true
	},
	price: {
		type: String,
		required : true
	},
	deskripsi: {
		type: String,
		required: true
	},
	tanggalMulai:{
		type: String,
		required: true
	},
	tanggalSelesai:{
		type: String,
		required: true
	},
	waktuMulai:{
		type: String,
		required: true
	},
	waktuSelesai:{
		type: String,
		required: true
	},
	poster:{
		type: String,
		required: true
	},
	latitude:{
		type: String,
		required: true
	},
	longitude: {
		type: String,
		required : true
	},
	lokasi: {
		type: String,
		required : true
	},
})


module.exports = mongoose.model('Event',EventSchema)

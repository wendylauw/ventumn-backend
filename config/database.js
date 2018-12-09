const mongoose = require('mongoose')
const mongoDB = 'mongodb://wendylauw:wendy1515@ds131531.mlab.com:31531/wendydb'
mongoose.connect(mongoDB,{ useNewUrlParser: true })
mongoose.Promise = global.Promise

module.exports = mongoose
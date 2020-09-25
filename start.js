const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// mongoose setup
mongoose.Promise = global.Promise;

mongoose
.connect('mongodb://localhost:27017/mongoose_myapp', {
    useUnifiedTopology: true
})
.then(function(){
    console.log('Database connection succesful.');
});

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});
// end of mongoose setup
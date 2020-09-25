const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    created_at: Date
});

userSchema.pre("save", function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});


userSchema.methods.comparePassword = (candidatePassword, StoredPassword) => {
    return bcrypt.compareSync(candidatePassword, StoredPassword);
 };

/*
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};
*/
module.exports = mongoose.model('User', userSchema);
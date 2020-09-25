const mongoose = require('mongoose');
const tweetSchema = new mongoose.Schema({
    tweet: {
        type: String,
        trim: true,
    },
    created_at: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

tweetSchema.pre("save", function (next) {

    if (!this.created_at) this.created_at = new Date();

    next();
});




module.exports = mongoose.model('Tweet', tweetSchema);
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require("dotenv").config();

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true},
});

const MessageSchema = new mongoose.Schema({
    username: String,
    content: String,
    timestamp: { type: Date, default: Date.now}
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
mongoose.model('Message', MessageSchema);

const dbURI = `mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@fsechatroom.pe80xlb.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
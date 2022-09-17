const mongoose = require('mongoose');
const Issue = require('./issue');

let ProjectSchema = new mongoose.Schema({
    name: String,
    issue: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
    }]
});

module.exports = mongoose.model("Project", ProjectSchema);
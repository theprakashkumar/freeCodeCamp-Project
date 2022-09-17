const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    assigned_to: {
        type: String,
        default: ""
    },
    status_text: {
        type: String,
        default: ""
    },
    open: {
        type: Boolean,
        default: true
    },
    issue_title: String,
    issue_text: String,
    created_by: String,
    created_on: {
        type: Date, 
        default: Date.now()
    },
    updated_on: {
        type: Date,
        default: Date.now()
    },
    __v: { 
        type: Number,
         select: false
    }
});

module.exports = mongoose.model("Issue", IssueSchema);
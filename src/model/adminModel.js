const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        Name: { // Name of the user
            type: String,
            required: true,
            trim: true
        },
        PhoneNumber: { // Phone number of the user (also used as the login username)
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        Password: { // Password for login
            type: String,
            required: true,
            trim: true
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('Admin', AdminSchema)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
        },
        Age: { // Age of the user
            type: Number,
            require: true,
            trim: true
        },
        Pincode: { // Pincode of the user
            type: Number,
            require: true,
            trim: true
        },
        AadharNo: { // Aadhar number of the user
            type: Number,
            require: true,
            trim: true
        },
        vaccinations: { // Array of vaccinations the user has received
            dose: { // First or second dose
                type: String,
                default: null
            },
            date: { // Date of the vaccination
                type: Date,
                default: null
            },
            time: { // Time of the vaccination
                type: Date,
                default: null
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('user', userSchema)
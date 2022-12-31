const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const registerSlotSchema = new mongoose.Schema(
    {
        date: {  // Date of the vaccine slot
            type: String,
            required: true
        },
        time: {   // Time of the vaccine slot
            type: String,
            required: true
        },
        userId: {  // ID of the user
            type: ObjectId,
            required: true
        },
        registered: {  // Array of users who have registered for the slot

            name: {   // Name of the user
                type: String,
                required: true
            },
            phoneNumber: {  // Phone number of the user
                type: String,
                required: true
            },
            age: {   // Age of the user
                type: Number,
                required: true
            },
            pincode: {   // Pincode of the user
                type: String,
                required: true
            },
            aadharNumber: {   // Aadhar number of the user
                type: String,
                required: true
            },
            dose: {  // First or second dose
                type: [String],
                enum: ["First", "Second"],
                required: true
            }
        },
        vaccinated: {  //vaccination status
            type: [String],
            enum: ["First", "Second", "Both", "NA"],
            default: ["NA"]
        }
    }
)

module.exports = mongoose.model("RegisterSlot", registerSlotSchema)
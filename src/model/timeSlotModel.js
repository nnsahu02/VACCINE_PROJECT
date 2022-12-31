const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        doses: {
            type: Number,
            required: true
        }
    }
)

module.exports = mongoose.model("Timeslot", timeSlotSchema)
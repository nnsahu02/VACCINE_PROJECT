const userModel = require('../model/userModel')
const slotModel = require('../model/timeSlotModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { isValidString, isValidId, isValidPassword, isValidPin, isValidMobile, isValidName, isValidAge, isValidAadhar } = require('../validator/validation')
const adminModel = require('../model/adminModel')
const registerSlotModel = require('../model/registerSlotModel')

//REGISTER USER
const registerUser = async (req, res) => {
    try {
        const bodyData = req.body
        if (!bodyData || Object.keys(bodyData).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Please provide some data on request body."
            })
        }
        const { Name, PhoneNumber, Password, Age, Pincode, AadharNo } = bodyData

        if (!Name) {
            return res.status(400).send({
                status: false,
                message: "Name is mandetory."
            })
        }
        if (!isValidName(Name)) {
            return res.status(400).send({
                status: false,
                message: "Name is in Invalid Format."
            })
        }
        if (!isValidString(Name)) {
            return res.status(400).send({
                status: false,
                message: "The Name must be in String Only and It can not be empty."
            })
        }
        if (!PhoneNumber) {
            return res.status(400).send({
                status: false,
                message: "PhoneNumber is mandetory."
            })
        }
        if (!isValidMobile(PhoneNumber)) {
            return res.status(400).send({
                status: false,
                message: "PhoneNumber is in Invalid Format."
            })
        }
        const numCheck = await userModel.findOne({ PhoneNumber })
        if (numCheck) {
            return res.send({
                status: false,
                message: "An User is Registered with this PhoneNumber, Please provide Another PhoneNumber."
            })
        }
        if (!Password) {
            return res.status(400).send({
                status: false,
                message: "Password is mandetory."
            })
        }
        if (!isValidString(Password)) {
            return res.status(400).send({
                status: false,
                message: "The Password must be in String Only and It can not be empty."
            })
        }
        if (!isValidPassword(Password)) {
            return res.status(400).send({
                status: false,
                message: "Password must contain 1 Uppercase and Lowecase letter with at least 1 special charachter , Password length should be 8-15 charachter. ex - Rahul@123"
            })
        }
        bodyData.Password = await bcrypt.hash(Password, 10)
        if (!Age) {
            return res.status(400).send({
                status: false,
                message: "Age is mandetory."
            })
        }
        if (!isValidAge(Age)) {
            return res.status(400).send({
                status: false,
                message: "Age is in Invalid Format."
            })
        }
        if (!Pincode) {
            return res.status(400).send({
                status: false,
                message: "Pincode is mandetory."
            })
        }
        if (!isValidPin(Pincode)) {
            return res.status(400).send({
                status: false,
                message: "Pincode is in Invalid Format."
            })
        }
        if (!AadharNo) {
            return res.status(400).send({
                status: false,
                message: "AadharNo is mandetory."
            })
        }
        if (!isValidAadhar(AadharNo)) {
            return res.status(400).send({
                status: false,
                message: "AadharNo is in Invalid Format."
            })
        }

        if (req.body.isAdmin == true) {
            const phncheck = await adminModel.findOne({ PhoneNumber })
            if (phncheck) {
                return res.status(400).send({
                    status: false,
                    message: "This Number is already registered with another Admin."
                })
            }
            let adminData = {
                Name: Name,
                PhoneNumber: PhoneNumber,
                Password: Password
            }
            const adminSave = await adminModel.create(adminData)
            return res.send({ status: true, message: "Admin created Successfully", data: adminSave })
        }

        const userData = await userModel.create(bodyData)

        const user = {
            _id: userData._id,
            Name: userData.Name,
            Age: userData.Age,
            AadharNo: userData.AadharNo,
            PhoneNumber: userData.PhoneNumber,
            Password: userData.Password
        }
        return res.status(201).send({
            status: true,
            message: "User Rigestered Successfully.",
            data: user
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-------------------------------------------><< LOGIN USER >><------------------------------------------//
const login = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body

        if (!PhoneNumber)
            return res.status(400).send({ status: false, message: 'PhoneNumber is required' })
        if (!isValidMobile(PhoneNumber))
            return res.status(400).send({ status: false, message: "Please enter the valid PhoneNumber" })

        if (!Password)
            return res.status(400).send({ status: false, message: 'Password is required' })

        const userData = await userModel.findOne({ PhoneNumber: PhoneNumber })
        if (!userData)
            return res.status(404).send({ status: false, message: "This PhoneNumber is not Registered." })

        let checkPassword = await bcrypt.compare(Password, userData.Password)
        if (!checkPassword) {
            return res.status(401).send({ status: false, message: "Incorrect Password." })
        }

        const userId = userData._id
        const token = jwt.sign({ userId: userId.toString() }, "mypassword", { expiresIn: "24h" })

        const data = {
            userId: userId,
            token: token
        }

        return res.status(200).send({ status: true, message: "User login successfull", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//GET SLOTS PER DAY
const getSlot = async (req, res) => {
    try {
        const date = req.body.date
        if (!date) {
            return res.status(400).send({ status: false, message: "Please provide date in request body." })
        }
        const slotData = await slotModel.find({ date }).sort({ time: 1 })
        if (slotData.length == 0) {
            return res.status(404).send({ status: false, message: `no slot found with the date ${date}` })
        }

        return res.status(200).send({ status: true, message: `${date}'s time slots.`, data: slotData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//REGISTER USER FOR SLOT
const registerSlot = async (req, res) => {
    try {
        const userId = req.params.userId.toString()
        const userData = await userModel.findById({ _id: userId })
        if (!userData) {
            return res.status(404).send({
                status: false,
                message: `No user found this ${userId}`
            })
        }

        const bodyData = req.body
        if (!bodyData || Object.keys(bodyData).length == 0) {
            return res.status(400).send({ status: false, message: "requestBody can not be empty." })
        }

        const { date, time, dose } = bodyData
        if (!date)
            return res.status(400).send({
                status: false,
                message: "Please provide date in request body."
            })
        const datePresent = await slotModel.findOne({ date })
        if (!datePresent)
            return res.status(404).send({
                status: false,
                message: `There is no slot in ${date}, Please check after one or two days.`
            })

        if (!time)
            return res.status(400).send({
                status: false,
                message: "Please provide time in request body."
            })
        const slotCheck = await slotModel.findOne({ date: date, time: time })
        if (!slotCheck)
            return res.status(404).send({
                status: false,
                message: `No slot found at ${time} in ${date} `
            })

        if (!dose)
            return res.status(400).send({
                status: false,
                message: "Please provide dose in request body."
            })
        const arr = ["First", "Second"]
        if (!arr.includes(dose))
            return res.status(400).send({
                status: false,
                message: 'Dose should Only follow the enum ["First", "Second"]'
            })
        if (slotCheck.doses == 0)
            return res.status(404).send({
                status: false,
                message: `The doses are finished at the time slot ${time} in ${date}`
            })


        if (dose == "First") {

            const checkdata = await registerSlotModel.findOne({ userId })

            if (checkdata != null) {
                let arr = checkdata.registered
                let doseData = (arr[0].dose[0])
                if (doseData == dose) {
                    return res.status(400).send({
                        status: false,
                        message: "You are already registered for firstDose"
                    })
                }
                if (checkdata.vaccinated[0] == 'First' || 'Both') {
                    return res.status(400).send({
                        status: false,
                        message: "You are already vaccinated with first dose."
                    })
                }
            }

            const registerSlotObj = {
                date: date,
                time: time,
                userId: userData._id,
                registered: {
                    name: userData.Name,
                    phoneNumber: userData.PhoneNumber,
                    age: userData.Age,
                    pincode: userData.Pincode,
                    aadharNumber: userData.AadharNo,
                    dose: dose
                }
            }

            await slotModel.findOneAndUpdate(
                { date: date, time: time },
                { $inc: { doses: -1 } },
                { new: true }
            )


            const registerData = await registerSlotModel.create(registerSlotObj)

            return res.status(200).send({ status: true, message: "Successfully registered for First Dose.", data: registerData })

        }

        if (dose == "Second") {

            const checkdata = await registerSlotModel.findOne({ userId })
            if (checkdata != null) {
                let arr = checkdata.registered
                let doseData = (arr[0].dose[0])
                if (doseData == dose) {
                    return res.status(400).send({
                        status: false,
                        message: "You are already registered for second Dose"
                    })
                }
                if (checkdata.vaccinated[0] == "Both") {
                    return res.status(400).send({
                        status: false,
                        message: "You are already vaccinated with Both dose."
                    })
                }
            }

            if ((checkdata == null)) {
                return res.status(400).send({ status: false, message: "Please register for the First dose First." })
            }

            if (checkdata.vaccinated[0] == 'First') {

                const registerSlotObj = {
                    date: date,
                    time: time,
                    userId: userData._id,
                    registered: {
                        name: userData.Name,
                        phoneNumber: userData.PhoneNumber,
                        age: userData.Age,
                        pincode: userData.Pincode,
                        aadharNumber: userData.AadharNo,
                        dose: dose
                    },
                    vaccinated: ['First']
                }
                await slotModel.findOneAndUpdate(
                    { date: date, time: time },
                    { $inc: { doses: -1 } },
                    { new: true }
                )

                await registerSlotModel.findOneAndDelete({ userId })
                const registerData = await registerSlotModel.create(registerSlotObj)

                return res.status(200).send({ status: true, message: "Successfully registered for Second Dose.", data: registerData })
            } else {
                return res.status(400).send({ status: false, message: "You can apply for second dose after successfully vaccinated with first dose." })
            }

        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//Update registered vaccine slot API
const updateRegisteredSlot = async (req, res) => {
    try {
        const bodyData = req.body
        const { slotId, newDate, newTime } = bodyData

        const regSlot = await registerSlotModel.findById({_id : slotId })
        if (!regSlot) {
            return res.status(404).send({ status: false, message: `no slot found with ${slotId}` })
        }

        let oldDate = regSlot.date
        let oldTime = regSlot.time

        let oldDate1 = new Date(oldDate)
        let newDate1 = new Date(newDate)
        const diff = newDate1 - oldDate1

        const updateAllowed = diff >= (24 * 60 * 60 * 1000)

        if (!updateAllowed) {
            return res.status(400).send({ status: false, message: "Update is not allowed (must be at least 24 hours prior to the original slot time)" })
        }

        const dateSlotCheck = await slotModel.findOne({ date: newDate, time: newTime })
        if (!dateSlotCheck) {
            return res.status(400).send({ status: false, message: `There is no slot with at ${newTime} in ${newDate}` })
        }

        if (dateSlotCheck.doses == 0) {
            return res.status(400).send({ status: false, message: `All the slot is already booked at ${newTime} in ${newDate}` })
        }

        const slotData = await registerSlotModel.findByIdAndUpdate(
            { _id: slotId },
            { $set: { date: newDate, time: newTime } },
            { new: true }
        )

        await slotModel.findOneAndUpdate(
            { date: oldDate, time: oldTime },
            { $inc: { doses: 1 } },
            { new: true }
        )

        await slotModel.findOneAndUpdate(
            { date: newDate, time: newTime },
            { $inc: { doses: -1 } },
            { new: true }
        )

        return res.status(200).send({ status: true, message: "Updated Registered Vaccine Slot.", data: slotData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { registerUser, login, getSlot, registerSlot, updateRegisteredSlot }
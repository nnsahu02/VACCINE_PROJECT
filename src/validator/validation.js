const mongoose = require('mongoose');

//=========================// isValidString //==================================

const isValidString = function (value) {
    if (typeof value === "undefined" || value === 'null') return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

//=========================// idCharacterValid //===============================

const isValidId = function (value) {
    return mongoose.Types.ObjectId.isValid(value);
};

//=========================// isValidPin //=======================================

const isValidPin = function (Pincode) {
    return /^\+?([1-9]{1})\)?([0-9]{5})$/.test(Pincode);
}

//=========================// isValidMobile //===================================

const isValidMobile = function (PhoneNumber) {
    if (/^[0]?[6789]\d{9}$/.test(PhoneNumber)) {
        return true
    }
}

//=========================// isValidPassword //==================================

const isValidPassword = function (pw) {
    let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
    if (pass.test(pw)) return true;
};

//=========================// isValidName //=====================================

const isValidName = function (Name) {
    if (/^[a-zA-Z ]+$/.test(Name)) {
        return true;
    }
};

//=========================// isValidAge //=====================================

const isValidAge = (Age) => {
    if (/^([1-9]\d|1[0-2]\d|120)$/.test(Age)) {
        return true
    }
}

const isValidAadhar = (AadharNo) => {
    if (/^\d{12}$/.test(AadharNo)) {
        return true
    }
}

module.exports = { isValidString, isValidId, isValidPin, isValidPassword, isValidMobile, isValidName, isValidAge, isValidAadhar }
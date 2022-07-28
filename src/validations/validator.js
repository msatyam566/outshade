const mongoose = require('mongoose')

const isValidValue = (value) => {
    if (typeof value === "undefined" || value === null)
        return false;
    if (typeof value === "string" && value.trim().length === 0) 
        return false;
    return true;
};


const isValidDetails = (requestBody) => Object.keys(requestBody).length > 0;


const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId)

module.exports = { isValidValue, isValidDetails, isValidObjectId }
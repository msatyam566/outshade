const eventModel = require('../models/eventModel')
const bcrypt = require('bcrypt')
const validator = require('../validations/validator')


//======================creating events=============================//

const createEvents = async (req,res)=>{
    try {

    let data = req.body;
    let {title,description,eventDate,createdby,invitations}= data

    if (!validator.isValidDetails(data)) {
        return res.status(400).send({ status: false, message: "please provide user data" })
    }

    if (!validator.isValidValue(title)) {
        return res.status(400).send({ status: false, messege: "please provide title" })
    }
    if (!validator.isValidDetails(description)) {
        return res.status(400).send({ status: false, message: "please provide user description" })
    }

    if (!validator.isValidValue(eventDate)) {
        return res.status(400).send({ status: false, messege: "please provide eventDate" })
    }
    if (!validator.isValidValue(createdby)) {
        return res.status(400).send({ status: false, messege: "please provide eventDate" })
    }
    if (!validator.isValidValue(invitations)) {
        return res.status(400).send({ status: false, messege: "please provide invitations" })
    }
    const finalDetails = {title,description,eventDate,invitations}
        let savedData = await userModel.create(finalDetails)
        return res.status(201).send({ status: true, msg: "event created successfully", data: savedData });
    

        
    } catch (error) {
        return res.status(500).send({status:false,messege: error.messege})
        
    }
}


module.exports={createEvents}
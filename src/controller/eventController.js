const eventModel = require('../models/eventModel')
const bcrypt = require('bcrypt')
const validator = require('../validations/validator');
const { events } = require('../models/userModel');


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


const getEventDetails = async function (req, res) {
    try {
        const eventUserId = req.params.userId;
        const userIdFromToken = req.userId
        
        
        if (!validator.isValidObjectId(eventUserId)) {
            return res.status(400).send({ status: false, message: "userId is invalid" });
        }
        
        const eventbyId = await eventModel.findById(eventUserId).lean();

        if (!eventbyId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        if (userIdFromToken != eventUserId) {
            return res.status(403).send({
              status: false,
              message: "Unauthorized access.",
            });
        }

        return res.status(200).send({ status: true, message: "event details", data: eventbyId });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateEventDetails= async (req,res)=>{
    {
        try {
            let data = req.body
            const id = req.params.userId
            const userIdFromToken = req.userId
    
            if (!validator.isValidDetails(data)) {
                return res.status(400).send({ status: false, message: "please provide details to update." });
                        }
            if (!validator.isValidObjectId(id)) {
                res.status(400).send({ status: false, message: "not a valid user id "})
                return
            }
              //Authorisation check
              if (userIdFromToken != id) {
                return res.status(403).send({
                  status: false,
                  message: "Unauthorized access.",
                });
            }
    
            const findUser = await userModel.findById({_id:id})
            if (!findUser) return res.status(404).send({ status: false, message: "User not found" })
    
    
            const { title,description, eventDate,createdBy,invitations} = data  
    
            if (title) {
                if (!validator.isValidValue(title)) {
                    return res.status(400).send({ status: false, message: "Please enter password to title " })
                }
            }
            if (description) {
                if (!validator.isValidValue(description)) {
                    return res.status(400).send({ status: false, message: "Please enter password to description " })
                }
            }
            if (eventDate) {
                if (!validator.isValidValue(eventDate)) {
                    return res.status(400).send({ status: false, message: "Please enter password to eventDate " })
                }
            }
            if (createdBy) {
                if (!validator.isValidValue(createdBy)) {
                    return res.status(400).send({ status: false, message: "Please enter password to createdBy " })
                }
            }
            if (invitations) {
                if (!validator.isValidValue(invitations)) {
                    return res.status(400).send({ status: false, message: "Please enter password to invitations " })
                }
            }

    
        const update = await eventModel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
        return res.status(200).send({ status: true, message: "User Profile updated", data: update })
           
        } catch (error) {
            return res.status(500).json({ status: false, msg: error.message });
        }
    };
    
}

const getEventDetailsByQuery =async(req,res)=>{
    try {
        const queryforDetails = req.query;
        let filter = {isDeleted:false}

const {title,eventDate}=queryforDetails

if (title) {
    if (!validator.isValidValue(title)) {
        return res.status(400).send({ status: false, message: "Please enter  title " })
    }
}
if (eventDate) {
    if (!validator.isValidValue(eventDate)) {
        return res.status(400).send({ status: false, message: "Please enter t eventDate " })
    }
}
const eventDetails = await eventModel.find(filter)

            if (events.length === 0) {
                return res.status(404).send({ productStatus: false, message: 'No events found' })
            }

            return res.status(200).send({ status: true, message: 'eventList', data: eventDetails })
        
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}






module.exports={createEvents,getEventDetails,updateEventDetails,getEventDetailsByQuery}
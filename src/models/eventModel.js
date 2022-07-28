const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const eventSchema = new mongoose.Schema({
title : {type:String, required:true},
description :  {type:String},
eventDate : {type:String,required:true},
createdBy:{ type: ObjectId, refs: 'User', required: true },
invitations:  [{
  invitee: { type: ObjectId, refs: 'User', required: true },
        timings: { type: String, required: true,},
       },],


}, { timestamps: true })



module.exports= mongoose.model("event",eventSchema)
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const validator = require('../validations/validator')

//===============creating user ==============================//
const createUser = async(req,res)=>{
    try {

        let data = req.body
        let {title,fullName,email,password}=data

        //================================Validations start=====================//

        if (!validator.isValidDetails(data)) {
            return res.status(400).send({ status: false, message: "please provide user data" })
        }
    
        if (!validator.isValidValue(title)) {
            return res.status(400).send({ status: false, messege: "please provide title" })
        }
        if (!validator.isValidValue(fullName)) {
            return res.status(400).send({ status: false, messege: "please provide fullName" })
        }

        if (!validator.isValidValue(email)) {
            return res.status(400).send({ status: false, messege: "please provide email" })
        }
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
        }
        let isDuplicateEmail = await userModel.findOne({ email })
        if (isDuplicateEmail) {
            return res.status(400).send({ status: false, message: "email already exists" })
        }

        if (!validator.isValidValue(password)) {
            return res.status(400).send({ status: false, messege: "please provide password" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
        }
        
        //===================Validations end================================//

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt)

        const finalDetails = {title,fullName,email,password,resetPasswordToken,createdAt,updatedAt}
        let savedData = await userModel.create(finalDetails)
        return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

//==============================user login===============================//

const userLogin = async (req, res) => {
    try {
        const data = req.body
        let {email, password} = data

        if (!validator.isValidDetails(data)) {
            return res.status(400).send({ status: false, message: "please provide user credentials." })
        }

        if (!validator.isValidValue(email)) {
            return res.status(400).send({ status: false, message: "Email-Id is required" })
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "Email should be a valid email address" })
        }

        if (!validator.isValidValue(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }

        let findUser = await userModel.findOne({email});
        
        if (!findUser)
            return res.status(404).send({
                status: false,
                msg: "Login failed! No user found with the provided email.",
        });

       const isValidPassword = await bcrypt.compare(password, findUser.password)

       if (!isValidPassword)
            return res.status(404).send({status: false,msg: "Login failed! Wrong password.", });

            let token = jwt.sign(
                {
                  userId: findUser._id,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60
                }, "outshade@123");
        
        res.header('Authorization', token);
        return res.status(200).send({ status: true, message: "User login successfull", data:{usedId:`${findUser._id}`, token: token }})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//==============================logout user===============================//


const logout = (req, res) => {
    return res.clearCookie("access_token").status(200).send({ message: "Successfully logged out" });
};


//================================update password============================//


const updatePassword = async (req, res) => {
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


        const { password } = data  

        if (password) {
            if (!validator.isValidValue(password)) {
                return res.status(400).send({ status: false, message: "Please enter password to update " })
            }
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
        }
        const salt = await bcrypt.genSalt(10);
                                                                
        data.password = await bcrypt.hash(data.password, salt); //// now we set user password to hashed password
    

    const update = await userModel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
    return res.status(200).send({ status: true, message: "User Profile updated", data: update })
       
    } catch (error) {
        return res.status(500).json({ status: false, msg: error.message });
    }
};

//============================reset password==============================//

const resetPassword = async(req,res)=>{
    try {
        const data = req.body.email
        const id = req.params.userId
        const userIdFromToken = req.userId

        if (!validator.isValidDetails(data)) {
            return res.status(400).send({ status: false, message: "please provide details to update." });
                    }
        if (!validator.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "not a valid user id "})
            
        }
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
        }
        const userEmail = await userModel.findOne({ data: email })
        
        if (!userEmail) 
          return resstatus(401).send({ status: false, msg: 'Not a correct Email check your email id ' })

          //Authorisation check
          if (userIdFromToken != id) {
            return res.status(403).send({
              status: false,
              message: "Unauthorized access.",
            });
        }
        
    } catch (error) {
        return res.status(500).send({status:false,messege:error.message})
        
    }
}






module.exports={createUser,userLogin,logout,updatePassword,resetPassword}
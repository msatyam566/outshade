const express = require("express")
const router = express.Router()


const userController = require("../controller/userController")
const eventController = require("../controller/eventController")
const auth = require('../middleware/auth')

//============userController=====================//

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)
router.get("/logout",auth.userAuth,userController.logout);
router.put('/user/:userId', auth.userAuth, userController.updatePassword)
router.post('/user/:userId',auth.userAuth,userController.resetPassword)

//===============eventController====================//

router.post('/createEvents',eventController.createEvents)
router.get('/geteventDetails',auth.userAuth,eventController.getEventDetails)
router.put('/updateEventDetails',auth.userAuth,eventController.updateEventDetails)
router.get('/getDetailsofevent',eventController.getEventDetailsByQuery)







// router.get('/logout',middleware.authentication, (req, res) => {
//     const token = req.headers["x-api-key"]
//     res.clearCookie('token');
//     return res.status(200).send("logout successfully");
//   });


module.exports = router;
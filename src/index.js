const express = require('express');
const mongoose = require('mongoose')
const route = require('./router/router');
const bodyParser = require('body-parser');



//==============packages for full application======================//

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', route);



//=================================Mongoose Connection=======================================//

mongoose.connect("mongodb+srv://msatyam566:5RKuruCHR4gM2ZDi@cluster0.dqzcc.mongodb.net/ManageEvents?authSource=admin&replicaSet=atlas-1kw93i-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))





//=============connection for application to server=====================//

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const userScema = require('./scema')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const { findOneAndUpdate } = require("./scema");

mongoose.connect("mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/Project_Group_3?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


// app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});




// login API 

app.post('/login', async function (req, res) {
    try {
        const email = req.body.email;
        const pwd = req.body.pwd;
        if (!req.body.email || !req.body.pwd) {
            res.status(400).send('please enter email and password')
        }
const saveUser = await userScema.create(req.body)
        const token = await jwt.sign({
            userId: email,
            userPwd: pwd
        }, "Secret_Key")

        console.log({ token });
        return res.status(200).send({ token ,saveUser})
    }
    catch (err) {
        return res.status(500).send(err)
    }
})



// authentication
const auth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']//("Authorization").replace("Bearer", "")
        console.log('token', token)
        if (!token) {
            return res.status(400).send('please enter token')
        }
        const decode = jwt.verify(token, "Secret_Key", function (err, decode) {
            if (err) {
                return res.status(401).send(err);
            }
            else {
                next();
            }
        })
    }
    catch (err) {
        return res.status(500).send(err)
    }

}



// reset link



app.post('/resetpass', auth, async function (req, res) {
    try {
        const email = req.body.email;
        if (!req.body.email) {
            return res.status(400).send('please enter email ')
        }

        const token = await jwt.sign({
            userId: email,
        }, "Secret_Key", {
            expiresIn: "300s" // token expire in 5 min
        })
        const link = 'http://localhost:3000/' + token
        return res.status(200).send({ reset_Link: link })
    }
    catch (err) {
        return res.status(500).send(err)
    }
})



// all user

app.get('/alluser',async function (req , res){
    try{
        const allUser = await userScema.find()
        return res.status(200).send(allUser)
    }catch(err){
        return res.status(500).send(err)
    }
})




// reset route 

app.get('/:token' , async function(req,res){
    try{
    const token = req.params.token
    const decode = jwt.verify(token, "Secret_Key", )
    
       return res.status(200).send({msg:'password changed successful'})
       }
    catch(err){
        return res.status(400).send('link expire')
    }
})


// dear sir hum aur bhe better kr sakte hai 
// jaise schema me reset banaya aur phir update kiya
// cookie use kr sakte hai jis se token send nhe karna hoga

// as so on

// thanks sonu verma
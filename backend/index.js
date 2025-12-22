import cors from "cors";

const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://sowbaranikaa4:1234@cluster0.25qlzvz.mongodb.net/passkey?appName=Cluster0").then(function(){
    console.log("Connected to MongoDB")
}).catch(function(){
    console.log("Connection failed")
})

const credential=mongoose.model("credential",{},"bulkmail")




app.post("/sendmail", function (req, res) {
    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
    },
});
new Promise(async function(resolve, reject) {
        try{
        for (var i = 0; i < emailList.length; i++) {
        await transporter.sendMail({
            from: "sowbaranikaa12@gmail.com",
            to: emailList[i],
            subject: "Test Email from Node.js",
            text: msg
        },

        )
        console.log("Email sent to : "+emailList[i])
    }
    resolve("Success")
    }
    catch(error){
        reject("Failed")
    }
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })

}).catch(function(error){
    console.log(error)
})

    
    


})

app.listen(5000, function () {
    console.log("Server started...")
})

export default app;
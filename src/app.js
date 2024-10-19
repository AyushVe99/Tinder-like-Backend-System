const express = require('express')

const app=express();


app.use('/',(req,res)=>{
    res.send("HomePage!")
})
app.use('/test',(req,res)=>{
    res.send("Test server is running!")    
})

app.use('/testPage',(req,res)=>{
     res.send("TestPages server is running now!")
})

app.listen(4000,()=>{
    console.log("Your server is running on port 4000");
})
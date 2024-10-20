const express = require('express')

const app=express();
app.use(express.json());


app.use('/abc',(req,res)=>{
    res.send("Test server is running!")    
})

// app.get('/user',(req,res)=>{
//     res.send({"name":"Ayush", "email":"vnishu0@gmail.com", "location":"noida"})
// })

// For making Dynamic Routes
app.get('/user/:Id/:name',(req,res)=>{
    const userDetails=req.params;
    console.log(userDetails);
    res.send(userDetails)
})

//For query
app.get('/user',(req,res)=>{
    const userDetails=req.query;
    console.log(userDetails);
    res.send(JSON.stringify(userDetails))
})

app.listen(4000,()=>{
    console.log("Your server is running on port 4000");
})
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');  
const userSchema= mongoose.Schema({
    fName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [16, 'First name must be at most 16 characters long'],
        trim: true
       
    },
    lName:{
        type:String,
        maxlength: [16, 'Last name must be at most 16 characters long'],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    gender:{
        type:String,
        enum: ['male', 'female', 'other'],
    },
    age:{
        type:Number
    },
    password:{
        type:String,
        required: true,
    },
    skills: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <= 10 && v.length>=2; 
            },
            message: 'You can only have a maximum of 10 skills and minimimum of 2.'
        }
    },
    shortDescription:{
        type:String
    }
},
{
    timestamps:true,
})

userSchema.methods.getJWT= async function(){
    const foundUser =this;
    const token= await jwt.sign({ _id: foundUser._id },  process.env.JWT_SECRET);
   
    return token;
}

module.exports=mongoose.model("User", userSchema)


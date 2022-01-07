var express= require ("express");
var alert=require("alert");
var app = express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/hitlessDB",{ useNewUrlParser: true , useUnifiedTopology: true})

const userSchema=new mongoose.Schema({
    name:String,
    password:String,
    rpassword:String
})

const User=new mongoose.model("user",userSchema)

let count=0;
let uname;
let message = "";

app.get("/",function(req,res){
    res.render("index",{message : ""});
})

app.get("/user",function(req,res){
    if(count==1){
        res.render("user",{message : message});
    }
    else{
        res.redirect("/signin");
    }
})

app.get("/signin",function(req,res){
    res.render("index",{message : message});
})

app.get("/signup",function(req,res){
    res.render("index",{message : message});
})

app.get("/Logout",function(req,res){
    res.redirect("/");
    count=0;
})


app.post("/signup",function(req,res){
    const name=req.body.username;
    const pass=req.body.password;
    const rpass=req.body.rpassword;
    // console.log(name,pass,rpass);
    User.findOne({name:name},function(e,found){
       if(!e){
            if(found){
                alert("User name already taken");
                res.redirect("/signup");
            }
            else{
                if(pass===rpass){
                const NewUser=new User({
                    name:name,
                    password:pass,
                    rpassword:rpass
                });
                NewUser.save(function(e){
                    if(!e){                    
                        res.redirect("/user")
                        count=1;
                    }
                })
            }
            else
            {
                alert("No match");
                res.redirect("/signup");
                
            }
            }
            
        }
    })
})

// app.get("/user")

app.post("/signin",function(req,res){
    const name=req.body.username;
    const pass=req.body.password;
    User.findOne({name:name},function(e,found){
        if(e){
            console.log(e)
        }
        else{
            if(found){
                if(found.password===pass){
                    count=1;
                    uname=name;
                    // message = "success";
                    res.render("user");
                }
                else{
                    // message = "Incorrect";
                    res.render("index",{message : "Incorrect"})
                }
            }
            else{
                // message = "Incorrect";
                res.render("index",{message : "Incorrect"})
            }
        }
    })
})

// app.post("/admission",function(req,res){
//     const NewAdmission=new Admission({
//         username:uname,
//         p_name:req.body.patientName,
//         age:req.body.age,
//         dob:req.body.dob,
//         address:req.body.address,
//         purpose:req.body.purpose,
//         a_name:req.body.attenderName
//     })
//     NewAdmission.save(function(e){
//         if(e){
//             console.log(e)
//         }
//         else{
//             alert("Record Saved Sucessfully");
//             res.redirect("/admission")
//         }
//     })
// })

app.listen(8000,function(){
    console.log("app is running in the browser 8000");
})

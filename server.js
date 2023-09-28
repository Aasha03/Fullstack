var express=require("express")
var app=express();
var path=require("path")
const bcrypt=require("bcrypt");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./dictionary.json");
const bodyParser=require('body-parser');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"/assets")));
app.use('/images', express.static('images'));
app.set('view engine', 'ejs');


app.use(express.urlencoded());
const ejs = require('ejs');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
app.use(express.static("public"));


app.get('/signup',function(req,res){
    error={}
    error.emailExists=""
    res.render("signuppage",{error})
})


app.get('/login',function(req,res){
   error={}
   error.invalid=""
    res.render("loginpage",{error})
})
app.get('/loginpage',function(req,res){
    error={}
    error.emailExists=""
    res.render("loginpage")
})
app.get('/signuppage',function(req,res){
    error={}
    error.emailExists=""
    res.render("signuppage")
})

app.post('/signupsubmit',function(req,res){
    error={}
    if (!req.body.email || !req.body.Username || !req.body.password) {
        error.emailExists="Please fill all the fields"
        return res.render("signuppage",{error});
    }else{
    db.collection("dictionary")
    .where("email", "==", req.body.email)
    .get()
    .then((docs) => {
        if (docs.size > 0) {
            error.emailExists = "An account with this email already exists";
            return res.render("signuppage",{error});
        }else{
    bcrypt.hash(req.body.password, 10, (err, hash) => { 
        db.collection('dictionary').add({
            fullname:req.body.Username,
            email:req.body.email,
            password:hash,
            re_password:hash
        }).then(()=>{
            res.render("loginPage")
        });
    });
}
})
    }
})

//login submit
app.post('/loginsubmit',function(req,res){
    error={}
    const { email, password } = req.body;
    db.collection("dictionary").where("email","==",email).get().then((docs)=>{
        if(docs.size>0){
            const user = docs.docs[0].data();
            const hashedPassword = user.password; 
            bcrypt.compare(password, hashedPassword, (err, result) => {
                console.log(result)
              if (result) {
                res.render("dic");
              } else {
                error.invalid="Invalid login Credentials"
                res.render("loginpage",{error})
              }
            });
        }
        else{
            error.invalid="Invalid login Credentials"
            res.render("loginpage",{error})
        }
        console.log(docs.size)
    })
})
app.listen(3000);
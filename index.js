//import the mongoose module
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery",false);
app.use(cors());


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');

const multerStorage = multer.diskStorage({
 
    destination: function (req, file, cb) {
     cb(null, path.join('../front/public/avatars'))
     },               
     filename: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, nanoid()+extension);
     }
});

// Multer Filter
const multerFilter = (req, file, cb) => {
    switch (file.mimetype.split("/")[1]){
        case "jpg":
        case "jpeg":
        case "png":
        case "webp": 
            cb(null, true);
            break;
        default : 
            cb(new Error("Not a PDF File!!"), false);
            break;
    }
};

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

const mongoDB = "mongodb+srv://cordonniercor:xEsTqdKuyurUYqJq@clustereventmaker.ixmvpkp.mongodb.net/EventManager";
const port = 3000;

let User = require("./models/user");
let Event = require("./models/event");


let dbevent = {
    name: "Premier evenement",
    description:"Description de mon premier evenement",
    date:"2023-06-20",
    time:"8h20",
    location:"10 rue François Noblat",
    image:"https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_1280.jpg",
    category:"road-trip",
    creator:"Corentin Cordonnier",
    places:10,
    price:0,
    participants:2
}

let uniqId = () =>{
    let n = Math.floor(Math.random() * (122 - 65) + 65);
    while(n>=91 && n<=96)
      n = Math.floor(Math.random() * (122 - 65) + 65);
    let k = Math.floor(Math.random() * 1000000);
    let m = String.fromCharCode(n) + k;
    return m;
}

const hashCode = (str) => {
    
    var hash = 0,
      i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB,
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !'+e));
}

  //================//
 //      CRUD      //
//================//

  /////////////
 //   GET   //
/////////////

/**
 * Get All Users
 **/
app.get('/api/users', (req, res, next) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
});

/**
 * Get a unique user
 */
app.get('/api/user/:id', (req, res, next) => {
    let id = req.params.id;
    User.findOne({_id : id})
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
});

/**
 * Get All Events
 **/
app.get('/api/events', (req, res, next) => {
    Event.find({})
        .then(events => res.status(200).json(events))
        .catch(error => res.status(400).json({ error }));
});

/**
 * Get a unique event
 */
app.get('/api/event/:id', (req, res, next) => {
    let id = req.params.id;
    Event.findOne({_id : id})
        .then(event => res.status(200).json(event))
        .catch(error => res.status(400).json({ error }));
});



  //////////
 // POST //
//////////



/**
 * Add a user 
 */
app.post('/api/user/add', upload.single('avatar'),async (req, res, next) => {
    var password = await bcrypt.hash(req.body.password, 10).then( hash => {
        return hash;
    }).catch(err => res.status(500).send({ error: err }));

    let file = req.file;
    if(!file) {
        res.status(500).send({ error: "Format d'image non valide. Veuillez ajouter une image au format JPG, PNG ou webp." });
    }
    
    let userInfos = {
        username : req.body.username,
        mail : req.body.mail,
        password : password,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        role : "Creator",
        avatar : file.filename,
        registration : new Date(),
    }

    let user = new User(userInfos);
    user.save()
    .then(()=>{
        res.status(201).json({message: "L'utilisateur a bien été enregistré"})
    }).catch(error => res.status(400).json({error}));
});

/**
 * Add an event
 */
app.post('/api/event/add', upload.single('avatar'), async (req, res, next) => {
    let file = req.file;
    if(!file) {
        res.status(500).send({ error: "Format d'image non valide. Veuillez ajouter une image au format JPG, PNG ou webp." });
    }

    let eventInfos = {
        title: req.body.title,
        description:req.body.description,
        date:req.body.date,
        time:req.body.time,
        location:req.body.location,
        image:file?.filename,
        category:req.body.category,
        creator:"corentin cordonnier",
        places:req.body.places,
        price:req.body.price,
        participants:{}
    }   

    let event = new Event(eventInfos);

    event.save()
    .then(()=>{
        res.status(201).json({message: "L'évènement a bien été enregistré"})
    }).catch(error => res.status(400).json({error}));
});



  /////////
 // PUT //
/////////

/**
 * Modify a user
 */
app.put('/api/user/:id', (req, res, next) =>{
    let id = req.params.id;
    let newUser = {...dbuser,age:29}
    User.updateOne({ _id: id}, { ...newUser, _id: id})
    .then(()=> res.status(200).json({message:"User modifié !"}))
    .catch(error => res.status(400).json({error}));
});

/**
 * Modify an event
 */
app.put('/api/event/:id', (req, res, next) =>{
    let id = req.params.id;
    let newEvent = {...dbevent,color:"blue"}
    Event.updateOne({ _id: id}, { ...newEvent, _id: id})
    .then(()=> res.status(200).json({message:"Event modifié !"}))
    .catch(error => res.status(400).json({error}));
});


  ////////////
 // DELETE //
////////////

/**
 * Delete a user
 */
app.delete('/api/user/:id'), (req, res, next) => {
    let id = req.params.id;
    User.deleteOne({ _id: id})
    .then(()=>res.status(200).json({message:"User Supprimé !"}))
    .catch(error => res.status(400).json({error}));
}

/**
 * Delete an event 
 */
app.delete('/api/event/:id'), (req, res, next) => {
    let id = req.params.id;
    Event.deleteOne({ _id: id})
    .then(()=>res.status(200).json({message:"Event Supprimé !"}))
    .catch(error => res.status(400).json({error}));
}


//=============//
//  FIN CRUD   //
//=============//


//=============//
//    AUTH     //
//=============//
const maxAge = 3*24*60*60*1000;
let createToken = (id) =>{
    return(jwt.sign({id}, "maclesecrete", {
        expiresIn: maxAge
    }));
};

app.post('/api/login', async (req,res, next) => {
    let {mail, password} = req.body;
     try {
        let user =  await User.login(mail,password);
        let token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly:true, maxAge});
        console.log("user_id",user._id);  
        res.status(200).json({user: user._id});
        
     } catch (err){
         console.warn("corentin "+err.name,err.message);
         res.status(401).json({ message: err.message });
     }
});


// Listen to the server
  app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`);
  });
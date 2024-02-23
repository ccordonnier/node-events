//import the mongoose module
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
require('dotenv').config()

//routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const categoriesRoute = require('./routes/categories');

mongoose.set("strictQuery",false);
app.use(cors());


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@clustereventmaker.ixmvpkp.mongodb.net/EventManager";
const port = 3001;

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
    .catch((e) => console.log('Connexion à MongoDB échouée ! '+e));
}

app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);
app.use('/api/login', authRoute);
app.use('/api/categories', categoriesRoute);

// Listen to the server
app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`);
});



// /**
//  * Add a user 
//  */
// app.post('/api/user/add', upload.single('avatar'),async (req, res, next) => {
//     // let file = req.file;
//     // if(!file) {
//     //     res.status(500).send({ error: "Format d'image non valide. Veuillez ajouter une image au format JPG, PNG ou webp." });
//     // }
    
//     let userInfos = {
//         username : req.body.email.substring(0,req.body.email.indexOf("@")),
//         email : req.body.email,
//         password : req.body.password,
//         firstname : req.body.firstname,
//         lastname : req.body.lastname,
//         role : [],
//         avatar : req.file?req.file.filename:"no-image.jpg",
//         registration : new Date(),
//         birthdate : new Date(req.body.birthdate),
//     }

//     let user = new User(userInfos);
//     user.save()
//     .then(()=>{
//         res.status(201).json({message: "L'utilisateur a bien été enregistré"})
//     }).catch(error => res.status(400).json({error}));
// });
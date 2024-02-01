const User = require('../models/user');

/**
 * Get All Users
 **/
module.exports.getAll = (req, res) => {
  User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
};

/**
* Get a unique user from his id
*/
module.exports.getOne = (req, res) => {
  let id = req.params.id;
  User.findOne({_id : id})
      .then(user => res.status(200).json(user))
      .catch(error => res.status(400).json({ error }));
};

/**
 * Add a user
 */
module.exports.add = (req, res) => {
  let file = req.file;
  if(!file) {
      res.status(500).send({ error: "Format d'image non valide. Veuillez ajouter une image au format JPG, PNG ou webp." });
  }
  
  let userInfos = {
      username : req.body.email.substring(0,req.body.email.indexOf("@")),
      email : req.body.email,
      password : req.body.password,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      role : [],
      avatar : req.file?req.file.filename:"no-image.jpg",
      avatar : "no-image.jpg",
      registration : new Date(),
      birthdate : new Date(req.body.birthdate),
  }

  let user = new User(userInfos);
  user.save().
    then(()=>{
      res.status(201).json({message: "L'utilisateur a bien été enregistré"})
    }).catch(error => res.status(400).json({error}));
};


/**
 * Modify a user
 */
module.exports.modify = (req, res) =>{
  let id = req.params.id;
  let user = User.findOne({_id: id});
  let newUser = {...user, age:30};
  User.updateOne({ _id: id}, { ...newUser})
  .then(()=> res.status(201).json({message:"User modifié !"}))
  .catch(error => res.status(400).json({error}));
};


/**
 * Remove a user
 */
module.exports.remove = (req, res) => {
  let id = req.params.id;
  User.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: "User Supprimé !" }))
    .catch(error => res.status(400).json({ error }));
};



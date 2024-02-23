const Event = require('../models/event');

/**
 * Get All Events
 **/
module.exports.getAll = (req, res) => {
  let filter = {};
  if(req.query.userId!==undefined){
      filter = {id_creator:req.query.userId}
  }
  Event.find(filter)
      .then(events => res.status(200).json(events))
      .catch(error => res.status(400).json({ error }));
};

/**
* Get a unique event
*/
module.exports.getOne = (req, res) => {
  let id = req.params.id;
  Event.findOne({_id : id})
      .then(event => res.status(200).json(event))
      .catch(error => res.status(400).json({ error }));
};

/**
 * Add an event
 */
module.exports.add = (req, res) => {
    const file = req.file;
    
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
    console.log("event",event);
    event.save()
    .then(()=>{
        res.status(201).json({message: "L'évènement a bien été enregistré"})
    }).catch(error => res.status(400).json({error}));
};


/**
 * Modify an event
 */
module.exports.modify = (req, res, ) =>{
    let file = req.file;
    if(!file) {
        res.status(500).send({ error: "Veuillez ajouter une image au format JPG, PNG ou webp." });
    }
    let id = req.params.id;
    let newEvent = {...req.body, 
      image:file.filename
    };

    Event.updateOne({ _id: id}, newEvent)
    .then(()=> res.status(201).json({message:"Event modifié !"}))
    .catch(error => res.status(400).json({error}));
};



/**
 * Delete an event 
 */
module.exports.remove = (req, res, next) => {
    let id = req.params.id;
    Event.deleteOne({ _id: id})
    .then(()=>res.status(200).json({message:"Event Supprimé !"}))
    .catch(error => res.status(400).json({error}));
}

const Categories = require('../models/categorie');

/**
* Get All categories
*/
module.exports.getAll = (req, res) => {
  let filter = {};
  if(req.query.userId!==undefined){
      filter = {id_creator:req.query.userId}
  }
  Categories.find(filter)
      .then(categories => res.status(200).json(categories))
      .catch(error => res.status(400).json({ error }));
};
const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dirname;
        switch(file.fieldname){
            case "avatar":
                dirname = "../next-events/public/avatars";
                break;
            case "imageEvent":
                dirname = "../next-events/public/evenements";
                break;
            default:
                dirname = "../next-events/public/images"
        } 
        cb(null, path.join(dirname))  
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
module.exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


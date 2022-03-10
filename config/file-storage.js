// middleware for handling multipart/form-data , which is primarily used for uploading files
const multer  = require('multer');

//The path module provides utilities for working with file and directory paths.
const path = require('path');

//allows for file storing so that the images are stored in the uploads folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,process.cwd() + '/public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + path.extname(file.originalname)) 
    }
  })

// sets the requirements for the uploaded pictures, 
const upload = multer({
    dest: 'uploads',
    storage: storage,
    
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/.(jpg|png)$/)){
            return cb(new Error('Please upload picture in jpg/png format'))
        }
        cb(undefined,true)
    }
 });

 module.exports = {
     storage,
     upload 
 }
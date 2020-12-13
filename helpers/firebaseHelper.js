const express = require('express');
const app = express();
const {Storage} = require('@google-cloud/storage');
const {format} = require('util');



const storage = new Storage({
    projectId: 'cxmo-node',
    credentials: require('../cxmo-praivit-firebase-adminsdk-wc354-162db1b512.json'),
    predefinedAcl: 'publicRead',
    cacheControl: 'public, max-age=31536000'
    
    });
    
   // const bucket = storage.bucket("gs://cxmo-node.appspot.com");
    const bucket = storage.bucket("gs://cxmo-praivit.appspot.com");

var uploadImageToStorage =async(file)=>
{
        console.log(file);
    if (!file) {
        return null;
      }
      console.log("blobStream "+file.originalname);
      var file_name=(file.originalname.replace(/\s/g,'').trim());
      let newFileName = `${Date.now()}_${file_name}`;
      console.log("blobStream "+newFileName.replace(/\s/g,''));
    let fileUpload = bucket.file(newFileName);


    const blobStream = await fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
    
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        console.log("blobStream "+url);
        

     /* await   blobStream.on('error', (error) => {
       return 'FAIL';
      });

    await  blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        
      });*/
  
      blobStream.end(file.buffer);

      return url;
  
}


module.exports = {
    uploadImageToStorage
}
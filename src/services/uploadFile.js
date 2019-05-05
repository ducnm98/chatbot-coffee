var multer = require('multer');
var fs = require('fs');

module.exports = {
  StoreFile: () => {
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'src/app/public/uploads')
      },
      filename: (req, file, cb) => {
        var fileName = file.originalname.split('.');
        let name = `${new Date().getTime()}.${fileName[fileName.length - 1]}`
        cb(null, name);
      }
  });
    return multer({storage: storage});
  },
}
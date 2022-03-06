const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',                                        // Dictionnaire // permet de générer l'extension du fichier 
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({                         // fonction de multer: enregistre sur le disk
  destination: (req, file, callback) => {                    // il a besoin d'une destination = explique a multer dans quel fichier enregistrer les fichiers// prend 3 arguments
    callback(null, 'images');
  },
  filename: (req, file, callback) => {                       // explique à multer quel nom de fichier utiliser
    const name = file.originalname.split(' ').join('_');     // générer le nom du fichier, on utilise le nom d'origine// split va remplacer les espaces par underscor
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);     // argument null pour dire qu'il ny a pas d'erreur
  }
});

module.exports = multer({storage: storage}).single('image');    //single pour dire qu'il s'agit d'un fichier unique

// Ici on retrouve toute la logique de nos routes 
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');  // on importe
const multer = require('../middleware/multer-config');  

const sauceCtrl = require ('../controllers/sauce');



      // routes avec appel des fonctions qui se retrouvent dans le dossier controllers qui stock la logique métier 
                               /////////// route GET  ///////
router.get('/',auth,  sauceCtrl.getAllSauces);
                              /////////// route POST  ///////
router.post('/',auth, multer, sauceCtrl.creatSauce);                       // on rajoute auth pour pprotéger nos routes

router.get('/:id',auth,  sauceCtrl.getOneSauce);

                                /////////// Route PUT permet de modifier l'article ajouté//////
router.put('/:id',auth, multer,  sauceCtrl.modifySauce);

                                //////// route delete permet de supprimer l'article /////
router.delete('/:id',auth,  sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);





module.exports = router;
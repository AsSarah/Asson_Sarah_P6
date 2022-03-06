const express = require('express');

const router = express.Router();

const userCtrl= require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports = router;
// le  frontend va envoyer les infos du mot de passe et de l'adresse mail c'est pour cela qu'on utilise des routes
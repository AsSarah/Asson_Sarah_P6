// enregistrer la logique métier dans le controller
const sauce = require('../models/sauce'); // on importe à nouveau le thing ici 
const fs = require('fs');   
const Sauce = require('../models/sauce'); // on importe à nouveau le thing ici                                                       //pour acceder aux différentes info liées au systeme de fichier 

//Ajouter un nouveau produit
exports.creatSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);                                 // ce sera un objet JS sous forme de chaîne de caractére
  
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,  // génére l'url de l'image, le protocole, le nom d'hote et le nom du fichier
    dislikes: 0,
    likes: 0,
    usersLiked: [],                                                                // renvoi un tableau vide
    usersDisliked: []



  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


//Modifier un produit
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?                                                             
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(403).json({ error }));
};


// //supprimer un produit , le produit va alors être supprimer du dossier images
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: new Error("Cette sauce n'existe pas !")});
      }
      // identifiant mis dans objet requête utilsé pour le comparer le userId de la sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: new Error('Requête non autorisée !')});
      }
      return sauce;
    })
    .then(sauce => {
      // récupère le nom de fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // supprime le fichier puis effectue le callback qui supprime de la BDD
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
          
      });
    })
    .catch(error => res.status(500).json({ error }));
};

      
// Récupérer un seul objet
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        }) // la methode findOne dans notre modéle sauce afin de trouver le thing unique ayant le meme _id
        .then(
          (sauce) => {
            res.status(200).json(sauce);
          }
        ).catch(
          (error) => {
            res.status(404).json({
              error: error
            });
          }
        );
      };

//Récupére tous les objets
exports.getAllSauces = (req, res, next) => {
    sauce.find() // find permet de trouver un objet
        .then(
          (sauces) => res.status(200).json(sauces))
        .catch(
          (error) => res.status(400).json({
            error:error
        }));

};


// Gestion des likes et dislikes
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const sauceId = req.params.id;
  const etatLike = req.body.like;

  switch (etatLike) {                       // exécute les instrcutions correspondantes
      //si like=1 on incrémente l'attribut likes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersLiked
      case 1:
          Sauce.updateOne({ _id: sauceId }, 
            { 
              $inc: { likes: +1 },             //L' opérateur incrémente un champ d'une valeur spécifiée, s'il ny a pas de champ, il le créer
             $push: { usersLiked: userId }    //L'opérateur de DB met la valeur dans un tableau 
            })
              .then(() => res.status(200).json({ message: "Like ajouté à la sauce" }))
              .catch((error) => res.status(400).json({ error }));
          break;
          //si like=0 alors on étudie les deux tableaux usersLiked et usersDisliked et on mets à jour les attributs likes et dislikes ainsi que les tableaux eux meme selon la présence de l'userId dans l'un des deux
      case 0:
          //retourne le tableau correspondant a sauceId
          Sauce.findOne({ _id: sauceId })
          
              .then(sauce => {
                  if (sauce.usersLiked.includes(userId)) {
                      //décrémente l'attribut likes de la sauce et supprime l'userId du tableau usersLiked
                      Sauce.updateOne({ _id: sauceId }, 
                        { 
                          $inc: { likes: -1 },              //enléve un like ainsi que l'userId du tableau DB
                           $pull: { usersLiked: userId } 
                          })
                          .then(() => res.status(200).json({ message: "Vous avez enlever votre like !" }))
                          .catch(error => res.status(400).json({ error }));
                  } else if (sauce.usersDisliked.includes(userId)) {
                      //décrémente l'attribut dislikes de la sauce et supprime l'userId du tableau usersDisliked
                      Sauce.updateOne({ _id: sauceId },
                         {
                            $inc: { dislikes: -1 }, 
                            $pull: { usersDisliked: userId } 
                          })
                          .then(() => res.status(200).json({ message: "Vous avez enlever votre dislike !" }))
                          .catch(error => res.status(400).json({ error }));
                  }
              })
              .catch(error => res.status(400).json({ error }));
          break;
          //si like=-1 on incrémente l'attribut dislikes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersDisliked
      case -1:
          Sauce.updateOne({ _id: sauceId }, 
            { 
              $inc: { dislikes: +1 }, 
              $push: { usersDisliked: userId }
              
            })
              .then(() => res.status(200).json({ message: "dislike ajouté à la sauce" })) 
              .catch((error) => res.status(400).json({ error }));
          break;                                  //permet de terminer une boucle
  }
  
};



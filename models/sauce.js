//sauce.js : ici on ajoute le schema de donné qui va nous permettre d'ajouter un nouveau produit
const mongoose = require('mongoose');                                       

const sauceSchema = mongoose.Schema({                                   // Création du schema de données avec toutes les infos dont nos objet ont besoin  
userId:{ type: String, required: true},
name: { type: String, required: true },
manufacturer:{ type: String, required: true },
description:{ type: String, required: true },
mainPepper:{ type: String, required: true },
imageUrl: { type: String, required: true },
heat:{ type: Number, required: true },
likes: { type: Number, required: true },
dislikes:{ type: Number, required: true },
usersLiked:{ type: [String], required: true },                           //tableau des identifiants des utilisateurs qui ont aimé (liké) la sauce
usersDisliked:{ type: [String], required: true },
});
                                    
module.exports = mongoose.model( ' sauce ', sauceSchema);               // la méthode model transforme le model en un modele utilisable                                       
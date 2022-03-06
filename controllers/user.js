const bcrypt =require('bcrypt');
const jwt = require ('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next)=> {                           // fonction signup pour l'enregistrement de nos utilisateurs 
     bcrypt.hash(req.body.password,10)                           //10= faire 10tours de l'algorythme                   //hash :  fonction pour hasher / décrypter un mot de passe
     .then(hash => {
         const user = new User({
             email: req.body.email,
             password: hash                                //on enregistre le hash créer plus haut afin de ne pas stocké les mots de passe en blanc
         });
            user.save()
            .then(()=> res.status(201).json({message:'Utilisateur crée'}))
            .catch(error=> res.status(403).json({ message:'Erreur, cette adresse mail est déjà utilisée ! '}));   // on utilise une erreur 400 pour les différencier
        })
     .catch(error=> res.status(500).json({ error}));
};

// la fonction login permet aux utilisateurs existant de se connecter à l'appli
exports.login= (req, res, next) => {                                      // pour connecter les utilisateur existant
 User.findOne({email: req.body.email })                                  //on veut que ce soit l'adresse mail correspond à l'adress mail de l' utilisateur
 .then(user=> {                                                         // on vérifie si on a un user ou non
    if(!user){  console.log(req.body.email);                                                        //si on reçoit pas de user  
        return res.status(401).json({error:'Utilisateur non trouvé'});  // on renvoit une erreur 403 unauthorized request
    }
    bcrypt.compare(req.body.password, user.password)                   //on utilise compare, on veut comparer le mot de passe envoyé 
                                                                        //avec la requete avec la hash enregistrer dans notre user
    .then(valid=>{                                                     // on reçoit un boolean ( une boucle )
        if (!valid){
            return res.status(401).json({error:'Mot de passe incorrect'});   
        }
        res.status(200).json({                                          // si identifiant valable, on revoit son userID et un token
            userId: user._id,
            token: jwt.sign(                                            // données qu'on veut encoder à l'interieur du token
                                                        
            { userId: user._id },                                        //1er argument:afin d'être sûre que cette requête correspond bien à ce userId

             'RANDOM_TOKEN_SECRET',                                      //2nd argument: clé secréte pour l'encodage

             {expiresIn: '24h'}                                         // 3eme argument: configuration pour appliquer une expiration 
                                                                        //pour notre token de 24h sinon plus concidérer comme valable 
        )
        });
    })
    .catch(error => res.status(500).json({ error}));
 })

 .catch(error => res.status(500).json({ error}));                //si on a un probleme de connexion ou un pb lié à mongoDB

};
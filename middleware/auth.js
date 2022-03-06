const jwt = require('jsonwebtoken');                                   // pour vérifier les token

module.exports = (req, res, next) => {
  try {                                                               // car plusieurs éléments peuvent poser probléme
    const token = req.headers.authorization.split(' ')[1];            // on split : retourne un tableau avec un espace et [1]le second élément
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');    // 2nde étape: décoder le token et on vérifie le token, 2nd argument = la clé secrete créer précedement
    const userId = decodedToken.userId;                               //extraire cette vérification si y a une erreur  
    req.auth = {userId: userId};                                      // attribuer ce userId à l'objet requête, la requete comporte le userId sous sa clé userId      
    if (req.body.userId && req.body.userId !== userId) {              //ici on veut vérifier s'il y a un userId avec la requête qui correspond à celle du token// si on un userId dans le corps de la requête et qu'il est différent de userId   
      throw 'Invalid user ID';                                        // on retourne l'erreur avec un throw
    } else {
      next();                                                         // si tout va bien on va  appeler next car il s'agit d'un middleware 
    }
  } catch {
    res.status(403).json({
      error: new Error('Invalid request!')
    });
  }
};
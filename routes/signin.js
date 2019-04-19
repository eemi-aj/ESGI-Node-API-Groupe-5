var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-api";
const JwtCle = process.env.JWT_KEY || 'secret';

router.post('/',function(req,res,next){
  //res.render('signup', { title: 'Notes-Pages' });
  if(req.body.password.length < 4){
    res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
  }
  else if(!checkUser(req.body.user)){
    res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
  }
  else if(req.body.user.length <2 || req.body.user.length > 20){
    res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'})
  }
  else{
    signupFunction(req.body.user,req.body.password,res);
  }


});

module.exports = router;

function signupFunction(user,password,res){
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');
  // Connection URL
  // Database Name
  const dbName = 'notes-api';

  (async function() {

  const client = new MongoClient(url);

  try {
    // Use connect method to connect to the Server
    await client.connect();
    const db = client.db(dbName);
    //On stocke d'abord la connexion.
    //On check si le nom existe dans la base.
    //Si oui erreur. Si non on insère.

    var myobj = { username: user, password: password };
    var myCol = db.collection("users");
    if(!await myCol.findOne({username:user})){
      res.status(400).send({error: 'Cet identifiant est inconnu'})
    }
    else{
      var userId;
      await myCol.findOne({username:user}, function (error, response) {
        if(error) {
        console.log('Error occurred while inserting');
        }
        else{
          userId = response._id;
          console.log('Response de la mort : '+response._id);
          console.log('Nicolass '+user);
          console.log("Putaiin"+JwtCle);
          jwt.sign({userId:userId}, JwtCle, { expiresIn: '24h' }, (err, token) => {
            res.send({
              token:token,
              error:"null"
            });
          });
         }
      });
      /*const JWTToken = jwt.sign({
        email: user.email,
        _id: user._id
      },
      JwtCle,
       {
         expiresIn: '2h'
       });
       res.status(200).json({
          success: 'Welcome to the JWT Auth',
          token: JWTToken
        });*/
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
}

//On écris cette fonction pour checker que le mot est écris de lettre en a-z.
function checkUser(user){
  if(/^[a-z]+$/.test(user)){
      return true;
  }
  else {
     return false;
  }
}

var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//On configure le programme avec les variables d'envirronement
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
    if(await myCol.findOne({username:user})){
      res.status(400).send({error: 'Cet identifiant est déjà associé à un compte'});
    }
    else{
      var userId;
      await myCol.insertOne(myobj, function (error, response) {
      if(error) {
      console.log('Error occurred while inserting');
       // return
      }
      else {
      var string = JSON.parse(response);
      userId = response["ops"][0]["_id"]

      console.log('PGKROJFGIORSIG',response["ops"][0]["_id"]);
      jwt.sign({userId: userId},JwtCle, { expiresIn: '24h' }, (err, token) => {
        console.log("Putaiin"+JwtCle);
        res.send({
          token:token,
          error:"null"
        });
      });
       //res.send({error:"null",token:JWTToken});
      }
      });

      console.log('Problem asynchrone',"isoefjdorjgoic")
      //res.send({error:"blabla",token:JWTToken,userId:userId});
       /*res.status(200).json({
          success: 'Welcome to the JWT Auth',
          token: JWTToken,
          userName:userId
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

//On fait une fonction qui permet de connaitre l id à partir du username

function getIdByName(user,client){
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');

  const dbName = 'notes-api';
  try {
    // Use connect method to connect to the Server

    const db = client.db(dbName);
    var myCol = db.collection("users");
    var userIdToken = myCol.findOne({username:user})._id;
    console.log("USER ID TOKEN :"+userIdToken)
    return userIdToken;
  } catch (err) {
    console.log("TA MERE LA GROSSE PUTE");
  }

  client.close();
}



//Etape n°1 : Réussir à créer un utilisateur dans la base de donnée.
  //Objectif 1 : Se connecter à la base au moment où le post est envoyé.
  //Objectif 2 : Réussir à creer un user test dans la base au moment du post.
  //Objectif 3 : Creer le user avec les informations que nous fournit l'utilisateur.

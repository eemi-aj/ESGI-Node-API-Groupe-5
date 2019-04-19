var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
// URL de connexion
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-api";
const JwtCle = process.env.JWT_KEY || 'secret';
// Nom de la base
const dbName = 'notes-api';

/* GET users listing. */
router.get('/', async function(req, res, next) {
  //Objectif 1 : Checker s'il y a un token dans l'entête. S'il n'y a pas de tocken --> une erreur.
  const token = req.header('Authorization');
  console.log('ON test le token '+req.header('Authorization'));
    const client = new MongoClient(url);
    await client.connect();
  try{
    var decode =  jwt.verify(token,JwtCle);
    console.log('On test le verify : '+decode.userId);
    
  }catch(err){
    console.log(err);
    res.status(401).send({error:"Utilisateur non connecte"});
  }

  try{
    await client.connect();
    const db = client.db(dbName);
    const mycol = db.collection('notes');
    var result = await mycol.find({userId : decode.userId}).toArray();
    console.log("Voici la liste de vos notes :\n");
    res.send(result);
  }catch(err){
    console.log(err);
  }


});

router.put('/', async function(req, res){
    const token = req.header('Authorization');
    const client = new MongoClient(url);
    
    try{
    var decode = jwt.verify(token,JwtCle);
    console.log('On test le verify : '+decode.userId);
    
    }catch(err){
      console.log(err);
    }

    try{
      await client.connect();
      const db = client.db(dbName);
      var myCol = db.collection("notes");
      const noteContent = {
        userId: decode.userId,
        content: req.body.content,
        createdAt: getDateDay(),
        lastUpdatedAt: null
        }
      const result = myCol.insertOne(noteContent, function (error, response) {
        if(error) {
         console.log('Error occurred while inserting');
        }
      });
      client.close();
      res.send({error: null, note: noteContent});
    }catch(err){
      console.log(err.stack);
    } 
    client.close();

});

router.delete('/:id', async function(req, res, next) {
  
  const token = req.header('Authorization');
  const client = new MongoClient(url);
  
  
    try{
    var decode = jwt.verify(token,JwtCle);
    }catch(err){
      console.log(err);
    }
    
    try {
      const noteId = req.params.id.split('id=')[1];
      
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection('notes');
      const result = await col.findOne({_id:ObjectId(noteId)});
      console.log(result);
      if(result.userId != decode.userId){
        res.status(403).send({error: "Accès non autorisé à cette note", note: {}})
      }
      if(!await col.deleteOne({_id:ObjectId(noteId)})){
        res.status(404).send({error: "Cet identifiant est inconnu", note: {}})
      }else{
        res.status(200).send({error: null});
      }
    }catch (err) {
      console.log(err.stack);
    }
    client.close();
});

router.patch('/:id', async function(req, res, next) {
  
  const noteId = req.params.id.split('id=')[1]; //Récupération de l'id de la note obtenue lors de la requête
  var currentTime = getDateDay();
  const newNote = req.body.content;

  const token = req.header('Authorization');
  const client = new MongoClient(url);
  
  try{
    var decode = jwt.verify(token,JwtCle);
  }catch(err){
    console.log(err);
  }

    try {
      
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection('notes');
      const result = await col.findOne({_id:ObjectId(noteId)});
      if(result.userId != decode.userId){
        res.status(403).send({error: "Accès non autorisé à cette note", note: {}})
      }
      if(!await col.findOne({_id:ObjectId(noteId)})){
        res.status(404).send({error: "Cet identifiant est inconnu", note: {}})
      }else{
        await db.collection('notes').update({ _id: ObjectId(noteId) },
          {
            $set: {
              content: newNote,
              lastUpdatedAt: getDateDay()
            }
        });
        const updatedNote = await db.collection('notes').find({ _id: ObjectId(noteId) }).toArray();
        res.status(200).send({error: null, note: updatedNote});
      }
    }catch (err) {
     console.log(err.stack);
    }
    client.close();
}); 

function getDateDay(){
      var today = new Date();

      var seconds = today.getSeconds();
      var minutes = today.getMinutes();
      var hours = today.getHours();
      var day = today.getDate();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();

      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      var todayAsString = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
      return todayAsString;
}

module.exports = router;


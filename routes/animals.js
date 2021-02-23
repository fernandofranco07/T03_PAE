var express = require ('express');
var router = express.Router();

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgrespassword',
    port: 5432,
  }

const { Pool } = require('pg')
const pool = new Pool(connection)

/* GET animals*/
router.get('/', function(req, res) {
    let query = `SELECT 
                    a.id,
                    a.animalname,
                    a.breedname,
                    a.speciesname,
                    a.animalage,
                    a.basecolour,
                    u.name
                FROM Animals a INNER JOIN Users u ON u.userid = a.userId;`;
    pool.query(query, (err, response) => {
      if(err) {
          console.log(err);
        res.status(500).send( { message : err } );
      } else {
        res.status(200).send( { animals : response.rows } );
      }
    });
  });
  
/* POST animals*/
router.post('/', function(req, res) {
    let body = req.body;
    let userId= body.userId;
    let name = body.name;
    let breed = body.breed;
    let specie = body.specie;
    let age = body.age;
    let color = body.color;
    /* Validation if the body contains the required field*/
    if(userId == undefined || name == undefined || breed == undefined || specie == undefined || age == undefined || color == undefined){
        res.status(400).send({message: "Please send the required attributes"});
        return;
    }
    if(name.length < 5){
        res.status(400).send({message: "Name must be at least 5 characters long."});
        return;
    }

    if(typeof(breed) != 'string'){
        res.status(400).send({message: "Breed must be a string"});
        return;
    }

    if(typeof(age) != 'number'){
        res.status(400).send({message: "Age must be a number"});
        return;
    }

    if(typeof(color) != 'string'){
        res.status(400).send({message: "Color must be a string"});
        return;
    }

    let query = "INSERT INTO Animals(animalname, breedname, speciesname, animalage, basecolour, userId) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;";
    let values = [`${name}`, `${breed}`, `${specie}`, `${age}`, `${color}`, `${userId}`] ;

    pool.query(query, values, (err, response) => {
        if(err){
            console.log(err);
            res.status(500).send({ message : err});
        }
        else{
            res.status(201).send({message : "Animal Created", animal : response.rows[0]});
        }
    })
});

/* PUT Animal*/
router.put('/:id', function(req, res){
    let id = req.params.id;
    let body = req.body;
    let name = body.name;
    let breed = body.breed;
    let specie = body.specie;
    let age = body.age
    let color = body.color;

/* Validation if the body contains the required field*/
    if(name == undefined || age == undefined){
        res.status(400).send({message: "Please send the required attributes"});
        return;
    }

    if(name.length < 5){
        res.status(400).send({message: "Name must be at least 5 characters long."});
        return;
    }

    if(breed != undefined && typeof(breed) != 'string'){
        res.status(400).send({message: "Breed must be a string"});
        return;
    }

    if(age != undefined && typeof(age) != 'number'){
        res.status(400).send({message: "Age must be an integer"});
        return;
    }

    if(color != undefined && typeof(color) != 'string'){
        res.status(400).send({message: "Color must be a string"});
        return;
    }
    let query = "UPDATE Animals SET animalname = $1, animalage = $2";
    let values = [`${name}`, `${age}`];
    let n = 3;

    if(breed != undefined) {
        query += `, breedname = $${n}`;
        values.push(`${breed}`);
        n++;
    }

    if(specie != undefined) {
        query += `, speciesname = $${n}`;
        values.push(`${specie}`);
        n++;
    }

    if(color != undefined) {
        query += `, basecolour = $${n}`;
        values.push(`${color}`);
        n++;
    }

    query += " RETURNING *;";

    pool.query(query, values, (err, response) => {
        if(err) {
          res.status(500).send( { message : err } );
        } else {
          res.status(201).send( { message : "Animal updated", animal : response.rows[0] } );
        }
      });
});

router.delete('/:id', function(req, res) {
    let id = req.params.id;


    let query = "DELETE FROM Animals WHERE id = $1 RETURNING *;";
    let values = [`${id}`];
    pool.query(query, values, (err, response) => {
        if(err) {
          res.status(500).send( { message : err } );
        } else {
          res.status(201).send( { message : "Animal deleted", animal : response.rows[0] } );
        }
    });
});

module.exports = router;


var express = require('express');
var router = express.Router();

/* Requerido para PSQL */

const connection = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgrespassword',
  port: 5432,
}

const { Pool } = require('pg')
const pool = new Pool(connection)

/* GET users listing. */
router.get('/', function(req, res) {
  pool.query("SELECT * FROM Users;", (err, response) => {
    if(err) {
      res.status(500).send( { message : err } );
    } else {
      res.status(200).send( { users : response.rows } );
    }
  });
});

/* POST user */
router.post('/', function(req, res) {
  let body = req.body;
  let name = body.name;
  let age = body.age;
  
  /* Validating if body contains required fields */
  if( name == undefined || age == undefined ) {
    res.status(400).send( { message : "Please send the required atttributes." } );
    return;
  }
  /* Validation of name (lenght > 5) */
  if(name.length < 5) {
    res.status(400).send( { message : "Name must be at least 5 characters long." } );
    return;
  }
  /* Validation of age (age > 0) */
  if(age <= 0) {
    res.status(400).send( { message : "Age must be greater than 0." } );
    return;
  }

  let query = "INSERT INTO Users(name, age) VALUES($1, $2) RETURNING *;";
  let values = [`${name}`, `${age}`];

  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { message : err } );
    } else {
      res.status(201).send( { message : "User created", user : response.rows[0] } );
    }
  });
});


/* PUT user */
router.put('/:id', function(req,res){
  let id = req.params.id;
  let body = req.body;
  let name = body.name;
  let age = body.age;
  
  /* Validating if body contains required fields */
  if( name == undefined || age == undefined ) {
    res.status(400).send( { message : "Please send the required atttributes." } );
    return;
  }
  /* Validation of name (lenght > 5) */
  if(name.length < 5) {
    res.status(400).send( { message : "Name must be at least 5 characters long." } );
    return;
  }
  /* Validation of age (age > 0) */
  if(age <= 0) {
    res.status(400).send( { message : "Age must be greater than 0." } );
    return;
  }

  let query = "UPDATE Users SET name = $1, age = $2 WHERE userid = $3 RETURNING *;";
  let values = [`${name}`, `${age}`,`${id}`];

  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { message : err } );
    } else {
      res.status(201).send( { message : "User updated", user : response.rows[0] } );
    }
  });

});

/* DELETE user */
router.delete('/:id', function(req, res) {
  let id = req.params.id;

  let query = "DELETE FROM Users WHERE userid = $1 RETURNING *;";
  let values = [`${id}`];

  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { message : err } );
    } else {
      res.status(201).send( { message : "User deleted", user : response.rows[0] } );
    }
  });
});

module.exports = router;

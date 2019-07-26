const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host : 'localhost',
        user : 'postgres',
        password : '23458907',
        database : 'facerec'
    }
});

db.select('*').from('users').then(data => {
    //console.log(data);
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Get request to see if everything is working

app.get('/', (req, res)=> {
    res.send(database.users);
});

//User sign in post request

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if(isValid) {
             return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => {
                res.json(user[0])
              })
              .catch(err => res.status(400).json('unable to get user'))
          } else {
            res.status(400).json('wrong credentials')
          }
        })
        .catch(err => res.status(400).json('wrong credentials'))
});

//User registration post

app.post('/register', (req, res) => {
    const { email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()    
                })
                .then(user => {
                    res.json(user[0]);
                })    
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json("unable to register"))
});

//Get user profile id

app.get('/profile/:id', (req, res) =>  {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user=> {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
        
    })
    .catch(err => res.status(400).json('error getting user'))
})

//Put iamge entries on user profile

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
});

//Port which the server will listen

app.listen(process.env.PORT, () => {
    console.log(`app is running on port 3030 ${process.env}`);
   });
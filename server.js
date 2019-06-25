const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Database object

const database = {
    users : [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'password',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Jane',
            email: 'jane@gmail.com',
            password: '123456',
            entries: 0,
            joined: new Date()
        }
    ]
}

//Get request to see if everything is working

app.get('/', (req, res)=> {
    res.send(database.users);
});

//User sign in post request

app.post('/signin', (req, res) => {
    if( req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {

        res.json('signing in');

    }else {
        res.status(400).json('error loging in')
    }    
});

//User registration post

app.post('/register', (req, res) => {
    const { email, name, password} = req.body;

    bcrypt.hash(password, null, null, function(err, hash){
        console.log(hash);
    })

    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length -1]);
});

//Get user profile id

app.get('/profile/:id', (req, res) =>  {
    const {id} = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        } 
    })

    if (!found) {
        res.status(400).json('not found');
    }
})

//Put iamge entries on user profile

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })

    if (!found) {
        res.status(400).json('not found');
    }
});

//Port which the server will listen

app.listen(3030, () => {
 console.log('app is running on port 3030');
});
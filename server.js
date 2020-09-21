const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// middleware
app.use(express.json());


const post = [
    {
        username : 'michael',
        title : 'post 1'
    },
    {
        username : 'ong',
        title : 'post 2'
    }
]

app.get('/post',authToken, (req,res) => {
    console.log(post)
    res.json(post.filter(post => post.username == req.user.name))
})

function authToken(req,res,next){
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]   //bearer TOKEN
    console.log(token)
    if(token == null){
        res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err,user) => {
        
        if(err){
            return res.sendStatus(403)
        }
        req.user = user;
        next();
    });

}


app.listen(PORT, () => {
    console.log(`Listening to: ${PORT}`)
});


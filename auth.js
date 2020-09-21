const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 4000;

require('dotenv').config();

// middleware
app.use(express.json());


let refreshTokens = []

app.post('/token', (req,res) => {
    const refreshToken = req.body.token;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err,user) => {
        if(err) return res.sendStatus(403)

        const accessToken = genAccessToken({ name: user.name})
        res.json(accessToken);
    })
})

app.post('/login', (req,res) => {
    const username = req.body.username;
    
    const user = { name : username};
    const accessToken = genAccessToken(user);
    const refToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY);
    refreshTokens.push(refToken);
    console.log(accessToken.substring(accessToken.length-7) )
    res.json({ accessToken:accessToken, refreshToken : refToken});
})


function genAccessToken(user){
    return jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: "30s"});
    
}

app.listen(PORT, () => {
    console.log(`Listening to: ${PORT}`)
});


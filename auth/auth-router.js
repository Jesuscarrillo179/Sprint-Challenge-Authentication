const bycryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = require('express').Router();

const Users = require('./auth-model')
const { isValid } = require('./auth-validation')
const configVars = require('../config/vars')

router.post('/register', (req, res) => {
  const credentials = req.body

  if (isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8
    const hash = bycryptjs.hashSync(credentials.password, rounds)

    credentials.password = hash

    Users.add(credentials)
    .then(([id]) => {
      Users.findById(id).then(({id , username}) => {
        res.status(201).json({ data:{id, username}})
      })
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    })

  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",  
  })
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if(isValid(req.body)){
    Users.findBy({ username:username })
    .then(([user]) => {
      if (user && bycryptjs.compareSync(password, user.password)){
          const token = createToken(user)
          res.status(200).json({ message: "welcome to the api!", token})
      } else {
        res.status(401).json({ message: "username or password does not match"})
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    })
  } else {
    res.status(400).json({
      message: "please provide a valid username and password",
    })
  }
});

function createToken(user){
  const payload = {
    sub:user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, configVars.jwtSecret, options)
}

module.exports = router;

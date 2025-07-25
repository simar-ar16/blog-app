const express=require("express");
const User=require('../models/user')
const router=express.Router();
const validator = require('validator');

router.get('/signin', (req,res) => {
    return res.render("signin");
});

router.get('/signup', (req,res) => {
    return res.render("signup");
});


router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).render('signup', {
      error: 'All fields are required',
      values: { fullName, email }
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).render('signup', {
      error: 'Invalid email address',
      values: { fullName, email }
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup', {
        error: 'Email already in use',
        values: { fullName, email }
      });
    }

    await User.create({ fullName, email, password });

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).render('signup', {
      error: 'Something went wrong. Please try again.',
      values: { fullName, email }
    });
  }
});


router.post('/signin', async (req,res)=> {
    const {email, password} = req.body;
    try {
    const token= await User.matchPasswordAndGenerateToken(email,password);
    return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
})

router.get('/logout', (req,res) => {
    res.clearCookie('token').redirect('/')
})

module.exports=router;
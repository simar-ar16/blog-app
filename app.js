require('dotenv').config();
const fs = require('fs');
const express=require('express');
const path=require('path');
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');

const Blog=require('./models/blog');

const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');


const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const app=express();
const PORT= process.env.PORT || 8000;


app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./User');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const session = require('express-session');
// Create express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: "your-secret-key", // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // Session duration (1 hour in milliseconds)
  })
);


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/question", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Sign-up route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, category } = req.body;
    
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password
    
    const user = new User({ username, email, password: hashedPassword, phoneNumber, category });
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Sign-in route
// Sign-in route
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // Check if password is valid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Store email in session
    req.session.email = email;
    
    // If user is found and password is correct, return user data
    res.status(200).json({ message: 'Sign-in successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});




app.get('/Profile', async (req, res) => {
  const { email } = req.query; // Assuming you're sending email as a query parameter

  try {
    const collections = await User.find({ email });
    res.json(collections);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

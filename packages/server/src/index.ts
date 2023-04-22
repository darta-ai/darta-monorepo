import express from 'express';

const app = express();

// Routes

// Routes for User
    // Get user by id => return user object


app.get('/', async (req, res) => {
  res.json({ hello: 'world' });
}); 

// Start the server
const PORT = process.env.PORT || 1160;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

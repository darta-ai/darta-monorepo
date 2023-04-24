import express from 'express';
import './arango';

const app = express();

// Routes

// Routes for User
// Get user by id => return user object
// get the data that they are going to view for Darta that day
// get the data that is their saved work
// get the data that is their inquired work

app.get('/', async (req, res) => {
  res.send('Welcome to Darta!');
})

app.get('/user', async (req, res) => {
  res.json({
    profilePicture:
      'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
    userName: 'user name 10000',
    legalName: 'firstName lastName',
    email: 'email@gmail.com',
    phone: '(123) 123-4567',
  });
});

app.post('/user', async (req, res) => {
  res.json({
    profilePicture: 'nothingtoseehere.jpeg',
  })
})

// Routes for interactions
// create edge between user and artwork

// Start the server
const PORT = process.env.PORT || 1160;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

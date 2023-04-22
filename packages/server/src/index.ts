import express from 'express';
// const express = require('express');

const app = express();

// Routes
app.get('/', async (req, res) => {
  res.json({hello: 'world'});
}); 

// Start the server
const PORT = process.env.PORT || 1160;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

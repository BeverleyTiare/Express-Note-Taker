// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

//Express Configuration
const app = express();


const filedata = fs.readFileSync('./db/db.json', 'utf8');
const notes = JSON.parse(filedata);


// express app to handle data parsing
app.use(express.urlencoded({extended:true}) );
app.use(express.json() );

 //Static Files
app.use(express.static('public'));

//
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes', (req, res) => {

  if (req.body.title && req.body.text) {

    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    notes.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(notes));

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./Develop/db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);

// Get Note
app.get('/api/notes', (req, res) => {
  fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.send(data);
    }});
});

//Add Note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
      id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    };

    fs.readFile('/Develop/db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNotes);

        fs.writeFile(
          './Develop/db/db.json',
          JSON.stringify(parsedNotes, null, 3),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNotes,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const newNotes = parsedNotes.filter((key) => key.id != req.params.id);

      res.send(JSON.stringify(newNotes, null, 3));
      
      fs.writeFile(
        './Develop/db/db.json',
        JSON.stringify(newNotes, null, 3),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

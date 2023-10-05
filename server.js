const express = require('express');
const server = express();
const fs = require('fs');
const pug = require('pug');
const path = require('path');
server.set('view engine', 'pug');
const bodyParser = require('body-parser');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


const myjsonfile = require('./book.json');
const { json } = require('body-parser');
const jsonData = JSON.parse(fs.readFileSync('book.json'));

const fugPath = path.join(__dirname, '/views/index.pug');


const filePath = 'indexFileCreator';
const fileContent = fs.readFileSync(filePath, 'utf-8');


server.listen(8000, () =>
  console.log('================================'),
  console.log('listening on port 8000!'),
  console.log('================================'),
);

server.get ('/books', (req, res) => {

    if (!fs.existsSync('book.json')) fs.writeFileSync(myjsonfile, '[]')

    if (!fs.existsSync(fugPath)) fs.writeFileSync('views/index.pug', fileContent)

    const mainjson = jsonData;
    return res.render('index',{mainjson})
})

server.get ('/books/:id', (req, res) => {

    const {id} = req.params

    if (!fs.existsSync('book.json')) fs.writeFileSync(myjsonfile, '[]')

    if (!fs.existsSync(fugPath)) fs.writeFileSync('views/index.pug', fileContent)

    for (let ids in jsonData){
        if (jsonData[ids].id == id){
            const mainjson = [{"id": jsonData[ids].id, "name": jsonData[ids].name}]
            return res.render('index',{mainjson})
        }
    }

    return res.status(400).send("Book doesn't exist, if you have it be the first to add it!")
})

server.post ('/books', (req, res) => {

    const {id, name} = req.body
    if (!name) return res.status(400).send("Please enter a name/ valid name")

    if (!fs.existsSync('book.json')) fs.writeFileSync(myjsonfile, '[]')

    if (!fs.existsSync(fugPath)) fs.writeFileSync('views/index.pug', fileContent)

    const existingBook = jsonData.find(name => name.id === id);

    if (existingBook){
        jsonData[id-1].name= name
        fs.writeFileSync('book.json', JSON.stringify(jsonData, null, 2));
        return res.status(200).send('book updated successfully');
    }

    const newBook = { "id":id, "name":name }
    jsonData.push(newBook)

    fs.writeFileSync('book.json', JSON.stringify(jsonData, null, 2));
    res.status(200).send('New book added successfully');

})

server.use((req, res) => {
    res.status(404).send('The Endpoint is invalid');
  });
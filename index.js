const express = require('express')
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var fs = require('fs'); 
var csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var path = require("path");
const app = express();
const port = 8000;


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./landingPage')));
app.use(helmet());
app.get('/', (req, res) => {
 
    res.sendFile(path.join(__dirname,'./landingPage/index.html'));
});



app.post('/',(req,res) => {
  const data=[];
  data.push({'Nom_prenom;email;tel':`${req.body.Nom};${req.body.Email};${req.body.tel}`})
   fs.createReadStream(path.join(__dirname,'./landingPage/file/file.csv'))
  .pipe(csv())
  .on('data', (row) => {
  data.push(row);
  })
  .on('end', () => {
    const csvWriter = createCsvWriter({
      path: (path.join(__dirname,'./landingPage/file/file.csv')),
      header: [
        {id: 'Nom_prenom;email;tel', title: 'Nom_prenom;email;tel'},
      ]
    });
  
    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));
    res.sendFile(path.join(__dirname,'./landingPage/merci.html'));
  
  
  })
   
  });

  app.get('/download', function(req, res){
    const file =path.join(__dirname,'./landingPage/file/file.csv');
    res.download(file); // Set disposition and send it.
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
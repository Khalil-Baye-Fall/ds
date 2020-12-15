
import express from 'express';
var request = require('request');
var cors = require('cors')

const app = express()
const port = 3001
const backendUrl = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/';
var pairingToken = "";
var deviceId: string;
var mockNumber = 0;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var mockedLocation = [
  { longitude: 17.1, latitude: 51.1 },
  { longitude: 17.2, latitude: 51.2 },
  { longitude: 17.3, latitude: 51.3 },
  { longitude: 17.4, latitude: 51.4 },
  { longitude: 17.5, latitude: 51.5 },
];


app.get('/mockMobile', (req, res) => {
  if (!deviceId) {
    if (!pairingToken) {
      request(backendUrl + 'pairing', function (error: any, response: any, body: any) {
        pairingToken = body;
        res.send("Wprowadź kod do aplikacji rodzica: " + body);
      });
    } else {
      request(backendUrl + 'device/pairing/' + pairingToken, function (error: any, response: any, body: any) {
        console.log(body)
        if (response.statusCode > 399) {
          res.send("Jeszcze nie sparowane urządzenie. Podaj kod w aplikacji rodzica: " + pairingToken);
        } else {
          res.send("Gratulacje! Parowanie zakońcozne sukcesem!");
          deviceId = body;
        }
      });
    }
  } else {
    console.log(deviceId);
    console.log(JSON.stringify(mockedLocation[mockNumber]))
    request(backendUrl + 'device/' + deviceId + '/position',
      { method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockedLocation[mockNumber])},
        function(error: any, response: any, body: any) {
          console.log(response.statusCode);
          res.send("Wysłano lokalizację po raz " + (mockNumber + 1));
          mockNumber++;
        
      });
  }
});



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
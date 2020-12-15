
import express from 'express';
import mongodb from 'mongodb';
var cors = require('cors')
import * as isAuth from './isAuth';
import * as parent from './parent';
import * as device from './devices';
import { addDeviceReq, addPlaceReq, addPositionReq, addPositionRuleReq, ExpressRequest, parentLoginReq, parentRegistrationReq } from './interfaces';
import { addPlace, addPositionRule, getPlaces, getPositionRulesForDevice, removePlace, removePositionRule, savePosition, updatePlace } from './positions';

const app = express()
const port = 3000
const connectionString = 'mongodb://localhost:27017/childcare'

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


async function db(): Promise<mongodb.Db> {
  const db = await mongodb.MongoClient.connect(connectionString);
  return db.db();
}

export default (req: any, res: any, next: any) => {
  const decodedTokenData = req.tokenData;
  parent.parentLogin(db(), req, res);
 };

app.post('/parent/register', (req: parentRegistrationReq, res) => parent.parentRegistration(db(), req, res));
app.post('/parent/login', (req: parentLoginReq, res) => parent.parentLogin(db(), req, res));

app.post('/devices', isAuth.default, (req: addDeviceReq, res) => device.addDevice(db(), req, res));
app.get('/devices/:id', isAuth.default, (req: ExpressRequest, res) => device.getOneDevice(db(), req, res));
app.get('/devices', isAuth.default, (req: ExpressRequest, res) => device.getDevices(db(), req, res));
app.delete('/devices/:id', isAuth.default, (req: ExpressRequest, res) => device.removeDevice(db(), req, res));
app.get('/pairing', (req, res) => device.generateConnectionToken(db(), res));
app.get('/device/pairing/:token', (req: ExpressRequest, res) => device.getDeviceIdAfterPairing(db(), req, res));

app.post('/place', isAuth.default, (req: addPlaceReq, res) => addPlace(db(), req, res));
app.put('/place/:id', isAuth.default, (req: addPlaceReq, res) => updatePlace(db(), req, res));
app.get('/places', isAuth.default, (req: ExpressRequest, res) => getPlaces(db(), req, res));
app.delete('/place/:id', isAuth.default, (req: ExpressRequest, res) => removePlace(db(), req, res));

app.post('/device/:deviceid/rule', isAuth.default, (req: addPositionRuleReq, res) => addPositionRule(db(), req, res));
app.delete('/device/:deviceid/rule/:ruleId', isAuth.default, (req: ExpressRequest, res) => removePositionRule(db(), req, res));
app.get('/device/:deviceid/rules', isAuth.default, (req: ExpressRequest, res) => getPositionRulesForDevice(db(), req, res));
app.post('/device/:deviceid/position', (req: addPositionReq, res) => savePosition(db(), req, res));


app.get('/', (req,res) => res.send('CHILDCARE - serving best care for your childs [backend]'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

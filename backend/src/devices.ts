import express from 'express';
import { Db, ObjectID } from 'mongodb';
import { addDeviceReq, DeviceDb, ExpressRequest } from './interfaces';

export async function getDevices(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    const mongodb = await db;
    const devices = await mongodb.collection("devices").find<DeviceDb>({ parentId: new ObjectID(req.token.data._id) }, { projection: { _id: 1, name: 1 } }).toArray();
    res.send(devices);
}

export async function getOneDevice(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    if (req.params['id'].length !== 24) {
        res.sendStatus(404); return;
    }

    const mongodb = await db;
    const device: DeviceDb = await mongodb.collection("devices")
        .findOne<DeviceDb>({ parentId: new ObjectID(req.token.data._id), _id: new ObjectID(req.params['id']) },
            { projection: { parentId: 0 } });
    res.send(device);
}

export async function addDevice(db: Promise<Db>, req: addDeviceReq, res: express.Response) {
    const mongodb = await db;
    const connectionToken = req.body.connectionToken;
    const mobileDevice = await mongodb.collection("pairing").findOne({ connectionToken, paired: false });
    if (!mobileDevice || !connectionToken) { res.sendStatus(404); return; }
    const device: DeviceDb = {
        parentId: new ObjectID(req.token.data._id),
        name: req.body.name,
        positionRules: [],
        positionDevice: []
    }
    await mongodb.collection("devices").insertOne(device).then(() => {
        mongodb.collection("pairing").updateOne({ connectionToken }, { $set: { paired: true, deviceID: device._id.toHexString() } });
        res.sendStatus(201);
    })
        .catch(err => res.send(err).status(400));
}

export async function removeDevice(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    if (req.params['id'].length !== 24) {
        res.sendStatus(404); return;
    }
    const mongodb = await db;
    await mongodb.collection("devices")
        .deleteOne({ _id: new ObjectID(req.params['id']), parentId: new ObjectID(req.token.data._id) })
        .then(() => res.sendStatus(200));
}

export async function generateConnectionToken(db: Promise<Db>, res: express.Response) {
    const connectionToken = new Date().getTime()
    const mongodb = await db;
    await mongodb.collection("pairing")
        .insertOne({ connectionToken: "" + connectionToken, paired: false })
        .then(() => res.send("" + connectionToken));
}

export async function getDeviceIdAfterPairing(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    const mongodb = await db;
    await mongodb.collection("pairing").findOne({ connectionToken: req.params['token'], paired: true }).then(pairingDb => {
        if(pairingDb) res.send(pairingDb.deviceID);
        else res.sendStatus(404);
    })
}

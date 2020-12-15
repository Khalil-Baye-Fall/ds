import { Db, ObjectID } from "mongodb";
import express from 'express';
import { addPlaceReq, addPositionReq, addPositionRuleReq, DeviceDb, DevicePosition, ExpressRequest, ParentDb, Place, PositionRule } from "./interfaces";
import { sendEmailNotification } from "./notifications";

export async function addPlace(db: Promise<Db>, req: addPlaceReq, res: express.Response) {
    const mongodb = await db;
    const place = req.body;
    await mongodb.collection('places').insertOne({ ...place, parentId: req.token.data._id }).then(() => res.sendStatus(201));
}

export async function updatePlace(db: Promise<Db>, req: addPlaceReq, res: express.Response) {
    if (req.params['id'].length !== 24) {
        res.sendStatus(404); return;
    }
    const mongodb = await db;
    const place = req.body;
    await mongodb.collection('places').updateOne({ _id: new ObjectID(req.params['id']) }, { $set: place }).then(() => res.sendStatus(202));
}

export async function getPlaces(db: Promise<Db>, req: addPlaceReq, res: express.Response) {
    const mongodb = await db;
    const placesDb: Place[] = await mongodb.collection('places').find({ parentId: req.token.data._id })
        .project({ _id: 1, name: 1, latitude: 1, longitude: 1 }).toArray();
    const places = placesDb.map(p => ({
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        id: p._id
    }));
    res.send(places);
}

export async function removePlace(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    const mongodb = await db;
    if (req.params['id'].length !== 24) {
        res.sendStatus(404); return;
    }

    await mongodb.collection('places').deleteOne({ _id: new ObjectID(req.params['id']) })
        .then(() => res.sendStatus(200));
}

export async function addPositionRule(db: Promise<Db>, req: addPositionRuleReq, res: express.Response) {
    if (req.params['deviceid'].length !== 24) {
        res.sendStatus(404); return;
    }

    const mongodb = await db;
    const places: Place[] = await mongodb.collection('places').find({ parentId: req.token.data._id }).toArray();
    const positionRule: PositionRule = {
        from_datetime: req.body.from_datetime,
        to_datetime: req.body.to_datetime,
        place: places.find(p => p._id.toHexString() == req.body.placeId),
        _id: new ObjectID()
    }

    let isBilocation = false;
    const device: DeviceDb = await mongodb.collection('devices').findOne<DeviceDb>({_id: new ObjectID(req.params['deviceid']) }, { projection: {positionRules: 1}});
    if (!device){
        return res.sendStatus(400);
    }
    device.positionRules.forEach(r => {
        if (r.from_datetime < positionRule.from_datetime && r.to_datetime > positionRule.from_datetime)
        isBilocation = true; // wewnarz
        if(r.from_datetime > positionRule.from_datetime && positionRule.from_datetime > r.from_datetime)
        isBilocation = true; //początek
        if(r.to_datetime < positionRule.to_datetime && r.to_datetime > positionRule.from_datetime)
        isBilocation = true;
    })
    if(isBilocation){
        return res.sendStatus(400);
    }


    await mongodb.collection('devices').updateOne(
        { _id: new ObjectID(req.params['deviceid']) }, { $push: { positionRules: positionRule } })
        .then(() => res.sendStatus(200))
        .catch(err => res.send(err).status(400));
}

export async function getPositionRulesForDevice(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    const mongodb = await db;
    const device = await mongodb.collection('devices').findOne<DeviceDb>({ _id: new ObjectID(req.params['deviceid']) });
    if (!device) {
        return res.sendStatus(404);
    } else {
        res.send(device.positionRules);
    }
}

export async function removePositionRule(db: Promise<Db>, req: ExpressRequest, res: express.Response) {
    const mongodb = await db;
    console.log(req.params)
    await mongodb.collection('devices')
        .updateMany({ _id: new ObjectID(req.params['deviceid']) }, { $pull: { positionRules: { _id: new ObjectID(req.params['ruleId']) } } })
        .then(() => res.sendStatus(200)).catch(err => { console.log(err); res.sendStatus(500) });
}

export async function savePosition(db: Promise<Db>, req: addPositionReq, res: express.Response) {
    if (req.params['deviceid'].length !== 24) {
        res.sendStatus(404); return;
    }
    const mongodb = await db;
    const device: DeviceDb = await mongodb.collection<DeviceDb>('devices').findOne({ _id: new ObjectID(req.params['deviceid']) });
    if (!device) return res.sendStatus(404);
    const isWrongPosition: boolean = calculateIsWrongPosition(device.positionRules, req.body.longitude, req.body.latitude);
    if(isWrongPosition){
        const parent: ParentDb = await mongodb.collection<DeviceDb>('parent').findOne({ _id: device.parentId });
        sendEmailNotification(parent.email, device.name);
    }
    const currentPosition: DevicePosition = {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        datetime: new Date().toISOString(),
        isWrongPosition
    }
    await mongodb.collection<DeviceDb>('devices').updateOne({ _id: new ObjectID(req.params['deviceid']) },
        { $push: { positionDevice: currentPosition } }).then(() => res.sendStatus(201));
}


function calculateIsWrongPosition(rules: PositionRule[], longitude: number, latitude: number): boolean {
    const currentDate = new Date().toISOString();
    const rule: PositionRule = rules.find(r => r.from_datetime < currentDate && r.to_datetime > currentDate);
    if (rule) {
        const distance = Math.sqrt(Math.pow(rule.place.latitude - latitude, 2) + Math.pow(rule.place.longitude - longitude, 2))
        return distance > 0.001 ? true : false; // 0.001 = 69m
    } else return false;
}
import express from 'express';
import { Db } from 'mongodb';
import * as jwt from 'jsonwebtoken'
import {secretJWT} from '../secrets'

import * as argon2 from 'argon2';
import { ParentDb, parentLoginReq, parentRegistrationReq } from './interfaces';

export async function parentRegistration(db: Promise<Db>, req: parentRegistrationReq, res: express.Response) {
    const mongodb = await db;
    const user = await mongodb.collection("parent").findOne({ login: req.body['login'] })
    if (user) {
        res.sendStatus(400)
    } else {
        const passwordHashed = await argon2.hash(req.body.password);
        await mongodb.collection('parent').insertOne({
            name: req.body.name,
            surname: req.body.surname,
            login: req.body.login,
            password: passwordHashed,
            email: req.body.email
        }).then(() => res.sendStatus(200))
    };
}

export async function parentLogin(db: Promise<Db>, req: parentLoginReq, res: express.Response) {
    const mongodb = await db;
    const user = await mongodb.collection("parent").findOne<ParentDb>({ login: req.body.login });
    if(!user) {
        res.sendStatus(403);
    } else {
        const correctPassword = await argon2.verify(user.password, req.body.password);
        if (!correctPassword) {
            res.sendStatus(403);
        } else {
            res.send({
                user: {
                  name: user.name,
                  surname: user.surname
                },
                token: generateJWT(user)
              });
        }
    }
}

export async function getParentId(db: Promise<Db>, login:string): Promise<string> {
    const mongodb = await db;
    const user = await mongodb.collection("parent").findOne<ParentDb>({ login });
    return user._id.toString();
}

function generateJWT(user: ParentDb) {

    const data =  {
      _id: user._id,
      name: user.name,
      login: user.login
    };
    const signature = secretJWT;
    const expiration = '6h';

    return jwt.sign({ data, }, signature, { expiresIn: expiration });
  }
import { ObjectID } from "mongodb";
import express from 'express';


export interface ParentDb {
        _id: ObjectID;
        name: string;
        surname: string;
        login: string;
        password: string;
        email: string;
        childrenIdDevices: string[];
    } 

export interface DeviceDb {
    _id?: ObjectID;
    parentId: ObjectID;
    name: string;
    positionRules: PositionRule[];
    positionDevice: DevicePosition[];
}

export interface PositionRule {
    _id?: ObjectID;
    place: Place;
    from_datetime: string;
    to_datetime: string;
}

export interface Place {
    _id: ObjectID;
    idParent: string;
    name: string;
    latitude: number;
    longitude: number;
}

export interface DevicePosition {
    datetime: string;
    latitude: number;
    longitude: number;
    isWrongPosition: boolean;
}


export interface ExpressRequest extends express.Request{
    token: {
        data:{
            _id: string,
            login: string,
            name: string
        }
    }
}

export interface parentRegistrationReq extends  express.Request {
    body: {
        name: string,
        surname: string,
        login: string,
        password: string,
        email: string
    }
}

export interface parentLoginReq extends express.Request{
    body: {
        login: string,
        password: string
    }
}

export interface addDeviceReq extends ExpressRequest{
    body: {
        name: string,
        connectionToken: string
    }
}

export interface addPlaceReq extends ExpressRequest{
    body: {
        name: string;
        latitude: number;
        longitude: number;
    }
}

export interface addPositionRuleReq extends ExpressRequest {
    body: {
        placeId: string;
        from_datetime: string;
        to_datetime: string;
    }
}

export interface addPositionReq extends express.Request {
    body: {
        longitude: number;
        latitude: number;
    }
}

# REST communication

## Parent account
### Registration (done)
> POST /parent/register

Input data:
```
{
    name: string;
    surname: string;
    login: string;
    password: string;
    email: string;
}
```
Responses:
> 200

> 400 (user with this login already exists)


### Login (done)
>POST /parent/login

Input data:
```
{
    login: string;
    password: string;
}
```
Responses:
> 200
```
{
    id: string;
}
```
> 403 (incorrect data)

---
## Children device
### All devices (done)
> GET /devices

Responses:
> 200
```
[{
    id: string;
    name: string;
}]
```

### Get data about one device (done but remaining something from deviceapp)
>GET /devices/:id

Input data:
```
id - device id
```
Responses:
> 200
```
{
    id: string;
    name: string;
    positionRules: [ {
        place: {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
        }
        from_datetime: string;
        to_datetime: string;
}];
    positionDevice: [{
        datetime: Date;
        latitude: number;
        longitude: number;
        isWrongPosition: boolean;
    }];
}
```

### Add device (done)
>POST /devices

Input data:
```
{
    name: string;
    /** Token used when you pairing device with this account */
    connectionToken: string;
}
```
Responses:
> 200

> 404 (not found device by token)


### Remove device (done)
>DELETE /devices/:id

Input data:
```
id - device id
```
Responses:
> 200

---
## Pairing devices
### mobile
>GET /pairing

Responses:
> 200

```
{
    connectionToken: string;
}
```

### get deviceID after pairing (mobile)
>GET /device/pairing/:token

token - connectionString from server

Responses:
> 200
```
{
   deviceID: string 
}
```

---
## Position
### Add position rule 
>POST /device/:id/rule

Input data:
```
id - device id
body: {
    placeId: string;
    from_datetime: string;
    to_datetime: string;
}
```
Responses:
> 200

### Remove position rule 
>DELETE /device/:id/rule/:ruleId

Input data:
```
id - device id
ruleId - id of the rule 
```

Responses:
> 200

> 404 (rule not found wuth this data)

### Get device position rule (for mobile)
>GET /device/:id/rules

Input data:
```
id - device id
```
Responses:
> 200
```
[ {
    place: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
    }
    from_datetime: string;
    to_datetime: string;
}];
```

> 404 (device unpaired from web client)

### Save actual position
>POST /device/:id/position

Input data:
```
id - device id
body: {
    longitude: number;
    latitude: number;
}
```
Responses:
> 201

> 404 (device unpaired from web client)


---
## Places
### Add new place (done)
>POST /place

Input data:
```
{
    name: string;
    latitude: number;
    longitude: number;
}
```
Responses:
> 201


### Update place 
>PUT /place/:id
id - place id
Input data:
```
{
    name: string;
    latitude: number;
    longitude: number;
}
```
Responses:
> 202

### Get all places (done)
>GET /places

Responses:
> 200
```
[{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}]
```

### Try to remove place (done)
>DELETE /place/:id

Input data:
```
id - id place
```
Responses:
> 200

> 401 (cannot remove, probably place is already assigned)
> 404 (not found)


# Parent
```
interface Parent {
    _id: string;
    name: string;
    surname: string;
    login: string;
    password: string;
    childrenIdDevices: string[];
} 
```

# Children
## ChildrenDevices
```
interface ChildrenDevice {
    _id: string;
    parentId: string;
    name: string;
    positionRules: PositionRule[];
    positionDevice: DevicePosition[];
}
```

## Position
```
interface PositionRule {
    place: Place;
    from_datetime: string;
    to_datetime: string;
}

interface DevicePosition {
    datetime: Date;
    latitude: number;
    longitude: number;
    isWrongPosition: string;
}
```

## Defined places
```
interface Place {
    _id: string;
    idParent: string;
    name: string;
    latitude: number;
    longitude: number;
}
```

# Pairing with device
```
interface PairingDevice {
    _id: string;
    parentId?: string; //at start is undefined
    deviceId: string;
    connectionToken: string;
    date: string;
}
```

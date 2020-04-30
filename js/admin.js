const ambulancesElement = document.querySelector('#ambulances');
const policeStationsElement = document.querySelector('#police-stations');
const vehiclesElement = document.querySelector('#vehicles');
const accidentsElement = document.querySelector('#accidents');
const ambulances = firebase.database().ref().child('Ambulances');
const policeStations = firebase.database().ref().child('PoliceStations');
const vehicles = firebase.database().ref().child('Vehicles');
const accidents = firebase.database().ref().child('Accidents');

const addAmbulance = (permanentLocation,contactNumber) =>{
    let newAmbKey = ambulances.push().key;
    let newAmbulance={
        permanentLocation,
        contact:contactNumber
    }
    let update={};
    update[newAmbKey]=newAmbulance;
    ambulances.update(update);
}

const editAmbulance = (ambulanceKey, permanentLocation, contactNumber) =>{
    if(permanentLocation)
    ambulances.child(ambulanceKey+'/permanentLocation').set(permanentLocation);
    if(contactNumber)
    ambulances.child(ambulanceKey+'/contact').set(contactNumber);
}

const addPoliceStation = (location,contactNumber) =>{
    let newPSKey = policeStations.push().key;
    let newPoliceStation={
        location,
        contact:contactNumber
    }
    let update={};
    update[newPSKey]=newPoliceStation;
    policeStations.update(update);
}

const addVehicle = (ownerName,contactNumber) =>{
    let newVehicleKey = vehicles.push().key;
    let newVehicle={
        ownerName,
        contact:contactNumber
    }
    let update={};
    update[newVehicleKey]=newVehicle;
    vehicles.update(update);
}

ambulances.on('value',snap=>{
    ambulancesElement.innerHTML=JSON.stringify(snap.val(),null,3);
})

policeStations.on('value',snap=>{
    policeStationsElement.innerHTML=JSON.stringify(snap.val(),null,3);
})

vehicles.on('value',snap=>{
    vehiclesElement.innerHTML=JSON.stringify(snap.val(),null,3);
})

accidents.on('value',snap=>{
    accidentsElement.innerHTML=JSON.stringify(snap.val(),null,3);
})








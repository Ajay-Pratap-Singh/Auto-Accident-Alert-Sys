const myAmbulance= firebase.database().ref().child('Ambulances/-M67ofZJG_R0LIccy2fP');
const accidents = firebase.database().ref().child('Accidents');
const accidentsElement = document.querySelector('#accidents');
const accidentsTable = document.querySelector('#accidents table');

const tableInit=' <th><tr><td>Vehicle ID</td><td>Location</td></tr></th>'

accidentsTable.innerHTML=tableInit;

const editAmbulance = (permanentLocation, contactNumber) =>{
    if(permanentLocation)
    myAmbulance.child('/permanentLocation').set(permanentLocation);
    if(contactNumber)
    myAmbulance.child('/contact').set(contactNumber);
}

accidents.on('child_added',snap=>{
    let  vehicleID = document.createElement('td');
    let  vehicleIDField = document.createElement('input');
    vehicleIDField.value=snap.val().vehicleID;
    vehicleID.appendChild(vehicleIDField);
    let location = document.createElement('td');
    let  locationField = document.createElement('input');
    locationField.value='lat: '+snap.val().location.lat+' long: '+snap.val().location.long;
    location.appendChild(locationField);
    // location.innerHTML = 'lat: '+snap.val().location.lat+' long: '+snap.val().location.long;
    let tableRow=document.createElement('tr');
    tableRow.appendChild(vehicleID);
    tableRow.appendChild(location);
    tableRow.id=snap.key;
    accidentsTable.appendChild(tableRow);
    console.log(snap.val(), snap.key);
})
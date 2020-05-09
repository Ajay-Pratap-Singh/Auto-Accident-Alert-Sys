const ambulancesElement = document.querySelector('#ambulances');
const ambulancesTable = document.querySelector('#ambulances table');
const policeStationsElement = document.querySelector('#police-stations');
const policeStationsTable = document.querySelector('#police-stations table');
const vehiclesElement = document.querySelector('#vehicles');
const vehiclesTable = document.querySelector('#vehicles table');
const accidentsElement = document.querySelector('#accidents');
const accidentsTable = document.querySelector('#accidents table');
const ambulances = firebase.database().ref().child('Ambulances');
const policeStations = firebase.database().ref().child('PoliceStations');
const vehicles = firebase.database().ref().child('Vehicles');
const accidents = firebase.database().ref().child('Accidents');

const editSVG='<svg title="edit" class="edit bi bi-pencil" width="1.6em" height="1.6em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z" clip-rule="evenodd"/></svg>';
const deleteSVG='<svg title="delete" class=" delete bi bi-trash" width="1.6em" height="1.6em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clip-rule="evenodd"/></svg>';

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

document.querySelector("#navigation").addEventListener('click',e=>{
    if(e.target.tagName=="SPAN"){
        document.querySelector('#active-sec').id=document.querySelector('#active').getAttribute('displaySection');
        document.querySelector('#active').removeAttribute('id');
        e.target.id='active';
        document.querySelector('#'+e.target.getAttribute('displaySection')).id='active-sec';
    }
    else if(e.target.tagName=="svg"){
        document.querySelector('#active-sec').id=document.querySelector('#active').getAttribute('displaySection');
        document.querySelector('#active').removeAttribute('id');
        e.target.parentElement.id='active';
        document.querySelector('#'+e.target.parentElement.getAttribute('displaySection')).id='active-sec';
    }else if(e.target.tagName=="path"){
        document.querySelector('#active-sec').id=document.querySelector('#active').getAttribute('displaySection');
        document.querySelector('#active').removeAttribute('id');
        e.target.parentElement.parentElement.id='active';
        document.querySelector('#'+e.target.parentElement.parentElement.getAttribute('displaySection')).id='active-sec';
    }
})

window.addEventListener("click",e=>{
    if(e.target.classList.contains('delete')){
        e.target.parentNode.parentNode.classList.add('to-be-deleted');
        e.target.parentNode.innerHTML='<span class="cancel-delete">Cancel</span>';
    }else if(e.target.parentNode.classList.contains('delete')){
        e.target.parentNode.parentNode.parentNode.classList.add('to-be-deleted');
        e.target.parentNode.parentNode.innerHTML='<span class="cancel-delete">Cancel</span>';
    }else if(e.target.classList.contains('cancel-delete')){
        e.target.parentNode.parentNode.classList.remove('to-be-deleted');
        e.target.parentNode.innerHTML=editSVG+deleteSVG;
    }
})

ambulances.on('child_added',snap=>{
    let  ambulanceID = document.createElement('td');
    ambulanceID.innerHTML=snap.key;
    let location = document.createElement('td');
    location.innerHTML='lat: '+snap.val().permanentLocation.lat+'<br>long: '+snap.val().permanentLocation.long;
    let contact = document.createElement('td');
    contact.innerHTML = snap.val().contact;
    let actionIcons = document.createElement('td');
    actionIcons.innerHTML = editSVG+deleteSVG;
    actionIcons.classList.add('butt');
    let tableRow=document.createElement('tr');
    tableRow.appendChild(ambulanceID);
    tableRow.appendChild(location);
    tableRow.appendChild(contact);
    tableRow.appendChild(actionIcons);
    tableRow.id=snap.key;
    ambulancesTable.appendChild(tableRow);
})

policeStations.on('child_added',snap=>{
    let  policeStationID = document.createElement('td');
    policeStationID.innerHTML=snap.key;
    let location = document.createElement('td');
    location.innerHTML='lat: '+snap.val().location.lat+'<br>long: '+snap.val().location.long;
    let contact = document.createElement('td');
    contact.innerHTML = snap.val().contact;
    let tableRow=document.createElement('tr');
    let actionIcons = document.createElement('td');
    actionIcons.innerHTML = editSVG+deleteSVG;
    actionIcons.classList.add('butt');
    tableRow.appendChild(policeStationID);
    tableRow.appendChild(location);
    tableRow.appendChild(contact);
    tableRow.appendChild(actionIcons);
    tableRow.id=snap.key;
    policeStationsTable.appendChild(tableRow);
})

vehicles.on('child_added',snap=>{
    // vehiclesElement.innerHTML=JSON.stringify(snap.val(),null,3);
    let  vehicleID = document.createElement('td');
    vehicleID.innerHTML=snap.key;
    let owner = document.createElement('td');
    owner.innerHTML = snap.val().ownerName;
    let contact = document.createElement('td');
    contact.innerHTML = snap.val().contact;
    let tableRow=document.createElement('tr');
    let actionIcons = document.createElement('td');
    actionIcons.innerHTML = editSVG+deleteSVG;
    actionIcons.classList.add('butt');
    tableRow.appendChild(vehicleID);
    tableRow.appendChild(owner);
    tableRow.appendChild(contact);
    tableRow.appendChild(actionIcons);
    tableRow.id=snap.key;
    vehiclesTable.appendChild(tableRow);
})

accidents.on('child_added',snap=>{
    let  accidentID = document.createElement('td');
    accidentID.innerHTML=snap.key;
    let  vehicleID = document.createElement('td');
    vehicleID.innerHTML=snap.val().vehicleID;
    let location = document.createElement('td');
    location.innerHTML='lat: '+snap.val().location.lat+'<br>long: '+snap.val().location.long;
    let tableRow=document.createElement('tr');
    let actionIcons = document.createElement('td');
    actionIcons.innerHTML = editSVG+deleteSVG;
    actionIcons.classList.add('butt');
    tableRow.appendChild(accidentID);
    tableRow.appendChild(vehicleID);
    tableRow.appendChild(location);
    tableRow.appendChild(actionIcons);
    tableRow.id=snap.key;
    accidentsTable.appendChild(tableRow);
})








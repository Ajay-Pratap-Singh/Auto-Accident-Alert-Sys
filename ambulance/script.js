const myAmbulance= firebase.database().ref().child('Ambulances/-M67ofZJG_R0LIccy2fP');
const accidents = firebase.database().ref().child('Accidents');
const accidentsElement = document.querySelector('#accidents');

const editAmbulance = (permanentLocation, contactNumber) =>{
    if(permanentLocation)
    myAmbulance.child('/permanentLocation').set(permanentLocation);
    if(contactNumber)
    myAmbulance.child('/contact').set(contactNumber);
}

accidents.on('child_added',snap=>{
    accidentsElement.innerHTML=JSON.stringify(snap.val(),null,3);
})
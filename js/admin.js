const ambulancesElement = document.querySelector('#ambulances');
const ambulancesTable = document.querySelector('#ambulances table');
const policeStationsElement = document.querySelector('#police-stations');
const policeStationsTable = document.querySelector('#police-stations table');
const vehiclesElement = document.querySelector('#vehicles');
const vehiclesTable = document.querySelector('#vehicles table');
const accidentsElement = document.querySelector('#accidents');
const accidentsTable = document.querySelector('#accidents table');
const dbRoot = firebase.database().ref();
const ambulances = dbRoot.child('Ambulances');
const policeStations = dbRoot.child('PoliceStations');
const vehicles = dbRoot.child('Vehicles');
const accidents = dbRoot.child('Accidents');
let editingRecordID;
let additionActive;

const editSVG='<svg title="edit" class="edit-row edit bi bi-pencil" width="1.6em" height="1.6em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z" clip-rule="evenodd"/></svg>';
const deleteSVG='<svg title="delete" class="delete-row delete bi bi-trash" width="1.6em" height="1.6em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clip-rule="evenodd"/></svg>';

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

const deleteEntry = (type,key) =>{
    firebase.database().ref().child(type+'/'+key).remove();
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

const editPoliceStation = (psKey, location, contactNumber) =>{
    if(location)
    policeStations.child(psKey+'/location').set(location);
    if(contactNumber)
    policeStations.child(psKey+'/contact').set(contactNumber);
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

const editVehicle = (vehicleKey, ownerName, contactNumber) =>{
    if(ownerName)
    vehicles.child(vehicleKey+'/ownerName').set(ownerName);
    if(contactNumber)
    vehicles.child(vehicleKey+'/contact').set(contactNumber);
}

function showMessage(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML=message;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
    if(e.target.classList.contains('delete-row')){
        e.target.parentNode.parentNode.classList.add('to-be-deleted');
        e.target.parentNode.innerHTML='<span class="cancel-delete">Cancel</span>';
        document.querySelector('#delete-final').style.visibility='visible';
    }
    else if(e.target.parentNode.classList.contains('delete-row')){
        e.target.parentNode.parentNode.parentNode.classList.add('to-be-deleted');
        e.target.parentNode.parentNode.innerHTML='<span class="cancel-delete">Cancel</span>';
        document.querySelector('#delete-final').style.visibility='visible';
    }
    else if(e.target.classList.contains('cancel-delete')){
        e.target.parentNode.parentNode.classList.remove('to-be-deleted');
        e.target.parentNode.innerHTML=editSVG+deleteSVG;
        if(document.querySelectorAll('.to-be-deleted').length==0)
            document.querySelector('#delete-final').style.visibility='hidden';
    }
    else if(e.target.id=="delete-final" || e.target.parentNode.id=="delete-final" || e.target.parentNode.parentNode.id=="delete-final"){
        const toBeDeleted=document.querySelectorAll('.to-be-deleted');
        toBeDeleted.forEach(element => {
            deleteEntry(element.classList[0],element.id);
            element.querySelector('.butt').innerHTML='<span style="color:white;">deleting...</span>';
        });
        document.querySelector('#delete-final').style.visibility='hidden';
    }
    else if(e.target.classList.contains('edit-row')){
        if(additionActive){
            let prevAddition=document.querySelector('.cancel-add-butt');
            let prevAddTable=prevAddition.getAttribute('add');
            prevAddition.classList.add('add-butt');
            prevAddition.innerHTML=(prevAddTable=='PoliceStations')? '+ Add New Police Stations': '+ Add New '+prevAddTable;
            prevAddition.classList.remove('cancel-add-butt')
            additionActive=null;
        }
        document.querySelectorAll('.input-error').forEach(element=>{
            element.classList.remove('input-error');
        })
        document.querySelector('#input-appear h1').innerHTML="Edit";
        const idElement=e.target.parentNode.parentNode.id;
        const values=e.target.parentNode.parentNode.querySelectorAll('td');
        if(editingRecordID || document.querySelector('#'+editingRecordID)){
            document.querySelector('#'+editingRecordID).querySelector('.butt').innerHTML=editSVG+deleteSVG;
        }
        editingRecordID=idElement;
        document.querySelector('body').style.gridTemplateColumns='auto 15fr 7.5fr';
        document.querySelector('#input-appear').style.display='block';
        const type=e.target.parentNode.parentNode.classList[0];
        document.querySelector('#id').value=values[0].innerHTML;
        document.querySelector('#contact').value=values[2].innerHTML;
        if(type=='Ambulances' || type=='PoliceStations'){
            document.querySelector('#name-input').style.display='none';
            document.querySelector('#loc-input').style.display='block';
            const latLong=values[1].innerHTML.split(': ');
            document.querySelector('#lat').value=latLong[1].split('<')[0];
            document.querySelector('#long').value=latLong[2];
        }else if(type=='Vehicles'){
            document.querySelector('#name-input').style.display='flex';
            document.querySelector('#loc-input').style.display='none';
            document.querySelector('#owner-name').value=values[1].innerHTML;
        }
        e.target.parentNode.innerHTML='<span class="cancel-edit">Cancel</span>';
    }
    else if(e.target.parentNode.classList.contains('edit-row')){
        if(additionActive){
            let prevAddition=document.querySelector('.cancel-add-butt');
            let prevAddTable=prevAddition.getAttribute('add');
            prevAddition.classList.add('add-butt');
            prevAddition.innerHTML=(prevAddTable=='PoliceStations')? '+ Add New Police Stations': '+ Add New '+prevAddTable;
            prevAddition.classList.remove('cancel-add-butt')
            additionActive=null
        }
        document.querySelectorAll('.input-error').forEach(element=>{
            element.classList.remove('input-error');
        })
        document.querySelector('#input-appear h1').innerHTML="Edit";
        const idElement=e.target.parentNode.parentNode.parentNode.id;
        const values=e.target.parentNode.parentNode.parentNode.querySelectorAll('td');
        if(editingRecordID || document.querySelector('#'+editingRecordID)){
            document.querySelector('#'+editingRecordID).querySelector('.butt').innerHTML=editSVG+deleteSVG;
        }
        editingRecordID=idElement;
        document.querySelector('body').style.gridTemplateColumns='auto 15fr 7.5fr';
        document.querySelector('#input-appear').style.display='block';
        const type=e.target.parentNode.parentNode.parentNode.classList[0];
        document.querySelector('#id').value=values[0].innerHTML;
        document.querySelector('#contact').value=values[2].innerHTML;
        if(type=='Ambulances' || type=='PoliceStations'){
            document.querySelector('#name-input').style.display='none';
            document.querySelector('#loc-input').style.display='block';
            const latLong=values[1].innerHTML.split(': ');
            document.querySelector('#lat').value=latLong[1].split('<')[0];
            document.querySelector('#long').value=latLong[2];
        }else if(type=='Vehicles'){
            document.querySelector('#name-input').style.display='flex';
            document.querySelector('#loc-input').style.display='none';
            document.querySelector('#owner-name').value=values[1].innerHTML;
        }
        e.target.parentNode.parentNode.innerHTML='<span class="cancel-edit">Cancel</span>';
    }
    else if(e.target.classList.contains('cancel-edit')){
        document.querySelector('#input-appear').style.display='none';
        document.querySelector('body').style.gridTemplateColumns='auto 15fr';
        e.target.parentNode.innerHTML=editSVG+deleteSVG;
        editingRecordID=null;
    }else if(e.target.classList.contains('add-butt')){
        document.querySelectorAll('#input-appear input[type="text"]').forEach(element=>{
            element.value='';
        })
        document.querySelectorAll('.input-error').forEach(element=>{
            element.classList.remove('input-error');
        })
        if(editingRecordID || document.querySelector('#'+editingRecordID)){
            document.querySelector('#'+editingRecordID).querySelector('.butt').innerHTML=editSVG+deleteSVG;
            editingRecordID=null;
        }
        document.querySelector('body').style.gridTemplateColumns='auto 15fr 7.5fr';
        document.querySelector('#input-appear').style.display='block';
        document.querySelector('#id-input').style.display='none';
        e.target.innerHTML='Cancel Add';
        if(additionActive){
            let prevAddition=document.querySelector('.cancel-add-butt');
            let prevAddTable=prevAddition.getAttribute('add');
            prevAddition.classList.add('add-butt');
            prevAddition.innerHTML=(prevAddTable=='PoliceStations')? '+ Add New Police Station': '+ Add New '+prevAddTable;
            prevAddition.classList.remove('cancel-add-butt')
            additionActive=null;
        }
        e.target.classList.remove('add-butt');
        e.target.classList.add('cancel-add-butt');
        additionActive = e.target.getAttribute('add');
        if(additionActive=='Ambulances' || additionActive=='PoliceStations'){
        document.querySelector('#input-appear h1').innerHTML=additionActive=='Ambulances'?'Add Ambulance':'Add Police Station';
            document.querySelector('#name-input').style.display='none';
            document.querySelector('#loc-input').style.display='block';
        }else if(additionActive=='Vehicles'){
        document.querySelector('#input-appear h1').innerHTML='Add Vehicle'
            document.querySelector('#name-input').style.display='flex';
            document.querySelector('#loc-input').style.display='none';
        }
    }else if(e.target.classList.contains('cancel-add-butt')){
        document.querySelector('#input-appear').style.display='none';
        document.querySelector('body').style.gridTemplateColumns='auto 15fr';
        e.target.classList.remove('cancel-add-butt');
        e.target.classList.add('add-butt');
        if(additionActive=='PoliceStations'){
            e.target.innerHTML='+ Add New Police Station';
        }else{
            e.target.innerHTML='+ Add New '+e.target.getAttribute('add');
        }
        additionActive=null;
    }else if(e.target.classList.contains('input-error')){
        e.target.classList.remove('input-error')
    }
})

document.querySelector('#add-edit-form').addEventListener('submit',e=>{
    e.preventDefault();
    let fields=e.target.querySelectorAll('input[type="text"]');
    let contact;
    if(!fields[4].value || isNaN(fields[4].value)){
        fields[4].classList.add('input-error');
    }else{
        contact=parseInt(fields[4].value);
    }
    if(additionActive){
        if(additionActive=='Ambulances'){
            let lat,long;
            if(!fields[3].value || isNaN(fields[3].value)){
                fields[3].classList.add('input-error');
            }else{
                long=parseFloat(fields[3].value);
            }
            if(!fields[2].value || isNaN(fields[2].value)){
                fields[2].classList.add('input-error');
            }else{
                lat=parseFloat(fields[2].value);
            }
            if(fields[2].classList.contains('input-error') || fields[3].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record added successfully");
                addAmbulance({lat,long},contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                let prevAddition=document.querySelector('.cancel-add-butt');
                prevAddition.classList.add('add-butt');
                prevAddition.innerHTML='+ Add New Ambulance';
                prevAddition.classList.remove('cancel-add-butt')
                additionActive=null;
            }
        }else if(additionActive=='PoliceStations'){
            let lat,long;
            if(!fields[3].value || isNaN(fields[3].value)){
                fields[3].classList.add('input-error');
            }else{
                long=parseFloat(fields[3].value);
            }
            if(!fields[2].value || isNaN(fields[2].value)){
                fields[2].classList.add('input-error');
            }else{
                lat=parseFloat(fields[2].value);
            }
            if(fields[2].classList.contains('input-error') || fields[3].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record added successfully");
                addPoliceStation({lat,long},contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                let prevAddition=document.querySelector('.cancel-add-butt');
                prevAddition.classList.add('add-butt');
                prevAddition.innerHTML='+ Add New Police Station';
                prevAddition.classList.remove('cancel-add-butt')
                additionActive=null;
            }
        }else{
            let name;
            if(!fields[1].value){
                fields[1].classList.add('input-error');
            }else{
                name=fields[1].value;
            }
            if(fields[1].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record added successfully");
                addVehicle(name,contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                let prevAddition=document.querySelector('.cancel-add-butt');
                prevAddition.classList.add('add-butt');
                prevAddition.innerHTML='+ Add New Vehicle';
                prevAddition.classList.remove('cancel-add-butt')
                additionActive=null;
            }
        }
    }else{
        let type=document.querySelector('#'+editingRecordID).classList[0];
        if(type=='Ambulances'){
            let lat,long;
            if(!fields[3].value || isNaN(fields[3].value)){
                fields[3].classList.add('input-error');
            }else{
                long=parseFloat(fields[3].value);
            }
            if(!fields[2].value || isNaN(fields[2].value)){
                fields[2].classList.add('input-error');
            }else{
                lat=parseFloat(fields[2].value);
            }
            if(fields[2].classList.contains('input-error') || fields[3].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record edited successfully");
                editAmbulance(editingRecordID,{lat,long},contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                document.querySelector("#"+editingRecordID+' .butt').innerHTML=editSVG+deleteSVG;
                editingRecordID=null;
            }
        }else if(type=='PoliceStations'){
            let lat,long;
            if(!fields[3].value || isNaN(fields[3].value)){
                fields[3].classList.add('input-error');
            }else{
                long=parseFloat(fields[3].value);
            }
            if(!fields[2].value || isNaN(fields[2].value)){
                fields[2].classList.add('input-error');
            }else{
                lat=parseFloat(fields[2].value);
            }
            if(fields[2].classList.contains('input-error') || fields[3].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record edited successfully");
                editPoliceStation(editingRecordID,{lat,long},contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                document.querySelector("#"+editingRecordID+" .butt").innerHTML=editSVG+deleteSVG;
                editingRecordID=null;
            }
        }else{
            let name;
            if(!fields[1].value){
                fields[1].classList.add('input-error');
            }else{
                name=fields[1].value;
            }
            if(fields[1].classList.contains('input-error') || fields[4].classList.contains('input-error')){
                showMessage("Invalid inputs");
            }else{
                showMessage("Record edited successfully");
                editVehicle(editingRecordID,name,contact);
                document.querySelector('#input-appear').style.display='none';
                document.querySelector('body').style.gridTemplateColumns='auto 15fr';
                document.querySelector("#"+editingRecordID+" .butt").innerHTML=editSVG+deleteSVG;
                editingRecordID=null;
            }
        }
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
    tableRow.classList.add('Ambulances');
    ambulancesTable.appendChild(tableRow);
})

ambulances.on('child_changed',snap=>{
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
    tableRow.classList.add('Ambulances');
    document.querySelector("#"+snap.key).outerHTML=tableRow.outerHTML;
})

ambulances.on('child_removed',snap=>{
    document.querySelector('#'+snap.key).remove();
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
    tableRow.classList.add('PoliceStations');
    policeStationsTable.appendChild(tableRow);
})

policeStations.on('child_changed',snap=>{
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
    tableRow.classList.add('PoliceStations');
    document.querySelector("#"+snap.key).outerHTML=tableRow.outerHTML;
})

policeStations.on('child_removed',snap=>{
    document.querySelector('#'+snap.key).remove();
})

vehicles.on('child_added',snap=>{
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
    tableRow.classList.add('Vehicles');
    vehiclesTable.appendChild(tableRow);
})

vehicles.on('child_changed',snap=>{
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
    tableRow.classList.add('Vehicles');
    document.querySelector("#"+snap.key).outerHTML=tableRow.outerHTML;
})

vehicles.on('child_removed',snap=>{
    document.querySelector('#'+snap.key).remove();
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
    tableRow.classList.add('Accidents');
    accidentsTable.appendChild(tableRow);
})

accidents.on('child_changed',snap=>{
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
    tableRow.classList.add('Accidents');
    document.querySelector("#"+snap.key).outerHTML=tableRow.outerHTML;
})

accidents.on('child_removed',snap=>{
    document.querySelector('#'+snap.key).remove();
})






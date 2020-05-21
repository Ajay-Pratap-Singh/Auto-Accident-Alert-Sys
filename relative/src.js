const dbRoot = firebase.database().ref();
const accidents = dbRoot.child('Accidents');
const onlyElement=document.querySelector("#status");
const button=document.querySelector("#change-vehicle");
let vehicleID=localStorage.getItem('vehicleID');
let toggle="in";

if(vehicleID){
    toggle="out";
    onlyElement.innerHTML=onlyElement.innerHTML+'<br>Vehicle ID: '+vehicleID;
    accidents.on('child_added',snap=>{
        let accident=snap.val();
        if(accident.vehicleID==vehicleID){
            onlyElement.id="accident-occured";
            onlyElement.innerHTML='<br><a href="https://www.google.com/maps/dir/?api=1&destination='+accident.location.lat+','+accident.location.long+'&travelmode=driving">Tap Here</a><br><br>'
        }
    })
}else{
    onlyElement.innerHTML='Vehicle ID:<br><input type="text">';
    button.innerHTML="Enter";
}

button.addEventListener('click',()=>{
    console.log(toggle);
    if(toggle=='out'){
        onlyElement.id="status"
        onlyElement.innerHTML='Vehicle ID:<br><input type="text">';
        button.innerHTML="Enter";
        toggle='in';
        console.log(onlyElement.querySelector("input").value.trim());
        return;
    }
    if(toggle=='in'){
        localStorage.setItem('vehicleID', onlyElement.querySelector("input").value.trim());
        onlyElement.querySelector("input").value.trim()
        window.location.reload();
    }
})
const ambulanceID='-M7XKs39Zu_cLRjZrmbN';
const dbRoot = firebase.database().ref();
const ambulance = dbRoot.child('Ambulances/'+ambulanceID);
const accidents = dbRoot.child('Accidents');
let accidentMarkers=[];


function callback(response, status) {
  console.log('a',status);

  if (status == 'OK') {
    console.log(response);
    console.log('a');
    
    // var origins = response.originAddresses;
    // var destinations = response.destinationAddresses;

    // for (var i = 0; i < origins.length; i++) {
    //   var results = response.rows[i].elements;
    //   for (var j = 0; j < results.length; j++) {
    //     var element = results[j];
    //     var distance = element.distance.text;
    //     var duration = element.duration.text;
    //     var from = origins[i];
    //     var to = destinations[j];
    //   }
    // }
  }
}


function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
  var marker=new google.maps.Marker({position:{ lat: 0, lng: 0 },map,icon:'../img/ambulance.png'});
  let service = new google.maps.DistanceMatrixService();

  accidents.on('child_added',snap=>{
    let accident=snap.val();
    let  accidentID = document.createElement('td');
    accidentID.innerHTML=snap.key;
    let  vehicleID = document.createElement('td');
    vehicleID.innerHTML=accident.vehicleID;
    let location = document.createElement('td');
    location.innerHTML='lat: '+accident.location.lat+'<br>long: '+accident.location.long;
    ambulance.once('value',snap=>{
      let myData=snap.val();
      
      service.getDistanceMatrix({
        origins: [{lat:myData.permanentLocation.lat,lng:myData.permanentLocation.long}],
        destinations: [{lat:accident.location.lat,lng:accident.location.long}],
        travelMode: 'DRIVING',
      }, callback);
    })
    var marker= new google.maps.Marker({position:{lat:accident.location.lat,lng:accident.location.long},map});
    accidentMarkers[snap.key]=marker;
    let tableRow=document.createElement('tr');
    let actionIcons = document.createElement('td');
    actionIcons.innerHTML = "Engage";
    actionIcons.classList.add('butt');
    tableRow.appendChild(accidentID);
    tableRow.appendChild(vehicleID);
    tableRow.appendChild(location);
    tableRow.appendChild(actionIcons);
    tableRow.id=snap.key;
    tableRow.classList.add('Accidents');
    document.querySelector('#accidents table').appendChild(tableRow);
  })

  window.setTimeout(function(){
    navigator.geolocation.getCurrentPosition((position) => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(pos);
      map.setZoom(16);
      console.log('a');
      marker.setPosition(pos);
      ambulance.child('currLocation').set({lat:pos.lat,long:pos.lng});
    });
  }, 5000);
}
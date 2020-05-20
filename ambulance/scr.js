const ambulanceID='-M7XKs39Zu_cLRjZrmbN';
const dbRoot = firebase.database().ref();
const ambulance = dbRoot.child('Ambulances/'+ambulanceID);

ambulance.on('value',snap=>{
  console.log(snap.val());
})

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
  var marker=new google.maps.Marker({position:{ lat: 0, lng: 0 },map,icon:'../img/ambulance.png'});
  
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
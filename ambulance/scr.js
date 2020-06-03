const ambulanceID = '-M7XKs39Zu_cLRjZrmbN';
const dbRoot = firebase.database().ref();
const ambulance = dbRoot.child('Ambulances/' + ambulanceID);
const accidents = dbRoot.child('Accidents');
let accidentMarkers = [];

// Function to calculate distance 
function distance(lat1, lon1, lat2, lon2) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    //  dist = dist * 0.8684 ;
    return dist;
  }
}

async function  initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 16,
  });
  var marker = new google.maps.Marker({ position: { lat: 0, lng: 0 }, map, icon: '../img/ambulance.png' });
  //let service = new google.maps.DistanceMatrixService();

  
  // getting ambulance lat lon 
  const snap=await ambulance.once('value');
  const loaction=snap.val().permanentLocation;
  const lat = loaction.lat;
  const long = loaction.long;
  

  accidents.on('child_added', snap => {
    let accident = snap.val();
    let lat1 = accident.location.lat;
    let long1 = accident.location.long;
      
    // calculating distance between accident and ambulance
    let dist=distance(lat, long, lat1, long1);
    console.log(dist);
    if (dist <= 5.0  && !accident.ambulanceID ) {
      console.log('accident near you');
      let accidentID = document.createElement('td');
      accidentID.innerHTML = snap.key;
      let vehicleID = document.createElement('td');
      vehicleID.innerHTML = accident.vehicleID;
      let location = document.createElement('td');
      location.innerHTML = 'lat: ' + accident.location.lat + '<br>long: ' + accident.location.long;
      var marker= new google.maps.Marker({position:{lat:accident.location.lat,lng:accident.location.long},map});
      accidentMarkers[snap.key]=marker;
      let tableRow = document.createElement('tr');
      let actionIcons = document.createElement('td');
      
      // creting a button
      let button = document.createElement("button");
      button.innerHTML = "Click to go";
      actionIcons.appendChild(button);
      button.value = snap.key;
      button.classList.add('button');
      button.addEventListener('click', (e) => {
        console.log(e.target.value);
        let r = confirm("Are you sure you want to go to this location :\n Press OK to confirm");
        if (r === true) {
          //console.log('Yes');
          accidents.child(e.target.value).update({ ambulanceID:ambulanceID });
          button.innerHTML = "Going...";
          button.disabled = true;
          window.open('https://www.google.com/maps/dir/?api=1&destination='+lat1+','+long1+'&travelmode=driving',"_blank");
        } else {
          alert("Cancelled");
        }
      });
      tableRow.appendChild(accidentID);
      tableRow.appendChild(vehicleID);
      tableRow.appendChild(location);
      tableRow.appendChild(actionIcons);
      tableRow.id = snap.key;
      tableRow.classList.add('Accidents');
      document.querySelector('#accidents').appendChild(tableRow);

    }
  })

  window.setInterval(function () {
    navigator.geolocation.getCurrentPosition((position) => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(pos);
      // map.setZoom(16);
      console.log(pos.lat,pos.lng);
      marker.setPosition(pos);
      ambulance.child('currLocation').set({ lat: pos.lat, long: pos.lng });
    });
  }, 5000);
}
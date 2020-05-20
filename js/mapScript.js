var map;
function initMap() {
    let center={lat: 28.9931, lng: 77.0151};
    map = new google.maps.Map(document.getElementById('map'), {
        center,
        zoom: 7
    });
}
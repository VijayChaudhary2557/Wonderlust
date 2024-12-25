let lat, lon;
let map;
const address = `${document.querySelector('.add-1').textContent}, ${document.querySelector('.add-2').textContent}`;
fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l`)
.then(response => response.json()).then(data => {
    if (data.results.length > 0) {
        // Initialize Map
        lat = data.results[0].position.lat;
        lon = data.results[0].position.lon;

        createMap(lat, lon)
        
    } else {
        console.error("Location not found, using default coordinates");
        var map = tt.map({
            key: 'CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l',
            container: 'map',
            center: [78.0421, 27.1751],  // Default (Taj Mahal) coordinates
            zoom: 13,
            style: `https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&poi=2/poi_dynamic-satellite&key=CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l`
        });
    }
});

function createMap(lat, lon, style='basic'){
    

    if(style !== 'basic')
    {
        map = tt.map({
            key: 'CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l',
            container: 'map',
            center: [lon, lat],  // Correct format [lon, lat]
            zoom: 9,
            style: {
                map: '2/basic_dark',
                poi: '2/poi_dark',
                trafficIncidents: '2/incidents_dark',
                trafficFlow: '2/flow_relative-dark'
            }
        });
    }
    else {
        map = tt.map({
            key: 'CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l',
            container: 'map',
            center: [lon, lat],  // Correct format [lon, lat]
            zoom: 9,
        });
    }
    // let mark = `<i class="fa-solid fa-location-dot"></i>`;
    const customMarker = document.createElement('i');
    customMarker.className = 'fa-solid fa-location-dot customMarker';




    // function addMarker(lat, lon) {
    //     const marker = new tt.Marker({ element: customMarker })
    //         .setLngLat([lon, lat])
    //         .addTo(map);
    // }
    // addMarker(lat, lon);



    
    function addMarkerWithPopup(lat, lon, title, description) {
        // Create Marker
        const marker = new tt.Marker({element: customMarker})
            .setLngLat([lon, lat])
            .addTo(map);
        // Create Popup
        const popup = new tt.Popup({ offset: 25 })  // Offset for positioning
            .setHTML(`
                <h4>${address}</h4><p>${description}</p>
            `);
        // Attach Popup to Marker
        marker.setPopup(popup);
        // Open Popup by Default (Optional)
        marker.togglePopup();
    }
    addMarkerWithPopup(lat, lon, 'Taj Mahal', 'Exact location provided after booking');
}

function setMapStyle(style){
    createMap(lat, lon, style='dark')    
}
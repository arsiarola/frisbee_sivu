
var markerArray = [];
//markerArray.push(makeMarker(63, 23, 'a', 'b'));
for (var i = 0; i < markers.length; i++) {
    if (!(markers[i].latitude === "NULL")) {
        markerArray.push(makeMarker(parseFloat(markers[i].latitude), parseFloat(markers[i].longitude), markers[i].name, markers[i].website));
    }
}
var vectorLayer = makeVectorLayer(markerArray);

function makeMarker(lat, lon, name, website) {
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
        name: name,
        website: website
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 500],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: "img/mark.png",
            scale: 0.1
        }))
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
}

function makeVectorLayer (markerArray) {
    var vectorSource = new ol.source.Vector({
        features: markerArray
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    return vectorLayer;
}
/*var markerArray = [];
markerArray.push(makeMarker(60.192059, 24.945831,  'kenttä: helsinki' +'\n'+ 'sää: pekka pouta', ''));
markerArray.push(makeMarker(50.192059, 24.945831,  'helsinki', ''));
markerArray.push(makeMarker(40.192059, 24.945831,  'helsinki', ''));
var vectorLayer = makeVectorLayer(markerArray);*/

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


/**
 * Create the map.
 */
var map = new ol.Map({
    layers: [
        new ol.layer.Tile({  // MUUTA
            source: new ol.source.OSM()
        }),
        vectorLayer
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([26, 65], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6
    })
});

/**
 * Add a click handler to the map to render the popup.
 */
map.on('dblclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (!feature) {
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate)
    }
});

var element = document.getElementById('popup_marker');

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);

function marker_popup_content(feature, evt) {
    //var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(evt.coordinate));
    //return '<p>' + feature.get('name') + '</p><code>' + hdms + '</code>';
    var url = feature.get('website');

    return '<a href=\"' + url + '\">' + feature.get('name') + '</a>';
    console.log(text);
    //return '<a href=' + url + '>' + feature.get('name') + '</a>';
    return '<a href="https://frisbeegolfradat.fi/rata/simon_frisbeegolfrata/">aaa</a>';
}

map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        $(element).popover({
            placement: 'top',
            html: true,
            content: marker_popup_content(feature, evt)
        });
        //popup.updateSize();
        $(element).popover('show');
    } else {
        $(element).popover('destroy');
    }
});

// change mouse cursor when over marker
/*map.on('pointermove', function(e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});*/
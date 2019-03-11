/*import 'ol/ol.css';
import {Map, toLonLat, toStringHDMS, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from "ol/proj";

function makeMarker(lat, lon, name) {
    var iconFeature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        name: name,
        population: 4000,
        rainfall: 500
    });

    var iconStyle = new Style({
        image: new Icon(/!** @type {module:ol/style/Icon~Options} *!/ ({
            anchor: [0.5, 500],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'data/mark.png',
            scale: 0.1
        }))
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
}

function makeVectorLayer (markerArray) {
    var vectorSource = new VectorSource({
        features: markerArray
    });

    var vectorLayer = new VectorLayer({
        source: vectorSource
    });
    return vectorLayer;
}
var markerArray = [];
markerArray.push(makeMarker(60.192059, 24.945831,  'kenttä: helsinki' +'\n'+ 'sää: pekka pouta'));
markerArray.push(makeMarker(50.192059, 24.945831,  'helsinki'));
markerArray.push(makeMarker(40.192059, 24.945831,  'helsinki'));
var vectorLayer = makeVectorLayer(markerArray);

// var iconFeature = new Feature({
//     geometry: new Point(fromLonLat([24.945831, 60.192059])),
//     name: 'dasadfgeththethte',
//     population: 4000,
//     rainfall: 500
// });
//
// var iconStyle = new Style({
//     image: new Icon(/!** @type {module:ol/style/Icon~Options} *!/ ({
//         anchor: [0.5, 500],
//         anchorXUnits: 'fraction',
//         anchorYUnits: 'pixels',
//         src: 'data/mark.png',
//         scale: 0.1
//     }))
// });
//
// iconFeature.setStyle(iconStyle);

// var vectorSource = new VectorSource({
//     features: [iconFeature]
// });
//
// var vectorLayer = new VectorLayer({
//     source: vectorSource
// });

/!**
 * Elements that make up the popup.
 *!/
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/!**
 * Create an overlay to anchor the popup to the map.
 *!/
var overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});


/!**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 *!/
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

const map = new Map({
    target: document.getElementById('map'),
    layers: [
        new TileLayer({
            source: new OSM()
        }), vectorLayer
    ],
    overlays: [overlay],
    view: new View({
        center: [0,0],
        zoom: 3
    })
});

var element = document.getElementById('popup');

var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);

// display popup on click
// map.on('click', function(evt) {
//     var feature = map.forEachFeatureAtPixel(evt.pixel,
//         function(feature) {
//             return feature;
//         });
//     if (feature) {
//         var coordinates = feature.getGeometry().getCoordinates();
//         popup.setPosition(coordinates);
//         $(element).popover({
//             placement: 'top',
//             html: true,
//             content: feature.get('name')
//         });
//         $(element).popover('show');
//     } else {
//         $(element).popover('destroy');
//     }
// });
//
// // change mouse cursor when over marker
// map.on('pointermove', function(e) {
//     if (e.dragging) {
//         $(element).popover('destroy');
//         return;
//     }
//     var pixel = map.getEventPixel(e.originalEvent);
//     var hit = map.hasFeatureAtPixel(pixel);
//     map.getTarget().style.cursor = hit ? 'pointer' : '';
// });

map.on('singleclick', function(evt) {
    var coordinate = evt.coordinate;
    //var hdms = toStringHDMS(toLonLat(coordinate));

    content.innerHTML = '<p>You clicked here:</p><code>' +
        '</code>';
    overlay.setPosition(coordinate);
});*/

import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import {toStringHDMS} from 'ol/coordinate.js';
import TileLayer from 'ol/layer/Tile.js';
import {toLonLat} from 'ol/proj.js';
import TileJSON from 'ol/source/TileJSON.js';
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";

function makeMarker(lat, lon, name) {
    var iconFeature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        name: name,
        population: 4000,
        rainfall: 500
    });

    var iconStyle = new Style({
        image: new Icon(({
            anchor: [0.5, 500],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'data/mark.png',
            scale: 0.1
        }))
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
}

function makeVectorLayer (markerArray) {
    var vectorSource = new VectorSource({
        features: markerArray
    });

    var vectorLayer = new VectorLayer({
        source: vectorSource
    });
    return vectorLayer;
}
var markerArray = [];
markerArray.push(makeMarker(60.192059, 24.945831,  'kenttä: helsinki' +'\n'+ 'sää: pekka pouta'));
markerArray.push(makeMarker(50.192059, 24.945831,  'helsinki'));
markerArray.push(makeMarker(40.192059, 24.945831,  'helsinki'));
var vectorLayer = makeVectorLayer(markerArray);

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
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
var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer
    ],
    overlays: [overlay],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2
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
        var hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate)
    }
});

var element = document.getElementById('popup_marker');

var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);

function marker_popup_content(feature, evt) {
    var hdms = toStringHDMS(toLonLat(evt.coordinate));
    return '<p>' + feature.get('name') + '</p><code>' + hdms + '</code>';
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
map.on('pointermove', function(e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});
import 'ol/ol.css';
import {Map, View} from 'ol';
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
        image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
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
//     image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
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

const map = new Map({
    target: document.getElementById('map'),
    layers: [
        new TileLayer({
            source: new OSM()
        }), vectorLayer
    ],
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
            content: feature.get('name')
        });
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
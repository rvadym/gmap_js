/**
 * Created by vadym on 26/03/15.
 */

var gmap = {};


// gmap.Map ------------------------------------------------------------------------------------------------------------

/**
 *
 * @param params
 * @returns gmap.Map
 * @constructor
 */
gmap.Map = function(params) {

    var object = this;
    var map = null; // google.maps.Map

    this.params = {
        //map_type: eval(map_type_string),
        map_type: google.maps.MapTypeId.ROADMAP,
        element_id: 'map',
        zoom: 10,
        markers: {} // gmap.Marker
    };

    this.getMapObject = function() {
        return map;
    }

    this.addMarker = function(marker) {
        id = marker.marker_id;
        object.params.markers[id] = marker;
        object.params.markers[id].setMap(object);
        return object;
    };

    this.removeMarker = function(marker_id) {
        //marker.setMap(map);
        //this.params.markers[marker_id] = marker;
        return object;
    };

    this.getMarker = function(marker_id) {
        return object.params.markers[marker_id];
    };

    this.setCenter = function(lat,lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        this.getMapObject().setCenter(latlng);
        this.getMapObject().panTo(latlng);
        return object;
    };

    this.getCenter = function() {
        return this.getMapObject().getCenter();
    };

    var init = function() {
        $.extend(object.params,params);
        map = new google.maps.Map(
            $( '#'+object.params.element_id )[0],
            object.params
        );
        object.setCenter(0, 0);
        return object;
    };
    return init();
};

// gmap.Marker ---------------------------------------------------------------------------------------------------------

/**
 *
 * @param params
 * @returns gmap.Marker
 * @constructor
 */
gmap.Marker = function(params,marker_id) {

    this.marker_id = 'gmap_marker';

    var object = this;
    var marker = null; //  google.maps.Marker
    var map = null;  // gmap.Map

    this.params = {
        animation: google.maps.Animation.DROP,
        clickable: true,
        draggable: false,
        title: null,
        map: null,       // google.maps.Map
        info_window: null
    };

    this.getMarkerObject = function() {
        return marker;
    }

    this.setPosition = function(lat,lng,focus_map) {
        var latlng = new google.maps.LatLng(lat, lng);
        object.getMarkerObject().setPosition( latlng );
        if( typeof focus_map != 'undefined' && focus_map === true ) {
            object.getMap().setCenter(lat,lng);
        }
        return object;
    };

    this.getPosition = function() {
        return object.getMarkerObject().getPosition();
    };

    this.setMap = function( map ) { // gmap.Map
        object.map = map;   // gmap.Map
        object.params.map = object.map.getMapObject(); //  google.maps.Map
        object.getMarkerObject().setMap( object.params.map ); //  google.maps.Map
        return object;
    };

    this.getMap = function() {
        return object.map;
    }

    this.setTitle = function( title ) {
        object.getMarkerObject().setTitle( title );
        return object;
    };

    this.addInfoWindow = function(content, event, config) {

        if( typeof event == 'undefined' ) {
            event = 'click';
        }
        if( typeof config == 'undefined' ) {
            config = {};
        }

        $.extend(config,{
            content: content
        });

        google.maps.event.addListener(marker, event, function() {
            if( object.params.info_window != null ) {
                object.params.info_window.close();
            }
            object.params.info_window = new google.maps.InfoWindow( config );
            object.params.info_window.open(
                object.params.map,
                object.getMarkerObject()
            );
        });

    }

    var init = function() {
        if( typeof marker_id != 'undefined' ) {
            object.marker_id = marker_id;
        }

        // mix params
        $.extend(object.params,params);

        // rewrite map parameter if provided
        if (typeof params != 'undefined' && params.map != null) {
            object.map = params.map;
            object.params.map = params.map.getMapObject();
        }
        //console.log(object.params);
        marker = new google.maps.Marker(object.params);
        return object;
    };
    return init();

}

// gmap.Form -----------------------------------------------------------------------------------------------------------

/**
 *
 * @param params
 * @returns gmap.Form
 * @constructor
 */
gmap.Form = function(params) {

    var object = this;
    var marker = null; // gmap.Marker

    this.params = {

        // element ids
        form_element_id: 'map_form',
        address_element_id: 'address_field',
        latitude_element_id: 'latitude_field',
        longitude_element_id: 'longitude_field',
        zoom_element_id: 'zoom_field',

        // elements
        form_element: null,
        address_element: null,
        latitude_element: null,
        longitude_element: null,
        zoom_element: null,

        // update flags
        update_address: true,
        update_latitude: true,
        update_longitude: true,
        update_zoom: true

    };

    this.setMarker = function( marker ) { // gmap.Marker
        object.marker = marker;

        object.getMarker().setPosition(object.params.latitude_element.val(), object.params.longitude_element.val(), true);

        if (object.marker.params.draggable === true) {
            updateFormOnMarkerDrag();
        }

        return object;
    }

    this.getMarker = function() {
        return object.marker;
    }

    var updateFormOnMarkerDrag = function() {

        // http://gmaps-samples-v3.googlecode.com/svn/trunk/draggable-markers/draggable-markers.html
        // Add dragging event listeners.
        /*google.maps.event.addListener(marker, 'dragstart', function() {
         updateMarkerAddress('Dragging...');
         });*/

        /*google.maps.event.addListener(marker, 'drag', function() {
         updateMarkerStatus('Dragging...');
         updateMarkerPosition(marker.getPosition());
         });*/

        google.maps.event.addListener(object.marker.getMarkerObject(), 'dragend', function() {
            var util = new gmap.Util();
            util.geocodePosition(object.marker.getMarkerObject().getPosition(),function(data) {
                var address = data.formatted_address;
                var lat = data.geometry.location.lat();
                var lng = data.geometry.location.lng();
                object.params.address_element.val(address);
                object.params.latitude_element.val(lat);
                object.params.longitude_element.val(lng);
            });
        });

    }

    var init = function() {

        // get marker from params
        if ( typeof params != 'undefined' && typeof params.marker != 'undefined' && params.marker != null ) { // gmap.Marker
            marker = params.marker;
            delete params.marker;
        }

        $.extend(object.params, params);

        //if (!object.params.form_element) object.params.form_element = $('#'+object.params.form_element_id);
        if (!object.params.address_element) object.params.address_element = $('#'+object.params.address_element_id);
        if (!object.params.latitude_element) object.params.latitude_element = $('#'+object.params.latitude_element_id);
        if (!object.params.longitude_element) object.params.longitude_element = $('#'+object.params.longitude_element_id);

        if ( marker != null ) {
            object.setMarker(marker);
        }

        return object;
    };

    return init();
}


// gmap.Util -----------------------------------------------------------------------------------------------------------

/**
 *
 * @constructor
 */
gmap.Util = function() {

    this.geocodePosition = function (pos, success_callback, return_all, error_message_callback) {
        if( typeof return_all == 'undefined' ) {
            return_all = false;
        }
        if( typeof error_message_callback == 'undefined' ) {
            error_message_callback = function(msg) {alert(msg)};
        }
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: pos
        }, function(responses) {
            if (responses && responses.length > 0) {
                if (return_all) {
                    var respond = responses;
                } else {
                    var respond = responses[0];
                }
                success_callback(respond);
            } else {
                error_message_callback('Cannot determine address at this location.');
            }
        });
    };

}





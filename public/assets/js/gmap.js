/**
 * Created by vadym on 26/03/15.
 */

var gmap = {};


/**
 *
 * @param params
 * @returns gmap.Map
 * @constructor
 */
gmap.Map = function(params) {

	var object = this;
	var map = null; // real google map

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
		this.getMapObject().panTo(latlng);
		return object;
	};

	var init = function() {
		$.extend(object.params,params);
		map = new google.maps.Map(
			$( '#'+object.params.element_id )[0],
			object.params
		);
		return object;
	};
	return init();
};


/**
 *
 * @param params
 * @returns gmap.Marker
 * @constructor
 */
gmap.Marker = function(params,marker_id) {

	this.marker_id = 'gmap_marker';

	var object = this;
	var marker = null;
	var map = null;

	this.params = {
		animation: google.maps.Animation.DROP,
		clickable: true,
		draggable: false,
		title: null,
		map: null,
		info_window: null
	};

	this.getMarkerObject = function() {
		return marker;
	}

	this.setPosition = function(lat,lng) {
		var latlng = new google.maps.LatLng(lat, lng);
		object.getMarkerObject().setPosition( latlng );
		return object;
	};

	this.setMap = function( map ) {
		object.map = map;
		object.params.map = object.map.getMapObject();
		object.getMarkerObject().setMap( object.params.map );
		return object;
	};

	this.setTitle = function( title ) {
		object.getMarkerObject().setTitle( title );
		return object;
	};

	this.addInfoWindow = function(content, event, params) {

		if( typeof event == 'undefined' ) {
			event = 'click';
		}
		if( typeof params == 'undefined' ) {
			params = {};
		}

		$.extend(params,{
			content: content
		});

		google.maps.event.addListener(marker, event, function() {
			if( object.params.info_window != null ) {
				object.params.info_window.close();
			}
			object.params.info_window = new google.maps.InfoWindow( params );
			object.params.info_window.open(
				object.params.map.getMapObject(),
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
		console.log(object.params);
		marker = new google.maps.Marker(object.params);
		return object;
	};
	return init();

}

/**
 *
 * @param params
 * @returns gmap.Form
 * @constructor
 */
gmap.Form = function(params) {

	var object = this;

	this.params = {

		// element ids
		form_element_id: 'map_form',
		address_element_id: 'address_field',
		latitude_element_id: 'latitude_field',
		longitude_element_id: 'longitude_field',

		// elements
		form_element: null,
		address_element: null,
		latitude_element: null,
		longitude_element: null,

		// update flags
		update_address: true,
		update_latitude: true,
		update_longitude: true

	};

	var init = function() {
		$.extend(object.params,params);

		if (!object.params.form_element) object.params.form_element = $('#'+object.params.form_element_id);
		if (!object.params.address_element) object.params.address_element = $('#'+object.params.address_element_id);
		if (!object.params.latitude_element) object.params.latitude_element = $('#'+object.params.latitude_element_id);
		if (!object.params.longitude_element) object.params.longitude_element = $('#'+object.params.longitude_element_id);

		return object;
	};
	return init();
}











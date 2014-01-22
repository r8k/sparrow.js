var geocoding = httpClient.get('http://maps.googleapis.com/maps/api/geocode/json?address=560008&sensor=false');

geocoding.waitForComplete();

if (!geocoding.isSuccess()) {
    throw 'Error contacting geocoding web service';
}

// We got a response. Parse the JSON into a JavaScript object.

geocodeResponse = geocoding.getResponse().content.asJSON;

if (geocodeResponse.status != 'OK') {
    throw 'Error returned from geocoding web service: ' + geocodeResponse.status;
}
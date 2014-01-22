var response_payload;
try {
    response_payload = JSON.parse(context.getVariable('response.content'));
} catch (e) {
  // do nothing
}
try {
    if (response_payload) {
        var o = response_payload;
        for (var k in o) {
            if (o.hasOwnProperty(k) && !isNaN(o[k])) {
                o[k] = String(o[k]);
            }
        }
      context.setVariable('response.content', JSON.stringify(response_payload));
    }
} catch (e) {
    // do nothing
};
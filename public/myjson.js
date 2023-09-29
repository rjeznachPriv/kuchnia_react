var API_KEY;

function postJson(jsonData, callback) {
    $.ajax({
        url: "https://api.myjson.com/bins",
        type: "POST",
        data: JSON.stringify(jsonData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('post json success');
            API_KEY = data.uri.split('/').slice(-1)[0];
            callback(API_KEY);
        },
        error: function () {
            alert('error post http://myjson.com');
        }
    });   
}

function putJson(jsonData, callback) {
    $.ajax({
        url: "https://api.myjson.com/bins/" + API_KEY,
        type: "PUT",
        data: JSON.stringify(jsonData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('put json success');
            callback(API_KEY);
        },
        error: function () {
            alert('error put http://myjson.com');
        }
    });   
}

function getJson(apiKey, callback) {
    $.get("https://api.myjson.com/bins/" + apiKey, function (data, textStatus, jqXHR) {
        if (jqXHR.status == 200) {
            console.log('get json success');
            console.log(data);
            callback(data);
        } else {
            alert('error get http://myjson.com');
        }
    });
}

/// interface:

function storeState(state, callback) { 
    if (API_KEY) {
        putJson(state, callback);
    } else {
        postJson(state, callback);
    }
}

function loadState(apiKey, callback) {
    console.log(apiKey);
    if (!apiKey) {
        callback(false);
        return false; // it means no key provided. Save own state or ask customer for key
    }

    getJson(apiKey, callback);
}


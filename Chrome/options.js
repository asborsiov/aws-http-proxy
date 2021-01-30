

var apiKeyLock = document.getElementById("apiKeyLock");
var apiKey = document.getElementById("apiKey");
apiKeyLock.oninput = function() {
 if (apiKey.type === "password") {
  apiKey.type = "text";
 }
 else {
  apiKey.type = "password";
 }
}

var apiUrlLock = document.getElementById("apiUrlLock");
var apiUrl = document.getElementById("apiUrl");
apiUrlLock.oninput = function() {
 if (apiUrl.type === "password") {
  apiUrl.type = "text";
 }
 else {
  apiUrl.type = "password";
 }
}

 
var slider = document.getElementById("timeRange");
var output = document.getElementById("time");
output.innerHTML = slider.value; // Display the default slider value
slider.oninput = function() {
  output.innerHTML = this.value;
}

function save_options() {
  var region = document.getElementById('region').value;
  var duration = document.getElementById('timeRange').value;
  var apiurl = document.getElementById('apiUrl').value;
  var apikey = document.getElementById('apiKey').value;
;
  chrome.storage.sync.set({
    region: region,
    duration: duration,
    apiurl: apiurl,
    apikey: apikey
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function restore_options() {
  chrome.storage.sync.get({
    region: 'us-east-1',
    duration: 5,
    apiurl: '',
    apikey: ''
  }, function(items) {
    document.getElementById('region').value = items.region;
    document.getElementById('timeRange').value = items.duration;
	document.getElementById('time').innerHTML = items.duration;
	document.getElementById('apiUrl').value = items.apiurl
	document.getElementById('apiKey').value = items.apikey
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
var region;
var duration;
var apiurl;
var apikey;
var publicIP;
var online = false;

const getProxy = async sync => {
  axios.defaults.headers.common = {
   "x-api-key": apikey,
  };
  try {
    const response = await axios.get(`${apiurl}`);
	publicIP = String(response.data)
    setProxy()
  } catch (error) {
	chrome.browserAction.setIcon({path:"fail.png"});
	console.error(error);
  }
};

const setProxy = async sync => {
var config = {
    mode: "fixed_servers",
    rules: {
    singleProxy: {
      scheme: "socks5",
      host: publicIP,
      port: 1080 }
	}};
    chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});
    wait_timeout();
	chrome.browserAction.setIcon({path:"success.png"});
	online = true;
}

const wait_timeout = async sync => {
chrome.alarms.create("DisableProxy",{delayInMinutes: parseInt(duration)});
chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name == "DisableProxy") {
    chrome.proxy.settings.set({value: { mode: "direct" }, scope: 'regular'}, function() {});
	chrome.browserAction.setIcon({path:"blank.png"});
	}
});
}

const handleSubmit = async sync => {
  chrome.browserAction.setIcon({path:"progress.png"});
  chrome.proxy.settings.set({value: { mode: "direct" }, scope: 'regular'}, function() {});	
  var p = new Promise(function (resolve, reject) {
  var permission = true; 
  chrome.storage.sync.get([
    'region', 'duration', 'apiurl', 'apikey'],
	function(items) {
    region = items.region;
    duration = parseInt(items.duration);
	apiurl = items.apiurl;
	apikey = items.apikey;
	resolve(permission);
    });
  });
  p.then(function (permission) {
    getProxy();
 });
};

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.proxy.settings.set({value: { mode: "direct" }, scope: 'regular'}, function() {});	
	if (online == false) 
	{
		handleSubmit()
	}
	else
	{
		chrome.alarms.clearAll();
		chrome.browserAction.setIcon({path:"blank.png"});
		online = false;
	}
	})

var pushDetails = {
	senderID: "38438927043",
	uniqushUrl: "http://api.uni-potsdam.de/endpoints/pushAPI/subscribe",
	serviceName: "reflectup",
	subscriberName: "android-",
	authHeader: { "Authorization": "Bearer c06156e119040a27a4b43fa933f130" }
};

document.addEventListener("deviceready", function(){
    PushServiceRegister();
});

var SubscribeToUniqush = function(options) {
	var uri = new URI(pushDetails.uniqushUrl);
	uri.search(options);

	console.log("Registering id " + options.regid + " via " + uri.href());

	$.ajax({
		url: uri.href(),
		headers: pushDetails.authHeader,
		success: function() { console.log("Successfully contacted uniqush server"); },
		error: function() { console.log("Some error happened while contacting the uniqush server"); }
	});
};

var PushServiceRegister = function() {
	
	var successHandler = function(result) {
		console.log("result = " + result);
	};

	var errorHandler = function(result) {
		console.log("error = " + result);
	};

	var pushNotification = window.plugins.pushNotification;
	if (device.platform == "android" || device.platform == "Android" || device.platform == "amazon-fireos") {
	    pushNotification.register(
		    successHandler,
		    errorHandler,
		    {
		        "senderID": pushDetails.senderID,
		        "ecb": "onNotification"
		    });
	}
};

var onNotification = function(e) {
	switch (e.event) {
		case "registered":
			// RegID received, inform uniqush server
			var regId = e.regid;
			if (regId.length == 0) {
				// empty regId, what do we do?
				console.log("Push regId empty");
			} else {
				var options = {
					service: pushDetails.serviceName,
					subscriber: pushDetails.subscriberName + regId,
					pushservicetype: "gcm",
					regid: regId
				};
				SubscribeToUniqush(options);
			}

			break;
		case "message":
			// push notification received, inform app
			console.log("Push notification received: " + JSON.stringify(e));

			// create local notification to inform the user
			var message = e.payload.msg;
			window.plugin.notification.local.add({
				title: message,
				message: "Reflect.UP anzeigen",
				autoCancel: true
			});

			break;
		case "error":
			// error happened
			console.log("Push error happened");
			break;
		default:
			// unknown event, what do we do?
			console.log("Push event unknown");
			break;
	}
};

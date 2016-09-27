var pushDetails = {
	senderID: "38438927043",
	uniqushUrl: "https://api.uni-potsdam.de/endpoints/pushAPI/subscribe",
	serviceName: "reflectup",
    authHeader: { "Authorization": "Bearer c06156e119040a27a4b43fa933f130" },
	subscriberName: function(id) {
        var platform = "ios-";
        return platform + id.replace(/:/g, "");
    },
    subscriberType: function() {
        // Always use GCM. But not on iOS. Use APNS on iOS
        return device.platform === "iOS" ? "apns" : "gcm";
    }
};

var SubscribeToUniqush = function(options) {
	var uri = new URI(pushDetails.uniqushUrl);
	uri.search(options);

	console.log("Registering id " + options.regid + " via " + uri.href());

	$.ajax({
		url: uri.href(),
		headers: pushDetails.authHeader,
		success: function(response) { console.log("Successfully contacted uniqush server. Server responded with " + response); },
		error: function() { console.log("Some error happened while contacting the uniqush server"); }
	});
};

var PushServiceRegister = function(){
    if (typeof PushNotification === "undefined") {
        console.log("PushNotification NOT available");
        return;
    }

	var push = PushNotification.init({
        android: {
            senderID: pushDetails.senderID
        },
        browser: {
            pushServiceURL: "http://www.google.de"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on("registration", function(data) {
        // RegID received, inform uniqush server
        var regId = data.registrationId;
        if (regId.length == 0) {
            // empty regId, what do we do?
            console.log("Push regId empty");
        } else {
            var options = {
                service: pushDetails.serviceName,
                subscriber: pushDetails.subscriberName(regId),
                pushservicetype: pushDetails.subscriberType()
            };

            if (device.platform === "iOS")
                options.devtoken = regId;
            else
                options.regid = regId;

            SubscribeToUniqush(options);
        }
    });

    push.on("notification", function(data) {
        // push notification received, inform app
        console.log("Push notification received: " + JSON.stringify(data));
    });

    push.on("error", function(data) {
        // error happened
        console.log("Push error happened: " + data.message);
    });
};
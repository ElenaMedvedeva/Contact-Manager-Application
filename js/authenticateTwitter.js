var isListening = false;
var sessionID;
TwitterHelper = {

	localPzpAddress: null,
	isReady: false, // TODO: Check if service is ready before calling staff...
	oAuthService: null,
	init: function(message){
		console.log("from TwitterHelper:init ");
		// Keep track of the local device address						
		webinos.ServiceDiscovery.findServices(new ServiceType('http://webinos.org/api/events'), {
		  onFound: function (service) {
			  console.log('Events service found!');
			sessionID = service.myAppID.substring(0,service.myAppID.lastIndexOf('/'));
			console.log("sessionId=",sessionID);
			isAlreadyAuthenticated();			
		  }});															
	},
	API: {
// 		getUsersInfo: function(ids, userHandlerCB){
// 			var baseRequest = "http://api.twitter.com/1/users/lookup.json?user_id=";
// 			//split the request into batches of 100 persons
// 			while (ids.length >0){
// 				var currentids;
// 				if (ids.length>100){
// 					currentids = ids.splice(0,100);
// 				} else {
// 					currentids = ids.splice(0,ids.length);
// 				}
// 				var request = baseRequest + currentids.join(",");
// 				TwitterHelper.oAuthService.get(request, TwitterHelper.Secrets.access_token, TwitterHelper.Secrets.access_token_secret, function(users){
// 					users = JSON.parse(users);
// 					jQuery.each(users,function(index, user){
// 						userHandlerCB(user);
// 					});
// 				});
// 			}
// 		},
		tweetMessage: function(text, successCB, errorCB){
                              console.log('from twetMessage ', text);
		  
		    $.ajax({
			url: "http://130.192.85.173:8888/tweet",
			type: 'POST',
		// 		    $.ajax({
// 			url: "https://130.192.85.173:8888/logout",
// 			type: 'POST',
// 			data: JSON.stringify({"sessionID": sessionID}),				
// 			dataType: 'json',
// 
// 			success: function (data) {
// 			   TwitterHelper.isReady = false;
// 			   if(successCB) successCB(data);			   
// 			},
// 			error: function (data) {
// 			  TwitterHelper.isReady = false;
// 
// 			   if(errorCB) errorCB(data);
// 			   console.log("Error: " + JSON.stringify(data));
// 			}
// 		    }	
	     data: JSON.stringify({"sessionID": sessionID, "tweet": text}),				
			dataType: 'json',

			success: function (data) {
			   if(successCB) successCB(data);	
			},
			error: function (data) {
			   if(errorCB) errorCB(data);
			   console.log("Error: " + JSON.stringify(data));
			}
		    });
		  
		  
		},
		tweetWithImage: function(text,imageName,imageBytes, successCB, errorCB){
			//Body should be text due to Twitter's undocumented incompatibility with oAuth.
			//Posting with oAuth does not support multipart/form-data specification http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.2
			var body = "";
			var nl = "\r\n";
			
			body += "--CbotRul3z"+nl;
			//media[] as described in API doesn't work!
			//Using media_data instead based on http://stackoverflow.com/questions/7316776/twitters-statuses-update-with-media-on-ios-returns-500-error
			body += 'Content-Disposition: form-data; name="media_data[]"; filename="'+imageName+'"'+nl;
			body += 'Content-Transfer-Encoding: base64'+nl;
			body += 'Content-Type: image/png'+nl; // TODO: We should know what type this image is
			body += ''+nl;
			body += imageBytes+nl;
			
			body += "--CbotRul3z"+nl;
			body += 'Content-Disposition: form-data; name="status"'+nl;
			body += ''+nl;
			body += text+nl;
			
			body += "--CbotRul3z--";
			body += ''+nl;
			
			TwitterHelper.oAuthService.post("http://upload.twitter.com/1/statuses/update_with_media.json", TwitterHelper.Secrets.access_token, TwitterHelper.Secrets.access_token_secret, body, "multipart/form-data; boundary=CbotRul3z", function(data){
					if(successCB) successCB(data);
				}, function(errorcode){
					console.log('Error posting tweet:' + errorcode);
					if (errorCB) errorCB(errorcode);
				});
		}
	},
	addContactToList: function(user){
		$('ul#friendsList').append('<li><img src="' + user.profile_image_url + '\" width=\"40\" height=\"40\"/><label for=\"sample2\">'+user.name +'- @' + user.screen_name +'</label><input type=\"checkbox\" id=\"'+ '@' + user.screen_name +'\"></li>');
	},
	getContacts: function() {
	  
		$.ajax({
			url: "http://130.192.85.173:8888/getFriends"+"?sessionID="+sessionID,
			type: 'GET',
			data: JSON.stringify({"sessionID": sessionID}),				
			dataType: 'json',

			success: function (data) {
			  for(var i in data)
			    TwitterHelper.addContactToList(data[i]);
			},
			error: function (data) {
			   console.log("Error: " + data);			   			   			   
			   
			}
		    });	  
	},
	addTimelineToList: function(data){  
		$('ul#timeline').append('<li onclick=reTweet("' + data.user.screen_name +'");><a href="#menucreate"><img src="' + data.user.profile_image_url  + '">' + '<h3>' + data.user.name +' <span>' + "@"+data.user.screen_name + '</span></h3><p>' + data.text + '</p>' + '<p class="date">' + data.created_at + '</p>' + '</a></li>');
	},
	getTimeline: function() {
	
		$.ajax({
		url: "http://130.192.85.173:8888/getTimeline"+"?sessionID="+sessionID,
		type: 'GET',
		data: JSON.stringify({"sessionID": sessionID}),				
		dataType: 'json',

		success: function (data) {		 
		  for(var i in data)
		    TwitterHelper.addTimelineToList(data[i]);
		},
		error: function (data) {
		    console.log("Error: " + data);			   			   			   
		    
		}
	    });	   
	},
	logout: function(successCB, errorCB){
		    $.ajax({
			url: "http://130.192.85.173:8888/logout",
			type: 'POST',
			data: JSON.stringify({"sessionID": sessionID}),				
			dataType: 'json',

			success: function (data) {
			   TwitterHelper.isReady = false;
			   if(successCB) successCB(data);	
			   $('#status').css('visibility', 'hidden');
			   $('#status_ko').css('visibility', 'visible');
			},
			error: function (data) {
			  TwitterHelper.isReady = false;

			   if(errorCB) errorCB(data);
			   console.log("Error: " + JSON.stringify(data));
			}
		    });	
	}
};
function isAlreadyAuthenticated(){
	console.log('from isAlreadyAuthenticated');
  if(TwitterHelper.isReady == false)
  {
	$.ajax({
		url: "http://130.192.85.173:8888/isAlreadyAuthenticated",
		type: 'POST',
		data: JSON.stringify({"sessionID": sessionID}),
		dataType: 'json',

		success: function (data) {
		  
		  console.log("----------");
		  console.log(data);
		  console.log("----------");
		  
		    if(data == true){
		      //alert(data);
		      console.log("isAlreadyAuthenticated: " + data);
		      TwitterHelper.getContacts();
		      TwitterHelper.getTimeline();
		      TwitterHelper.isReady = true;
		      //$('#status').css('visibility', 'visible');
		      //$('#status_ko').css('visibility', 'hidden');
		    }
		    else{

		      $.ajax({
			url: "http://130.192.85.173:8888/authenticate",     //?sessionID="+sessionID,
			type: 'POST',
			data: JSON.stringify({"sessionID": sessionID}),
			dataType: 'json',
			//type: 'GET',

			success: function (data) {
				if(data){
					window.open(data.authURL);
					console.log("devServer<authURL> " + data.authURL);
				}
				else{
					console.log('Error: no URL recived');
					alert("Server error!");
				}
			},
			error: function (data) {
				console.log('Authenticate Error: ' + data.responseText);
			}
		      });
		    }
		},
		error: function (data) {
		    console.log('IsAlreadyAuthenticate Error: ' + JSON.stringify(data));
		}
	});
  }
}

function checkDeletion(){
	//console.log("checking for deletions...");

	var contacts = $('#friendsList').find('li').find('input');		//TwitterContactsRawList
	var androidContacts = $('#contactList').find('li').find('input');	//AndroidContactsRawList

	if (androidContacts !== undefined) {
		for(var i = 0;i < androidContacts.length;i++){
		  var flagged = false;

		  if(usrEmails !== undefined)					//do not add Android contacts without Twitter infos
		    for(var j=0;j<usrEmails.length;j++)
		      if(usrEmails[j].address === androidContacts[i].id)
			flagged = true;

		  if(!flagged)
		    contacts.push(androidContacts[i]);				//add the whole tag
		}
	}

	var txtBox = $('#tbox').find("textarea").val();
	if(txtBox !== "" && !isListening){					//if isListening it's useless
	  for(var i=0;i<contacts.length;i++)
	    if(txtBox.indexOf(contacts[i].id) == "-1")
		$(contacts[i]).attr("checked", false);				//uncheck contacts[i].id if deleted from textarea
	    else
		$(contacts[i]).attr("checked", true);				//check contacts[i].id if handwritten in textarea
	}	
	
	setTimeout(checkDeletion, 500);
}



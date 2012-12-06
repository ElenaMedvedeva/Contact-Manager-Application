var twitterNick = null;
var twitterLimit = 140; 

function reTweet(data){
	  $('#tbox').find("textarea").val('@' + data);
};

function printContact1(contact) {
	document.getElementById('contactList1').innerHTML = "";	  
	console.log("contact=", contact, document.getElementById('contactList1'));
	var contactString = " <b>Display Name: </b>";
	var displayName = '';
	if(isString(contact.displayName)){
		displayName = (contact.displayName == "" ? "<b>Anonymous</b>": contact.displayName);
	}
	contactString += displayName + "<br>";
					// onclick='setPage(\"person.html\")\'
	if(contact.nickname != undefined && contact.nickname != "") {
		contactString +="<b>Nickname: </b>" + contact.nickname + "<br>";
		twitterNick = contact.nickname;
		reTweet(twitterNick);
	} else {
		twitterNick = null;
	}
	// name
	contactString += (contact.name.formatted == "" ? "<b>Anonymous</b></br>": "<b>Name: </b>" + contact.name.formatted 	+ "<br>");

	if ((contact.emails instanceof Array) && contact.emails.length > 0) {
		contactString += "<b>Emails:</b><br>";
		for ( var j = 0; j < contact.emails.length; j++)
			contactString += "&nbsp;&nbsp;"	+ (contact.emails[j].pref ? "* ": "&nbsp;&nbsp;") + contact.emails[j].type + ": <a href=\"mailto:"
									+ contact.emails[j].value + "\">"
									+ contact.emails[j].value + "</a><br>";
	}
	if ((contact.addresses instanceof Array) && contact.addresses.length > 0) {
		contactString += "<b>Addresses:</b><br>";
		for ( var j = 0; j < contact.addresses.length; j++)
			contactString += "&nbsp;&nbsp;"	+ (contact.addresses[j].pref ? "* " : "&nbsp;&nbsp;")
									+ (contact.addresses[j].type == "" ? "other": contact.addresses[j].type)
									+ ": " + contact.addresses[j].formatted
									+ "<br>";
	}
	if ((contact.phoneNumbers instanceof Array)	&& contact.phoneNumbers.length > 0) {
		contactString += "<b>Phones:</b><br>";
		for ( var j = 0; j < contact.phoneNumbers.length; j++)
			contactString += "&nbsp;&nbsp;" + (contact.phoneNumbers[j].pref ? "* ": "&nbsp;&nbsp;")
									+ contact.phoneNumbers[j].type + ": "
									+ contact.phoneNumbers[j].value
									+ "<br>";
	}
	if ((contact.ims instanceof Array) && contact.ims.length > 0) {
		contactString += "<b>Messengers:</b><br>";
		for ( var j = 0; j < contact.ims.length; j++)
			contactString += "&nbsp;&nbsp;" + (contact.ims[j].pref ? "* " : "&nbsp;&nbsp;")
									+ contact.ims[j].type + ": "
									+ contact.ims[j].value + "<br>";
	}
	if ((contact.organizations instanceof Array) && contact.organizations.length > 0) {
		contactString += "<b>Organizations:</b><br>";
		for ( var j = 0; j < contact.organizations.length && contact.organizations[j].name != undefined; j++)
			contactString += "&nbsp;&nbsp;" + (contact.organizations[j].pref ? "* " : "&nbsp;&nbsp;")
									+ contact.organizations[j].type + ": "
									+ contact.organizations[j].name
									+ "<br>";
	}
	//console.log("Photoes=" + contact.photos);

	if ((contact.photos instanceof Array) && contact.photos.length > 0) {
		contactString += "<b>Picture:</b><br>";
		for ( var j = 0; j < contact.photos.length; j++) {
			if (contact.photos[j].type == "file") // is
				// base64
				// string
				contactString += "<img src=\"data:image/png;base64," + contact.photos[j].value + "\" alt=\"Image\"><br>";

			else if (contact.photos[j].type == "url") { // is an URL
				console.log("foto ",contact.photos[j]);
				contactString += "<img src=\"" + contact.photos[j].value + "\" alt=\"Image\"><br>";
			// TODO: quick and dirty solution for android
			// issue. Photos arrays starts as array and get
			// here as object
			} else { // if (/*(contact.photos instanceof
				// Object) &&*/ contact.photos.value) {
				var photo =contact.photos[j].value;
				contactString += "<img alt=\"Image\" , src=\"data:image\/png;base64, " + photo + "\" /><br>";
			}
		}
	}

	if ((contact.urls instanceof Array) && contact.urls.length > 0) {
		contactString += "<b>Websites:</b><br>";
		for ( var j = 0; j < contact.urls.length; j++)
			contactString += "&nbsp;&nbsp;" + (contact.urls[j].pref ? "* ": "&nbsp;&nbsp;")
									+ contact.urls[j].type + ": <a href=\""
									+ contact.urls[j].value + "\">"
									+ contact.urls[j].value + "</a><br>";
	}

	contactString += "<br>";
	console.log("HERE!!!");
        console.log("contactList1", $('#contactList1'));
      //  document.getElementById('contactList1').innerHTML = contactString;
	$('#contactList1').append(contactString);
	$('#contactList1').append("<br>");
};

function initContact(){
	$("#tbox").maxinput({
		position	: 'topleft',
		showtext 	: true,
		limit		: twitterLimit
	});
	
	 
	 if(contactList && selectedNumber){			
		 console.log("Printing", $(this));		 
		 printContact1(contactList[selectedNumber]);
	 }
	 
	 $('#btnSubmit').bind('click', function(){		
		    // Tweet Message only
			TwitterHelper.API.tweetMessage(
				$('#tbox').find("textarea").val(),
				function(){
					console.log('Tweet message successful');
					$('#tbox').find("textarea").val('');
					if(twitterNick){
						reTweet(twitterNick);
						}
					var currlength = $('textarea',$("#tbox")).val().length ;			
					$('.jMax-text span:first', $("#tbox")).html(twitterLimit - currlength);
					},
				function(){ 
						console.log('Tweet message unsuccessful'); 
						alert("error");}
			);				
	});

};


$(document).ready(function() {
	initContact();
	
	 //not used now
	 function findByDisplayName(){
		 	displayName = personName;
		 	parameters = {};
		  parameters.fields = {};
		  var result = "No contact found";
		  if(recentService && displayName){
			  parameters.fields = {};
			  parameters.fields["displayName"] = displayName;
			  if ($("input[@name='contactType']:checked").val() == 'remote'){
		        parameters.type = "remote";
		        } else {
		        	parameters.type = "local";
		        }
			  console.log("parameters",parameters,  recentService);
			  $('#contactList').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
			    recentService.isAlreadyAuthenticated(parameters, function(result){
			    	 console.log("isAlreadyAuthenticated", result);
				          //contactsService[0]
					recentService.find(parameters, print_contact_list);
				 });
		  }
		  return result;
	  }
	 
	// Print a contact list to HTML document( not used now)
	  function print_contact_list(list)
	  {	   
		  console.log("print_contact_list");
	    //clean then write
	    document.getElementById('contactList1').innerHTML = "";	   
	    if (list.length > 0)
	    {
	      for ( var i = 0; i < list.length; i++)
	      {
	                console.log("list=" ,list[i]);
	                var contactString = " <b>Display Name: </b>";
	        var displayName = (list[i].displayName == "" ? "<b>Anonymous</b>" :list[i].displayName );
	        contactString += displayName +"<br>";
	        //onclick='setPage(\"person.html\")\'
	        contactString += ((list[i].nickname == undefined || list[i].nickname == "") ? "" : "<b>Nickname: </b>" +
	          list[i].nickname + "<br>");
	        //name
	        contactString += (list[i].name.formatted == "" ? "<b>Anonymous</b></br>" : "<b>Name: </b>" +
	                list[i].name.formatted + "<br>");

	        if ((list[i].emails instanceof Array) && list[i].emails.length > 0)
	        {
	          contactString += "<b>Emails:</b><br>";
	          for ( var j = 0; j < list[i].emails.length; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].emails[j].pref ? "* " : "&nbsp;&nbsp;") +
	              list[i].emails[j].type + ": <a href=\"mailto:" + list[i].emails[j].value + "\">" +
	              list[i].emails[j].value + "</a><br>";
	        }
	        if ((list[i].addresses instanceof Array) && list[i].addresses.length > 0)
	        {
	          contactString += "<b>Addresses:</b><br>";
	          for ( var j = 0; j < list[i].addresses.length; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].addresses[j].pref ? "* " : "&nbsp;&nbsp;") +
	              (list[i].addresses[j].type == "" ? "other" : list[i].addresses[j].type) + ": " +
	              list[i].addresses[j].formatted + "<br>";
	        }
	        if ((list[i].phoneNumbers instanceof Array) && list[i].phoneNumbers.length > 0)
	        {
	          contactString += "<b>Phones:</b><br>";
	          for ( var j = 0; j < list[i].phoneNumbers.length; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].phoneNumbers[j].pref ? "* " : "&nbsp;&nbsp;") +
	              list[i].phoneNumbers[j].type + ": " + list[i].phoneNumbers[j].value + "<br>";
	        }
	        if ((list[i].ims instanceof Array) && list[i].ims.length > 0)
	        {
	          contactString += "<b>Messengers:</b><br>";
	          for ( var j = 0; j < list[i].ims.length; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].ims[j].pref ? "* " : "&nbsp;&nbsp;") + list[i].ims[j].type +
	              ": " + list[i].ims[j].value + "<br>";
	        }
	        if ((list[i].organizations instanceof Array) && list[i].organizations.length > 0)
	        {
	          contactString += "<b>Organizations:</b><br>";
	          for ( var j = 0; j < list[i].organizations.length && list[i].organizations[j].name != undefined; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].organizations[j].pref ? "* " : "&nbsp;&nbsp;") +
	              list[i].organizations[j].type + ": " + list[i].organizations[j].name + "<br>";
	        }
	        console.log("Photoes=" + list[i].photos);

	        if ((list[i].photos instanceof Array) && list[i].photos.length > 0)
	        {
	          contactString += "<b>Picture:</b><br>";
	          for ( var j = 0; j < list[i].photos.length; j++)
	          {
	            if(list[i].photos[j].type=="file") //is base64 string
	             contactString += "<img src=\"data:image/png;base64," + list[i].photos[j].value+"\" alt=\"Image\"><br>";

	            else if(list[i].photos[j].type == "url") //is an URL
	                      contactString += "<img src=\"" + list[i].photos[j].value + "\" alt=\"Image\"><br>";

	           //TODO: quick and dirty solution for android issue. Photos arrays starts as array and get here as object
	           else { //if (/*(list[i].photos instanceof Object) &&*/ list[i].photos.value) {
	            var photo = list[i].photos[j].value;
	            contactString += "<img alt=\"Image\" , src=\"data:image\/png;base64, " + photo + "\" /><br>";
	          }
	          }
	        }

	        if ((list[i].urls instanceof Array) && list[i].urls.length > 0)
	        {
	          contactString += "<b>Websites:</b><br>";
	          for ( var j = 0; j < list[i].urls.length; j++)
	            contactString += "&nbsp;&nbsp;" + (list[i].urls[j].pref ? "* " : "&nbsp;&nbsp;") + list[i].urls[j].type +
	              ": <a href=\"" + list[i].urls[j].value + "\">" + list[i].urls[j].value + "</a><br>";
	        }

	        contactString += "<br>";
	        $('#contactList1').append(contactString);
	        console.log("HERE!!!");
	       // console.log("contactList1", $('#contactList1'));
	       // document.getElementById('contactList1').innerHTML = contactString;
	        //$('#contactList1').append("<br>");
	      }       
	    }
	    else
	      $('#contactList1').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
	  } 
});
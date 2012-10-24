$(document).ready(function() {
	// $('#contactList1').html("Contact data" + recentService);
	 
	 $('#btnShowContact').bind('click', findByDisplayName );
       
	
	 console.log("personName=", personName);
	 if(personName){
		 console.log("personName=", personName, recentService);
		 setTimeout(findByDisplayName, 1000);
	 }
	 
	 
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
	 
	// Print a contact list to HTML document
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
	                var contactString=" <b>Display Name: </b>";
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
	             contactString+="<img src=\"data:image/png;base64,"+list[i].photos[j].value+"\" alt=\"Image\"><br>";

	            else if(list[i].photos[j].type=="url") //is an URL
	                      contactString+="<img src=\""+list[i].photos[j].value+"\" alt=\"Image\"><br>";

	           //TODO: quick and dirty solution for android issue. Photos arrays starts as array and get here as object
	           else { //if (/*(list[i].photos instanceof Object) &&*/ list[i].photos.value) {
	            var photo = list[i].photos[j].value;
	            contactString+="<img alt=\"Image\" , src=\"data:image\/png;base64, "+photo+"\" /><br>";
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
	        $('#contactList1').append("<br>");
	      }       
	    }
	    else
	      $('#contactList1').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
	  } 
});
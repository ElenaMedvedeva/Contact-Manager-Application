var personName;
var selectedNumber;
var contactList;
var contactPage = "contact.html";
var parameters;
// Print a contact names to HTML document
function print_contact_names(list){
	$('#noSettingsMessage').hide();
  //alert("contact list size " + list.length)
  //clean then write
	contactList = list;
  document.getElementById('contactList').innerHTML = "";
  if (list.length > 0){
    for ( var i = 0; i < list.length; i++){
              console.log("list=" ,list[i]);
              var contactString=" <b>Display Name: </b>";
      var displayName = (list[i].displayName == "" ? "<b>Anonymous</b>" :list[i].displayName );
      contactString += "<a href='#contact' number='" + i + "' class=\"contact\">" + displayName +"</a>";
      //onclick='setPage(\"person.html\")\'
      $('#contactList').append(contactString);
      $('#contactList').append("<br>");
    }       
  }
  else
    $('#contactList').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
}; 

function logMessage(msg) {
    if (msg) {
      $('#message').append('<li>' + msg + '</li>');
    }
  };

function printInfo(data) {
    logMessage(data.payload.message);
  };

function unreachableService(data) {
	document.getElementById('connectionInfo').innerHTML = "PROBLEM: Service unreachable";
  };


  
  function handle_authentication_query() // see function
  {
	  $("#connectionInfo").append("Connected to:<br/>");
	  if(contacManager.permissions.type == "remote"){			 
			 $("#connectionInfo").append("Gmail <br/> as " + contacManager.permissions.usr);
		 } else {
			 $("#connectionInfo").append("Thunderbird <br/> as " + contacManager.permissions.addressBookName);
		 }
   
  };
  
  function setMainPage(page){
	  console.log('from setPage');
    var port = window.location.port;
    if (typeof port === "undefined") {
      port = 8080;
    }
    console.log("!!!from setPage ", "port=", port);
    var fetch = 'http://'+ window.location.hostname+':'+ port+'/client/Contact-Manager-Application/'+page;
    console.log("!!!from setPage ", "fetch=", fetch);
    $.get(page, {}, function(reply) {
  	 // console.log("Reply=",reply);
      $('#main').html( reply );
    }, "html");
  };
  
  function setPage(displayName, page){
	  console.log('from setPage');
      var port = window.location.port;
      if (typeof port === "undefined") {
        port = 8080;
      }
      console.log("!!!from setPage ", "port=", port);
      var fetch = 'http://'+window.location.hostname+':'+ port+'/client/Contact-Manager-Application/'+page;
      console.log("!!!from setPage ", "fetch=", fetch);
      $.get(page, {}, function(reply) {
    	  console.log("Reply=",reply);
        $('#main').html('<article class="module width_full"><header><h3>' + displayName +
                '</h3></header>'+ reply + '</article>');
    	 // $('#main').html( reply );
      }, "html");
    };

$(document).ready(function() {
	 webinos.session.addListener('registeredBrowser',TwitterHelper.init);
	 webinos.session.addListener('registeredBrowser',  function(){
		 setMainPage("allContacts.html");				
	});
	
	/*$('#cnt_remote').bind('click', function()
	{
			       console.log('Remote methode');
			       $('#remoteAuth ').show();
			       $('#localAuth').hide();

	});

	 $('#cnt_local').bind('click', function()
	{
			      console.log('Local methode');
			      $('#localAuth').show();
			      $('#remoteAuth ').hide();
	});*/
	 
	 
	 $('#btnMainPage').bind('click', function() {
		 	console.log("button clicked");
	      setMainPage("allContacts.html");
	    });
	 $('#btnSearchPage').bind('click', function() {
		 	console.log("button clicked");
	      setMainPage("searchPage.html");
	    });
    webinos.session.addListener('info', printInfo);
    
    //new page for person
	  $('a.contact').live('click', function(element) {
	  	  console.log("person clicked = ", $(this).html().trim(), "number=", $(this).attr("number"));
	  	  selectedNumber =  $(this).attr("number");
	  	  var displayName = $(this).html().trim();
	  	  personName = displayName;
	  	  setPage(displayName, contactPage);
	  	});

	 /* $('#btnSaveSettings').bind('click', function() {
		 	console.log("button clicked", storer);
		 	storer.saveEditSetting();
	  });*/
	  $('#btnOpenSettings').bind('click', function() {
		  setMainPage("settings.html");
	   });
	  
	  

//  function authenticate_cb()
 /* $('#btnAuthenticate').bind('click', function()
  {
	  storer.getSettings(function (data) {
		 
		  
		  console.log("Settings!!!! ", data);
		  contacManager.permissions = data;
		     
	      contacManager.getContacts(print_contact_names);
	      console.log("contacManager.contactService",contacManager.contactService);
	        
	    }, function (err) {
	    	
	         $("#contactList").text("No settings found!");
	        console.log("Error:  " + err);
	    });   
      
     
  });*/

  

  

  
  });

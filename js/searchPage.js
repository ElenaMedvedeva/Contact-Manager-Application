//var personName;
//var selectedNumber;
//var contactPage = "contact.html";
$(document).ready(function() {	
			  //function find_contacts_cb()
			  $('#btnFindServiceContacts').bind('click', function() {			   
			    var result = false;
			    if (contacManager.contactService)//(contactsService[0])
			    {
			    	contacManager.permissions.fields = {};
			        search_enterd = false;
			        if ($('#findContactDisplayName').val() != ""){
			        	contacManager.permissions.fields["displayName"] = $('#findContactDisplayName').val().trim();
			                  search_enterd = true;
			            }
			        if ($('#findContactName').val() != ""){
			        	contacManager.permissions.fields["name"] = $('#findContactName').val().trim();
			                search_enterd = true;
			          }
			        if ($('#findContactEmail').val() != ""){
			        	contacManager.permissions.fields["emails"] = $('#findContactEmail').val().trim();
			          search_enterd = true;
			          }
			        if ($('#findContactAddress').val() != ""){
			        	contacManager.permissions.fields["addresses"] = $('#findContactAddress').val().trim();
			          search_enterd = true;
			          }
			        if ($('#findContactPhone').val() != ""){
			        	contacManager.permissions.fields["phoneNumbers"] = $('#findContactPhone').val().trim();
			          search_enterd = true;
			          }
			          if(!search_enterd){
			          alert('Enter the value into search field')
			          }   else {

			     /* if ( contacManager.permissions.type=='remote'){
			    	  usr = $('#usernameText').val();
			          pwd = $('#passwordText').val();
			          parameters.usr = usr;
			          parameters.pwd = pwd;
			          parameters.type = "remote";
			       
			      }
			      else if (contacManager.permissions.type=='local'){
			    	  
			          parameters.addressBookName = contacManager.permissions.;
			          parameters.type = "local";
			        //contactsService[0]			       		      
			       }*/
			    //  contacManager.permissions = parameters;
			      
			      contacManager.getContacts(printContactNames); 
			    }
			    }
			  });
			  
			  //new page for person
			  $('a.contact').live('click', function(element) {
			  	  console.log("person clicked = ", $(this).html().trim(), "number=", $(this).attr("number"));
			  	  selectedNumber =  $(this).attr("number");
			  	  var displayName = $(this).html().trim();
			  	  personName = displayName;
			  	  setPage(displayName, contactPage);
			  	});

			 
			  
			  //function format_search(search) 
			  //{
			  //return "%" + search + "%";
			  //}		 
			  
			  
			  
			  function setPage(displayName, page) {
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
			    
			  // Print a contact names to HTML document
			  function printContactNames(list) {
			    //alert("contact list size " + list.length)
			    //clean then write
				  contactList = list;
			    document.getElementById('contactList').innerHTML = "";
			    if (list.length > 0) {
			      for ( var i = 0; i < list.length; i++) {
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
			  } 
	
	
});

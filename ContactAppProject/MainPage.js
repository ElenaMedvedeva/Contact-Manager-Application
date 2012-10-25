var personName;
var contactList;
var selectedNumber;
$(document).ready(function() {
	function logMessage(msg) {
	      if (msg) {
	        $('#message').append('<li>' + msg + '</li>');
	      }
	    }
	 function printInfo(data) {
	      logMessage(data.payload.message);
	    }
	 $('#btnAddContact').bind('click', function()
			  {
			   parameters = {};
			    var result = false;
			    if (recentService)//(contactsService[0])
			    {
			        parameters.fields = {};
			        if ($('#findContactName').val() != "")
			          parameters.fields["name"] = $('#findContactName').val();
			        if ($('#findContactEmail').val() != "")
			          parameters.fields["emails"] = $('#findContactEmail').val();
			        if ($('#findContactAddress').val() != "")
			          parameters.fields["addresses"] = $('#findContactAddress').val();
			        if ($('#findContactPhone').val() != "")
			          parameters.fields["phoneNumbers"] = $('#findContactPhone').val();
			        if ($("input[@name='contactType']:checked").val() == 'remote')
			        {
			             parameters.type = "remote";
			        } else {
			             parameters.type = "local";
			         }
			          console.log('recentService', recentService)  ;
			          console.log('parameters', parameters) ;

			          //contactsService[0]
				   contact = recentService.createContact({
			         name: "John Doe"
			          });


			    }

			   });
			  

			    $('#btnAllServiceContacts').bind('click', function() {
			         parameters = {};
			         var result = false;
			          if (recentService)//(contactsService[0])
			          {
			          if ($("input[@name='contactType']:checked").val() == 'remote')
			        {
			             parameters.type = "remote";
			        } else {
			             parameters.type = "local";
			         }
			          recentService.isAlreadyAuthenticated(parameters, function(result)
			        {
			          //contactsService[0]
			        	  recentService.find(parameters, print_contact_names);
				  
			        });
			        }

			    });

			  //function find_contacts_cb()
			  $('#btnFindServiceContacts').bind('click', function()
			  {
			    parameters = {};
			    var result = false;
			    if (recentService)//(contactsService[0])
			    {
			        parameters.fields = {};
			        search_enterd = false;
			        if ($('#findContactDisplayName').val() != ""){
			            parameters.fields["displayName"] = $('#findContactDisplayName').val().trim();
			                  search_enterd = true;
			            }
			        if ($('#findContactName').val() != ""){
			          parameters.fields["name"] = $('#findContactName').val().trim();
			                search_enterd = true;
			          }
			        if ($('#findContactEmail').val() != ""){
			          parameters.fields["emails"] = $('#findContactEmail').val().trim();
			          search_enterd = true;
			          }
			        if ($('#findContactAddress').val() != ""){
			          parameters.fields["addresses"] = $('#findContactAddress').val().trim();
			          search_enterd = true;
			          }
			        if ($('#findContactPhone').val() != ""){
			          parameters.fields["phoneNumbers"] = $('#findContactPhone').val().trim();
			          search_enterd = true;
			          }
			          if(!search_enterd){
			          alert('Enter the value into search field')
			          }   else {

			      if ($("input[@name='contactType']:checked").val() == 'remote')
			      {
			        parameters.type = "remote";

			        //contactsService[0]
				recentService.isAlreadyAuthenticated(parameters, function(result)
			        {
			          //contactsService[0]
				  recentService.find(parameters, print_contact_names);
			        });
			      }
			      else if ($("input[@name='contactType']:checked").val() == 'local')
			      {
			        parameters.type = "local";
			        console.log("parameters", parameters);
			        //contactsService[0]
			        recentService.isAlreadyAuthenticated(parameters, function(result)
			        {
			          //contactsService[0]
						recentService.find(parameters, print_contact_names);
			        });
			      }
			    }
			    }
			  });
			  
			  //new page for person
			  $('a.person').live('click', function(element) {
			  	  console.log("person clicked = ", $(this).html().trim(), "number=", $(this).attr("number"));
			  	  selectedNumber =  $(this).attr("number");
			  	  var displayName = $(this).html().trim();
			  	  personName = displayName;
			  	  setPage(displayName, "person.html");
			  	});

			 
			  
			  //function format_search(search) 
			  //{
			  //return "%" + search + "%";
			  //}		 
			  
			  
			  
			  function setPage(displayName, page){
				  console.log('from setPage');
			      var port = window.location.port;
			      if (typeof port === "undefined") {
			        port = 8080;
			      }
			      console.log("!!!from setPage ", "port=", port);
			      var fetch = 'http://'+window.location.hostname+':'+ port+'/client/Contact-Manager-Application/ContactAppProject/'+page;
			      console.log("!!!from setPage ", "fetch=", fetch);
			      $.get(page, {}, function(reply) {
			    	  console.log("Reply=",reply);
			        $('#main').html('<article class="module width_full"><header><h3>' + displayName +
			                '</h3></header>'+ reply + '</article>');
			    	 // $('#main').html( reply );
			      }, "html");
			    };
			    
			  // Print a contact names to HTML document
			  function print_contact_names(list){
			    //alert("contact list size " + list.length)
			    //clean then write
				  contactList = list;
			    document.getElementById('contactList').innerHTML = "";
			    if (list.length > 0){
			      for ( var i = 0; i < list.length; i++){
			                console.log("list=" ,list[i]);
			                var contactString=" <b>Display Name: </b>";
			        var displayName = (list[i].displayName == "" ? "<b>Anonymous</b>" :list[i].displayName );
			        contactString += "<a href='#person' number='" + i + "' class=\"person\">" + displayName +"</a>";
			        //onclick='setPage(\"person.html\")\'
			        $('#contactList').append(contactString);
			        $('#contactList').append("<br>");
			      }       
			    }
			    else
			      $('#contactList').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
			  } 
	
	
});
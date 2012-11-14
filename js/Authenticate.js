var recentService;
$(document).ready(function() {
    function logMessage(msg) {
      if (msg) {
        $('#message').append('<li>' + msg + '</li>');
      }
    }
    
    function setMainPage(page){
		  console.log('from setPage');
	      var port = window.location.port;
	      if (typeof port === "undefined") {
	        port = 8080;
	      }
	      console.log("!!!from setPage ", "port=", port);
	      var fetch = 'http://'+window.location.hostname+':'+ port+'/client/Contact-Manager-Application/'+page;
	      console.log("!!!from setPage ", "fetch=", fetch);
	      $.get(page, {}, function(reply) {
	    	 // console.log("Reply=",reply);
	        $('#main').html( reply );
	      }, "html");
	    };
	 
	 $('#btnMainPage').bind('click', function() {
		 	console.log("button clicked");
	      setMainPage("mainPage.html");
	    });
   

    function fillPZAddrs(data) {
      var pzpId = data.from;
      var pzhId, connectedPzh , connectedPzp;
     // if (pzpId !== "virgin_pzp") {
       // pzhId = data.payload.message.pzhId;
        connectedPzp = data.payload.message.connectedPzp; // all connected pzp
        connectedPzh = data.payload.message.connectedPzh; // all connected pzh

        logMessage('registeredBrowser msg from ' + pzpId);
        console.log('++registeredBrowser msg from ' + pzpId);
      //}
    }
    webinos.session.addListener('registeredBrowser', fillPZAddrs);    
    webinos.session.addListener('registeredBrowser',TwitterHelper.init); 

    function updatePZAddrs(data) {
        if(typeof data.payload.message.pzp !== "undefined") {
      logMessage('new pzp ' + data.payload.message.pzp);
        } else {
      logMessage('new pzh ' + data.payload.message.pzh);
        }
    }
    webinos.session.addListener('update', updatePZAddrs);


    function printInfo(data) {
      logMessage(data.payload.message);
    }
    webinos.session.addListener('info', printInfo);

    var contactsService = {};
   // var recentService;
   

    $('#btnFindService').bind('click', function() {
      console.log('********ContactsClient: find service button clicked');
      contactsService = {};
      recentService = null;
      $('#getContactsServices').empty();

      webinos.discovery.findServices(
      new ServiceType('http://www.w3.org/ns/api-perms/contacts'),
      {
        onFound: function (service) {
          console.log("Service: ",service," found!!");
          contactsService[service.serviceAddress] = service;
          $('#getContactsServices').append($('<option>' + service.serviceAddress + '</option>'));
          console.log("ServiceAddress ",  service.serviceAddress);
        }
      });
    });

    $("#getContactsServices option").live('click', function(event) {
      $(this).parent().attr("recent", $(this).val());
    });


    $('#btnBindService').bind('click', function() {
      console.log("**Bind button clicked**")
      recentService = contactsService[$('#getContactsServices').attr('recent')];
      recentService.bindService({onBind:function(service) {
      logMessage('CONTACTS API ' + service.api + ' bound.');
      $('#html_contacts').html("<i><b>Contacts</b></i> webinos rpc service found!<br>Please select contacts type, fill the text areas then press <i>Authenticate</i> button above.");
        }});
    });
    
    function handle_authentication_query(status) // see function
    {
      console.log('------------------handle_auth : '+status);
      if (status)
      {
        if ($("input[@name='contactType']:checked").val() == 'remote')
          $('#authStatus').html("<font color='#00CC00'>Logged in GMail</font>");
        else if ($("input[@name='contactType']:checked").val() == 'local')
          $('#authStatus').html("<font color='#AACC00'>Address Book Open</font>");
      }
      else
//         document.getElementById('authStatus').innerHTML = "<font color='#FF0000'><b><u>" + "CANNOT" + "</u>"
//           + "Authenticate: check GMail username and password or address book file name" + "</b></font>";
        $('#authStatus').html("<font color='#FF0000'><b><u> CANNOT </u>Authenticate: check GMail username and password or address book file name</b></font>");
    }


//  function authenticate_cb()
  $('#btnAuthenticate').bind('click', function()
  {
    if(recentService) //(contactsService[0])
    {
      parameters = {};
      if ($("input[@name='contactType']:checked").val() == 'remote')
      {
        usr = $('#usernameText').val();
        pwd = $('#passwordText').val();
        parameters.usr = usr;
        parameters.pwd = pwd;
        parameters.type = "remote";

      }
      else if ($("input[@name='contactType']:checked").val() == 'local')
      {
        addressBookName = $('#addressBookNameText').val();
        parameters.addressBookName = addressBookName;
        parameters.type = "local";
      }

      //contactsService[0]
      recentService.authenticate(parameters, handle_authentication_query)

    }
    else
    {
      document.getElementById('html_contacts').innerHTML = "PROBLEM: Service unreachable";
    }
  });

  //function get_contact_list_cb()
  $('#btnContacts').bind('click', function()
  {
    parameters = {};
    var result = false;
    if (recentService) //(contactsService[0])
    {
      if ($("input[@name='contactType']:checked").val() == 'remote')
      {
        parameters.type = "remote";
        //contactsService[0].
        recentService.isAlreadyAuthenticated(parameters, function(result)
        {
          //contactsService[0].
          recentService.getAllContacts(parameters, print_contact_names);
        });
      }
      else if ($("input[@name='contactType']:checked").val() == 'local')
      {
        parameters.type = "local";
        //contactsService[0].
        recentService.isAlreadyAuthenticated(parameters, function(result)
        {
          //contactsService[0]
          recentService.getAllContacts(parameters, print_contact_names);
        });
      }
    }
  });

  $('#cnt_remote').bind('click', function()
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
  });

  
  });

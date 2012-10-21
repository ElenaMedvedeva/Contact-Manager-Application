$(document).ready(function() {
    function logMessage(msg) {
      if (msg) {
        $('#message').append('<li>' + msg + '</li>');
      }
    }

    function fillPZAddrs(data) {
      var pzpId = data.from;
      var pzhId, connectedPzh , connectedPzp;
      if (pzpId !== "virgin_pzp") {
        pzhId = data.payload.message.pzhId;
        connectedPzp = data.payload.message.connectedPzp; // all connected pzp
        connectedPzh = data.payload.message.connectedPzh; // all connected pzh

        logMessage('registeredBrowser msg from ' + pzpId);
        console.log('++registeredBrowser msg from ' + pzpId);
      }
    }
    webinos.session.addListener('registeredBrowser', fillPZAddrs);

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
    var recentService;



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

    $('#registerBrowser').bind('click', function() {
      var options = {type: 'prop', payload: {status:'registerBrowser'}};
      webinos.session.message_send(options);
    });


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
          recentService.getAllContacts(parameters, print_contact_list);
        });
      }
      else if ($("input[@name='contactType']:checked").val() == 'local')
      {
        parameters.type = "local";
        //contactsService[0].
        recentService.isAlreadyAuthenticated(parameters, function(result)
        {
          //contactsService[0]
          recentService.getAllContacts(parameters, print_contact_list);
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
	  recentService.find(parameters, print_contact_list);
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
        if ($('#findContactName').val() != ""){
          parameters.fields["name"] = $('#findContactName').val();
                search_enterd = true;
          }
        if ($('#findContactEmail').val() != ""){
          parameters.fields["emails"] = $('#findContactEmail').val();
          search_enterd = true;
          }
        if ($('#findContactAddress').val() != ""){
          parameters.fields["addresses"] = $('#findContactAddress').val();
          search_enterd = true;
          }
        if ($('#findContactPhone').val() != ""){
          parameters.fields["phoneNumbers"] = $('#findContactPhone').val();
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
	  recentService.find(parameters, print_contact_list);
        });
      }
      else if ($("input[@name='contactType']:checked").val() == 'local')
      {
        parameters.type = "local";

        //contactsService[0]
	recentService.isAlreadyAuthenticated(parameters, function(result)
        {
          //contactsService[0]
	  recentService.find(parameters, print_contact_list);
        });
      }
    }
    }
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
//       document.getElementById('authStatus').innerHTML = "<font color='#FF0000'><b><u>" + "CANNOT" + "</u>"
//         + "Authenticate: check GMail username and password or address book file name" + "</b></font>";
      $('#authStatus').html("<font color='#FF0000'><b><u> CANNOT </u>Authenticate: check GMail username and password or address book file name</b></font>");
  }

  // Print a contact list to HTML document
  function print_contact_list(list)
  {
    //alert("contact list size " + list.length)
    //clean then write
    document.getElementById('contactList').innerHTML = "";
    if (list.length > 0)
    {
      for ( var i = 0; i < list.length; i++)
      {
        //        console.log(list[i]);
        var contactString = (list[i].displayName == "" ? "<b>Anonymous</b></br>" : "<b>Name: </b>" +
          list[i].displayName + "<br>");
        contactString += ((list[i].nickname == undefined || list[i].nickname == "") ? "" : "<b>Nickname: </b>" +
          list[i].nickname + "<br>");

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

        contactString += "<br>"
        $('#contactList').append(contactString);
        $('#contactList').append("<br>");
      }
    }
    else
      $('#contactList').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>");
  }
  });
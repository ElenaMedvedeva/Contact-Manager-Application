var contacManager = {}; 
contacManager.contactService = null; 
contacManager.permissions = null;
contacManager.list = null;

contacManager.getContactService = function(successcb, errorcb) {
    if (contacManager.contactService !== null) {
        successcb(contacManager.contactService);
        return;
    }
    var once = false;


    function find() {
        webinos.discovery.findServices(
        new ServiceType('http://www.w3.org/ns/api-perms/contacts'), {
            onFound: onServiceFound
        });
    }

    function onServiceFound(service) {
        if (!once) {
            once = true;
            bind(service);
        } else {
            console.log("Not bound : " + service.serviceAddress);
            errorcb("Failed to bind to webinos contacts service");
        }
    }

    function bind(service) {
        service.bindService({
            onBind: function (boundService) {
            	contacManager.contactService = boundService;
            	//$('#html_contacts').html("<i><b>Contacts</b></i> webinos rpc service found!<br>Please select contacts type, fill the text areas then press <i>Authenticate</i> button above.");
                successcb(boundService);
            }
        });
    }

    find();

};


contacManager.init = function(successcb, errorcb) {
	contacManager.getContactService(function (svc) {
		contacManager.contactService = svc;	
		document.getElementById('connectionInfo').innerHTML = ""
		 contacManager.contactService.authenticate(contacManager.permissions, successcb);	 
		 
		/* contacManager.contactService.isAlreadyAuthenticated(contacManager.permissions, function(result)
		{			 
			    	contacManager.contactService.find(contacManager.permissions, printContactNames);
		});*/
	 }, function (err) {
     console.log(err.code);
     console.log(err);
     errorcb(err);
 });
};

contacManager.getContacts = function(found) {	
	contacManager.init(handleAuthenticationQuery, unreachableService);
	contacManager.getContactService(function (svc) {
		contacManager.contactService.isAlreadyAuthenticated(contacManager.permissions, function(result){			 
		  contacManager.contactService.find(contacManager.permissions, found);
		});
	}, function (err) {
	     console.log(err.code);
	     console.log(err);
	     errorcb(err);
	 });
};
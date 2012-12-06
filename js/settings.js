$(document).ready(function() {
	$('#cnt_remote').bind('click', function() {
		console.log('Remote methode');
		$('#remoteAuth ').show();
		$('#localAuth').hide();

	});

	$('#cnt_local').bind('click', function() {
		console.log('Local methode');
		$('#localAuth').show();
		$('#remoteAuth ').hide();
	});
	
	 $('#btnSaveSettings').bind('click', function() {
		 	console.log("button clicked", storer);
		 	storer.saveEditSetting();
	  });
	 
	 $('#btnAuthenticate').bind('click', function() {
		 storer.getSettings(function (data) {
		 console.log("Settings!!!! ", data);
		 contacManager.permissions = data;		     
		 contacManager.getContacts(printContactNames);
		 console.log("contacManager.contactService",contacManager.contactService);				        
		}, function (err) {		    	
			$("#noSettings").text("No settings found!");
			        console.log("Error:  " + err);
		});      
			     
	});
	 
	 storer.getSettings(function (data) {		 
		  
		  console.log("Settings!!!! ", data);
		  if(data.type =="remote"){
			  $("#cnt_remote").attr("checked", "checked");;
			  $("#usernameText").val(data.usr);
			  $("#passwordText").val(data.pwd);
			 // console.log($("#usernameText"));
			  
			  
		  }else{
			  $("#cnt_local").attr("checked", "checked");;
			  $("#addressBookNameText").val(data.addressBookName);
			  //console.log($("#addressBookNameText"));			  
		  }	
		  $("input[@name='contactType']:checked").trigger('click');
	     
	        
	    }, function (err) {
	    	
	         $("#contactList").text("No settings found!");
	        console.log("Error:  " + err);
	    });   
	
});
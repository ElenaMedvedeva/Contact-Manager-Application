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
	    	
	         $("#settingsList").text("No settings found!");
	        console.log("Error:  " + err);
	    });  
	 
	 	storer.getSettingsList(function (data) {
			console.log("getSettingsList=", data);
			 document.getElementById('settingsList').innerHTML = "";
			 for ( var i = 0; i < data.length; i++){
				 if(data[i]){
					 $('#settingsList').append(data[i].name);
				     $('#settingsList').append("<br>");
				 }
			 }
		 	},
		 	function (err) {
		    	
		 		$("#settingsList").text("Error while loading settings!");
		 		console.log("Error:  " + err);
	    });   
	
});
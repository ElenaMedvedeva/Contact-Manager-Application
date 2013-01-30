$(document).ready(
		function() {
			console.log("settingsPage", $('#settingsPage'));
			$('#settingsPage').bind('click', function() {
				console.log("Clicked");
				setMainPage("settings.html");
			});
			/*storer.getSettings(function(data) {
				
				console.log("Settings!!!! ", data);
				contacManager.permissions = data;

				contacManager.getContacts(printContactNames);
				console.log("contacManager.contactService",
						contacManager.contactService);

			}, function(err) {

				$("#contactList").text("No settings found!");
				$('#noSettingsMessage').show();
				console.log("Error:  " + err);
			});*/
			/*storer.getSettingsAllList(function(data1) {

				console.log("Settings!---- ", data1);
				contacManager.permissions = data1;
				$("#contactList").append("New contact list<br>");
			

				contacManager.getContacts(printContactNames);
				console.log("contacManager.contactService",
						contacManager.contactService);

			}, function(err) {

				$("#contactList").text("No settings found!");
				$('#noSettingsMessage').show();
				console.log("Error:  " + err);
			});*/
			
			
			///1st variant(without array)
			/*storer.getSettingsAllList_1(function(data) {
				
				console.log("here! ", data);
				contacManager.permissions = data;
				$("#contactList").append("New contact list<br>");
			

				contacManager.getContacts(printContactNames);
				console.log("contacManager.contactService",
						contacManager.contactService);

			}, function(err) {

				$("#contactList").text("No settings found!");
				$('#noSettingsMessage').show();
				console.log("Error:  " + err);
			});
			*/
			///2nd variant (with array)
			storer.getSettingsAllList_2(function(data) {
				
				console.log("here! ", data);
				for (var i=0; i< data.length; i++){
					contacManager.permissions = data[i];
					$("#contactList").append("New contact list type = " + data[i].type + "<br/>");
					console.log("getting the contacts from ", data[i]);
			

					contacManager.getContacts(printContactNames);
					console.log("contacManager.contactService",
							contacManager.contactService);
				}

			}, function(err) {

				$("#contactList").text("No settings found!");
				$('#noSettingsMessage').show();
				console.log("Error:  " + err);
			});
			
			
			
			

		});
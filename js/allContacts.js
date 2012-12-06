$(document).ready(
		function() {
			console.log("settingsPage", $('#settingsPage'));
			$('#settingsPage').bind('click', function() {
				console.log("Clicked");
				setMainPage("settings.html");
			});
			storer.getSettings(function(data) {
				
				console.log("Settings!!!! ", data);
				contacManager.permissions = data;

				contacManager.getContacts(printContactNames);
				console.log("contacManager.contactService",
						contacManager.contactService);

			}, function(err) {

				$("#contactList").text("No settings found!");
				$('#noSettingsMessage').show();
				console.log("Error:  " + err);
			});

		});
/* This file uses globals.  Read the globals.js to check which ones */

var storer = {};
storer.fileService = null;
storer.fileSystem = null;

storer.createSettingObject = function() {
	parameters = {};
    if ($("input[@name='contactType']:checked").val() == 'remote') {
      usr = $('#usernameText').val();
      pwd = $('#passwordText').val();
      parameters.usr = usr;
      parameters.pwd = pwd;
      parameters.type = "remote";

    }
    else if ($("input[@name='contactType']:checked").val() == 'local') {
      addressBookName = $('#addressBookNameText').val();
      parameters.addressBookName = addressBookName;
      parameters.type = "local";
    }
    return parameters;
};

storer.getSettings = function(successcb, errorcb){
	 storer.getFileService(function (svc) {
		 storer.getDirectories(storer.fileService, function (fs, dirs) {			 
			 dirs.settingsdir.getFile("settings.json",
					 {create: false},
					 function(fileEntry) {
						 storer.fileToObject(fs,fileEntry,successcb, errorcb);
					 },
			            errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
	    }, function (err) {
	        console.log(err.code);
	        errorcb(err);
	    });
};

storer.getSettingsAllList_1 = function(successcb, errorcb) {
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.getData(storer.fileSystem, dirs, function (data) {
            	console.log("from inside ", data.length);
            	 for ( var i = 0; i < data.length; i++){
					 if(data[i]){
						 console.log("data_i" , data[i]);
						 dirs.settingsdir.getFile(data[i].name,
								 {create: false},
								 function(fileEntry) {
									 storer.fileToObject(fs,fileEntry,successcb, errorcb);
								 },
								 errorcb);
					 }
            	 }   			
           
            }, function (err) {
                console.log(err.code);
                errorcb(err);
            });        
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
};


storer.arrayToObject = function(arr, idfield) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i][idfield];
        var val = arr[i];
        obj[key] = val;
    }
    return obj;
};

storer.getSettingsAllList_2 = function(successcb, errorcb) {
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.getData(storer.fileSystem, dirs, function (data) {
            	console.log("from inside ", data.length);
            	 storer.processReminderFiles(fs, data, successcb, errorcb);		
           
            }, function (err) {
                console.log(err.code);
                errorcb(err);
            });        
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
};



storer.processReminderFiles = function(fs, reminderFile,  successcb, errorcb) {
    //console.log("Reading reminder files - " + reminderFile.length + " - in total");
    storer.listOfFilesToObjects(fs, reminderFile, function (fs, fileEntry, successcb, errorcb) {
        storer.fileToObject( fs, fileEntry, successcb, errorcb);
    }, successcb, errorcb);
};


storer.listOfFilesToObjects = function(fs, fileArray, converter, successcb, errorcb) {
    if (fileArray.length > 0) {
        var currFile = fileArray.pop();
        storer.listOfFilesToObjects(fs, fileArray, converter, function (rest) {
            converter(fs, currFile, function (currObj) {
                rest.push(currObj);
                successcb(rest);
            }, errorcb);
        }, errorcb);
    } else {
        successcb([]);
    }
};

storer.getSettingsList = function(successcb, errorcb) {
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.getData(storer.fileSystem, dirs, successcb, errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
};

storer.getSettingsAllList = function(successcb, errorcb) {
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
            storer.getData(storer.fileSystem, dirs, successcb, errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
};

storer.getData = function(fs, dirs, successcb, errorcb) {
	console.log("from getData");
	storer.getFiles(fs, dirs.settingsdir,successcb, errorcb);    
};

storer.fileToObject = function(fs, fileEntry, successcb, errorcb) {
    fileEntry.file(function (file) {
        var reader = new window.FileReader(fs);
        reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE && evt.target.result !== "") {
                var setting = JSON.parse(evt.target.result);
                successcb(setting);
            } else {
                errorcb("You're probably using Chrome, which isn't supported as this local file uses the file API");
            }
        };
        reader.readAsText(file);
    }, errorcb);
};


storer.saveEditSetting = function() {
    var add = storer.createSettingObject();

   console.log("Adding: " + JSON.stringify(add));
        storer.saveSettings(add, function () {            
           console.log("Settings stored!");
        }, function (err) {
            alert("Failed to store settings");
        });
};

storer.generateFileName = function(settings){
	console.log("from generateFileName", settings);
	var result = "settings.json";
	if(settings) {
		if(settings.type == "remote") {
			result = "settings_" + settings.type + "_" + settings.usr + ".json"; 	
		} else {
			var address = settings.addressBookName;
			var addressReplaced = address.replace(/\\/g,"_").replace(":","."); 
			result = "settings_" + settings.type + "_" +  addressReplaced + ".json";
		}
	}
	console.log("generateFileName=", result);
	return result;	
};


/* use the FileAPI to save a settings to disk. */
storer.saveSettings = function(settings, successcb, errorcb) {
    //pre: the reminder's 'place' has been detatched
    console.log("Requested to save settings: ", settings);
    storer.getFileService(function (svc) {
        storer.getDirectories(storer.fileService, function (fs, dirs) {
             storer.saveTextFile(dirs.settingsdir,
            JSON.stringify(settings),
            storer.generateFileName(settings),
            successcb,
            errorcb);
        }, function (err) {
            console.log(err.code);
            errorcb(err);
        });
    }, function (err) {
        console.log(err.code);
        errorcb(err);
    });
};

storer.saveTextFile = function(dir, val, filename, successcb, errorcb) {
    dir.getFile(filename, {
        create: true
    }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function (e) {
                console.log('Write completed.');
                successcb();
            };

            fileWriter.onerror = function (e) {
                console.log('Write failed: ' + e.toString());
                errorcb(e);
            };

            var blob = new Blob([val], {
                type: 'text/plain'
            });

            fileWriter.write(blob);

        }, errorcb);

    }, errorcb);
};

storer.getDirectories = function(fileService, successcb, errorcb) {
    storer.getFileSystem(fileService, onInitFs, fsErrorHandler);

    function onInitFs(fs) {
        fileSystem = fs;
        fs.root.getDirectory(STORE_DIRECTORY, {
            create: true
        }, function (approot) {
             approot.getDirectory(SETTINGS_DIRECTORY, {
                    create: true
                }, function (settings) {
                    successcb(fs, {
                        "appdir": approot,
                        "settingsdir": settings                        
                    });
                }, fsErrorHandler);            
        }, fsErrorHandler);
    }

    function fsErrorHandler(err) {
        console.log("Failed to request file system");
        storer.errorHandler(err);
        errorcb(err);
    }
};

storer.getFiles = function(fs, dir, successcb, errorcb) {
    storer.getDirectoryContent(fs, dir, function (list) {
        var res = [];
        for (var i = 0; i < list.length; i++) {
            console.log("Found directory entry: " + list[i].name);
            if (list[i].isFile && (list[i].name.indexOf("~") < (list[i].name.length - 1))) {
                res.push(list[i]);
            }
        }
        successcb(res);
    }, errorcb);
};

storer.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
};


storer.getDirectoryContent = function(fs, dir, successcb, errorcb) {
    var dirReader = dir.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function () {
        dirReader.readEntries(function (results) {
            if (!results.length) {
                successcb(entries.sort());
            } else {
                //console.log("Adding directory entries");
                entries = entries.concat(storer.toArray(results));
                readEntries();
            }
        }, errorcb);
    };

    readEntries();
};


storer.getFileSystem = function(fileService, successcb, errorcb) {
    if (storer.fileSystem !== null) {
        successcb(fileSystem);
    } else {
        fileService.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, successcb, errorcb);
    }
};

storer.getFileService = function(successcb, errorcb) {
    if (storer.fileService !== null) {
        successcb(storer.fileService);
        return;
    }
    var once = false;


    function find() {
        webinos.discovery.findServices(
        new ServiceType('http://webinos.org/api/file'), {
            onFound: onServiceFound
        });
    }

    function onServiceFound(service) {
        if (!once) {
            once = true;
            bind(service);
        } else {
            console.log("Not bound : " + service.serviceAddress);
            errorcb("Failed to bind to webinos file service");
        }
    }

    function bind(service) {
        service.bindService({
            onBind: function (boundService) {
                storer.fileService = boundService;
                successcb(boundService);
            }
        });
    }

    find();

};

storer.errorHandler = function(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }

    console.log('Error: ' + msg);
    return "Error: " + msg;
};

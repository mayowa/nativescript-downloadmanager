# Nativescript DownloadManager

DownloadManager is a library that allows downloading files from Nativescript in Android using the Android Download Manager. Why not use Http.getFile() ? Pretty much because as i see it is pretty much broken if you want to download something thats not [just a few kilobytes](https://github.com/NativeScript/NativeScript/issues/3314/).

## Installing

1. `tns plugin add nativescript-downloadmanager`
2. Make sure the following permissions are in your android manifest

	```
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.INTERNET"/>
	```
	
## Usage

Usage is pretty much straightforward: This is a commented example on top of a simplified version of the default Hello world application (aka. just removed the tap count stuff and added a download method). 

**TLDR:** check the download method.

```TypeScript
import {Observable} from 'data/observable';
// Import the class.
import {DownloadManager,DownloadOptions} from 'nativescript-downloadmanager';

export class HelloWorldModel extends Observable {

    private _message: string;

    constructor() {
        super();
    }

    public download() {
    	// Instantiate a Download Manager. The way it's done (it uses a BroadcastReceiver), 
    	// it's mean to be kept alive during all the application lifetime. But we can kill unsubscribe 
        let dm = new DownloadManager();
        // We download a file, in this example a 10mb test file. 
        // This is the Most simple version of doing it.
        // Aside from that there are optional parameters for. Directory (always inside android/data/yourapp/),
        // The file name, and title and description for the notification bar. By default it uses the file name 
        // as title, and no description.
	let options:DownloadOptions={
		directory:"download",//directory to be created in android/data/yourapp/files/
		filename:"testFile",//set filename
		title:"testFile",//Set the title of this download, to be displayed in notifications (if enabled). If no title is given, a default one will be assigned based on the download filename, once the download starts.
		description:"Downloading Image.",// Set a description of this download, to be displayed in notifications (if enabled)
		allowScanningByMediaScanner:true,// If the file to be downloaded is to be scanned by MediaScanner 
	      };
        let downloadId=dm.downloadFile("http://cachefly.cachefly.net/10mb.test", options,function(result,uri) {
            // result is a boolean, if the download was successful, it will return true
            console.log(result);
            // Uri in file:// format of the downloaded file.
            console.log(uri);
            // unregisterBroadcast is used to unregister the broadcast (For example if you just want to 
            // download a single file).
            dm.unregisterBroadcast();
        })
    }
}
```
## DownloadOptions
```
directory?:string, //directory to be created in android/data/yourapp/files/
filename?:string, //set filename
title?:string, //Set the title of this download, to be displayed in notifications (if enabled). If no title is given, a default one will be assigned based on the download filename, once the download starts.
description?:string, // Set a description of this download, to be displayed in notifications (if enabled)
header?:{header:string,value:string}, //Add an HTTP header to be included with the download request. The header will be added to the end of the list.
allowScanningByMediaScanner?:boolean, // If the file to be downloaded is to be scanned by MediaScanner 
disallowOverMetered?:boolean, // Set whether this download may proceed over a metered network connection. By default, metered networks are allowed.
disallowOverRoaming?:boolean, // Set whether this download may proceed over a roaming connection. By default, roaming is allowed.
mimeType?:string, // Set the MIME content type of this download. This will override the content type declared in the server's response.
notificationVisibility?:notificationVisibility, //If enabled, the download manager posts notifications about downloads through the system 
hideInDownloadsUi?:boolean //Set whether this download should be displayed in the system's Downloads UI. visible by default.
/*API 24
requiresCharging?:boolean, //Specify that to run this download, the device needs to be plugged in. This defaults to false.
requiresDeviceIdle?:boolean, //Specify that to run, the download needs the device to be in idle mode. This defaults to false. 
*/

```


## Todo

* More testing.
*  Document it better.
* Make some kind of iOS emulatedish version.

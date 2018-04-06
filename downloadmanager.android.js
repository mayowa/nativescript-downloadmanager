"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application = require("application");
var notificationVisibility;
(function (notificationVisibility) {
    notificationVisibility[notificationVisibility["VISIBILITY_HIDDEN"] = 2] = "VISIBILITY_HIDDEN";
    notificationVisibility[notificationVisibility["VISIBILITY_VISIBLE"] = 0] = "VISIBILITY_VISIBLE";
    notificationVisibility[notificationVisibility["VISIBILITY_VISIBLE_NOTIFY_COMPLETED"] = 1] = "VISIBILITY_VISIBLE_NOTIFY_COMPLETED";
})(notificationVisibility = exports.notificationVisibility || (exports.notificationVisibility = {}));
var DownloadManager = (function () {
    function DownloadManager() {
        this.manager = Application.android.context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
        this.downloads = new Map();
        this.registerBroadcast();
    }
    DownloadManager.prototype.downloadFile = function (url, options, cb) {
        var directory = options.directory ? options.directory : 'downloads';
        var filename = options.filename ? options.filename : url.substring(url.lastIndexOf('/') + 1);
        var title = options.title ? options.title : filename;
        var uri = android.net.Uri.parse(url);
        var req = new android.app.DownloadManager.Request(uri);
        req.setDestinationInExternalFilesDir(Application.android.context, directory, filename);
        req.setTitle(title);
        if (options.description)
            req.setDescription(options.description);
        if (options.header) {
            var header = options.header.header;
            var value = options.header.value;
            req.addRequestHeader(header, value);
        }
        if (options.allowScanningByMediaScanner)
            req.allowScanningByMediaScanner();
        if (options.disallowOverMetered)
            req.setAllowedOverMetered(false);
        if (options.disallowOverRoaming)
            req.setAllowedOverRoaming(false);
        if (options.mimeType)
            req.setMimeType(options.mimeType);
        if (options.notificationVisibility != undefined)
            req.setNotificationVisibility(options.notificationVisibility);
        if (options.hideInDownloadsUi)
            req.setVisibleInDownloadsUi(false);
        var id = this.manager.enqueue(req);
        this.downloads.set(id, cb);
        return id;
    };
    DownloadManager.prototype.registerBroadcast = function () {
        Application.android.registerBroadcastReceiver(android.app.DownloadManager.ACTION_DOWNLOAD_COMPLETE, this.handleDownloadEvent.bind(this));
    };
    DownloadManager.prototype.handleDownloadEvent = function (context, intent) {
        var query = new android.app.DownloadManager.Query();
        var id = intent.getExtras().getLong(android.app.DownloadManager.EXTRA_DOWNLOAD_ID);
        var c = this.manager.query(query);
        while (c.moveToNext()) {
            if (c.getLong(c.getColumnIndex(android.app.DownloadManager.COLUMN_ID)) == id) {
                var success;
                switch (c.getInt(c.getColumnIndex(android.app.DownloadManager.COLUMN_STATUS))) {
                    case android.app.DownloadManager.STATUS_SUCCESSFUL:
                        success = true;
                        break;
                    case android.app.DownloadManager.STATUS_FAILED:
                        success = false;
                        break;
                }
                if (this.downloads.has(id)) {
                    var uri = c.getString(c.getColumnIndex(android.app.DownloadManager.COLUMN_LOCAL_URI));
                    var cb = this.downloads.get(id);
                    cb(success, uri);
                }
                break;
            }
        }
        c.close();
    };
    DownloadManager.prototype.unregisterBroadcast = function () {
        Application.android.unregisterBroadcastReceiver(android.app.DownloadManager.ACTION_DOWNLOAD_COMPLETE);
    };
    return DownloadManager;
}());
exports.DownloadManager = DownloadManager;
//# sourceMappingURL=downloadmanager.android.js.map
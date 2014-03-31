var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },
    onDeviceReady: function() {
        //navigator.splashscreen.show();
        //navigator.splashscreen.hide();
        console.log("deviceReady was caled");
    }
};
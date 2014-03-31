window.fbAsyncInit = function() {
        FB.init({appId: '1437891089774348', status: true, cookie: true,
        xfbml: true});
    };
    console.log("FB SDK Loaded");
    (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol +
        '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
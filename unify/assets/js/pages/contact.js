var Contact = function () {

    return {
        
        //Map
        initMap: function () {
			var map;
			$(document).ready(function(){
			  map = new GMaps({
				div: '#map',
				lat: 28.425651,
				lng: 77.099613,
				zoom: 14
			  });
			   var marker = map.addMarker({
					lat: 28.425651,
					lng: 77.099613,
		            title: 'Twyst Technologies'
		        });
			});
        }

    };
}();
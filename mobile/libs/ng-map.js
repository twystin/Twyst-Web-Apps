var ngMap = angular.module('ngMap', []);  //map directives

ngMap.directive('map', ['Attr2Options', '$parse', 'NavigatorGeolocation', 'GeoCoder',
  function (Attr2Options, $parse, NavigatorGeolocation, GeoCoder) {
    var parser = new Attr2Options();

    return {
      restrict: 'AE',
      controller: ['$scope', function($scope) { //parent controller scope
        this.map = null;
        this.controls = {};
        this.markers = [];
        this.shapes = [];

        /**
         * Initialize map and events
         */ 
        this.initializeMap = function(scope, element, attrs) {
          var filtered = parser.filter(attrs);
          var mapOptions = parser.getOptions(filtered);
          var controlOptions = parser.getControlOptions(filtered);
          for (key in controlOptions) {
            mapOptions[key] = controlOptions[key];
          }

          var _this = this;

          if (!mapOptions.zoom) {
            mapOptions.zoom = 15 //default zoom
          }
          if (mapOptions.center instanceof Array) {
            var lat = mapOptions.center[0], lng= mapOptions.center[1];
            mapOptions.center = new google.maps.LatLng(lat,lng);
          } else {
            var savedCenter = mapOptions.center;
            delete mapOptions.center; //cannot show map with center as string
          }
          
          for (var name in this.controls) {
            mapOptions[name+"Control"] = this.controls[name].enabled === "false" ? 0:1;
            delete this.controls[name].enabled;
            mapOptions[name+"ControlOptions"] = this.controls[name];
          }
          
          console.log("mapOptions", mapOptions);
          // create a new div for map portion, so it does not touch map element at all.
          // http://stackoverflow.com/questions/20955356
          var el = document.createElement("div");
          el.style.width = "100%";
          el.style.height = "100%";
          element.prepend(el);
          _this.map = new google.maps.Map(el, mapOptions);

          if (typeof savedCenter == 'string') { //address
            GeoCoder.geocode({address: savedCenter})
              .then(function(results) {
                _this.map.setCenter(results[0].geometry.location);
              });
          } else if (!mapOptions.center) { //current location
            NavigatorGeolocation.getCurrentPosition()
              .then(function(position) {
                var lat = position.coords.latitude, lng = position.coords.longitude;
                _this.map.setCenter(new google.maps.LatLng(lat, lng));
              })
          }

          //map events
          var events = parser.getEvents(scope, filtered);
          console.log("mapEvents", events);
          for (var eventName in events) {
            google.maps.event.addListener(_this.map, eventName, events[eventName]);
          }

          //assign map to parent scope  
          scope.map = _this.map;

          return _this.map;
        },

        /**
         * Initial markers for this map
         * 
         * This does not work with async. actions. i.e, geocoder
         * because markers are not added at this moment
         * Thus, markers will be watched and updated with scope.$watch
         */
        this.addMarker = function(marker) {
            console.log(marker.position);
          marker.setMap(this.map);
          if (marker.centered) {
            this.map.setCenter(marker.position);
          }
          var len = Object.keys($scope.markers).length;
          $scope.markers[marker.id || len] = marker;
        };

        this.initializeMarkers = function() {
          $scope.markers = {};
          for (var i=0; i<this.markers.length; i++) {
            var marker = this.markers[i];
            this.addMarker(marker);
          }
        };

        /**
         * Initialize shapes for this map
         */
        this.initializeShapes = function() {
          $scope.shapes = {};
          for (var i=0; i<this.shapes.length; i++) {
            var shape = this.shapes[i];
            shape.setMap(this.map);
            $scope.shapes[shape.id || (i+1) ] = shape; // can have id as key
          }
        };

      }],
      link: function (scope, element, attrs, ctrl) {
        ctrl.initializeMap(scope, element, attrs);
        ctrl.initializeMarkers();
        ctrl.initializeShapes();
      }
    }; // return
  } // function
]);


ngMap.directive('marker', [ 'Attr2Options', 'GeoCoder', 'NavigatorGeolocation', 
  function(Attr2Options, GeoCoder, NavigatorGeolocation) {
    var parser = new Attr2Options();

    return {
      restrict: 'E',
      require: '^map',
      link: function(scope, element, attrs, mapController) {
        var filtered = new parser.filter(attrs);
        var markerOptions = parser.getOptions(filtered);
        var markerEvents = parser.getEvents(scope, filtered);

        var getMarker = function() {
          var marker = new google.maps.Marker(markerOptions);
          if (Object.keys(markerEvents).length > 0)
            console.log("markerEvents", markerEvents);
          for (var eventName in markerEvents) {
            google.maps.event.addListener(marker, eventName, markerEvents[eventName]);
          }
          return marker;
        };

        if (markerOptions.position instanceof Array) {

          var lat = markerOptions.position[0]; 
          var lng = markerOptions.position[1];
          markerOptions.position = new google.maps.LatLng(lat,lng);

          console.log("adding marker with options, ", markerOptions);
          var marker = getMarker();

          /**
           * ng-repeat does not happen while map tag is parsed
           * so treating it as asynchronous
           */
          if (markerOptions.ngRepeat) { 
            mapController.addMarker(marker);
          } else {
            mapController.markers.push(marker);
          }
        } else if (typeof markerOptions.position == 'string') { //need to get lat/lng

          var position = markerOptions.position;

          if (position.match(/^current/i)) { // sensored position

            NavigatorGeolocation.getCurrentPosition()
              .then(function(position) {
                var lat = position.coords.latitude, lng = position.coords.longitude;
                markerOptions.position = new google.maps.LatLng(lat, lng);
                var marker = getMarker();
                mapController.addMarker(marker);
              })

          } else { //assuming it is address

            GeoCoder.geocode({address: markerOptions.position})
              .then(function(results) {
                var latLng = results[0].geometry.location;
                markerOptions.position = latLng;
                var marker = getMarker();
                mapController.addMarker(marker);
              });

          } 
        } else {
          console.error('invalid marker position', markerOptions.position);
        }
      } //link
    } // return
  } // function
]);

ngMap.directive('shape', ['Attr2Options', function(Attr2Options) {
  var parser = new Attr2Options();
  
  var getPoints = function(array) { // return latitude && longitude points
    if (array[0] && array[0] instanceof Array) { // [[1,2],[3,4]] 
      return array.map(function(el) {
        return new google.maps.LatLng(el[0], el[1]);
      });
    } else {
      return new google.maps.LatLng(array[0],array[1]);      
    }
  };
  
  var getBounds = function(array) {
    var points = getPoints(array);
    return new google.maps.LatLngBounds(points[0], points[1]);
  };
  
  var getShape = function(shapeName, options) {
    switch(shapeName) {
      case "circle":
        options.center = getPoints(options.center);
        return new google.maps.Circle(options);
      case "polygon":
        options.paths = getPoints(options.paths);
        return new google.maps.Polygon(options);
      case "polyline": 
        options.path = getPoints(options.path);
        return new google.maps.Polyline(options);
      case "rectangle": 
        options.bounds = getBounds(options.bounds);
        return new google.maps.Rectangle(options);
      case "groundOverlay":
      case "image":
        var url = options.url;
        var bounds = getBounds(options.bounds);
        var opts = {opacity: options.opacity, clickable: options.clickable};
        return new google.maps.GroundOverlay(url, bounds, opts)
        return new google.maps.GroundOverlay(options);
    }
    return null;
  };
  
  return {
    restrict: 'E',
    require: '^map',
    link: function(scope, element, attrs, mapController) {
      var filtered = parser.filter(attrs);
      var shapeName = filtered.name;
      delete filtered.name;  //remove name bcoz it's not for options
      
      var shapeOptions = parser.getOptions(filtered);
      console.log('shape', shapeName, 'options', shapeOptions);
      var shape = getShape(shapeName, shapeOptions);
      if (shape) {
        mapController.shapes.push(shape);
      } else {
        console.error("shape", shapeName, "is not defined");
      }
      
      //shape events
      var events = parser.getEvents(scope, filtered);
      console.log("shape", shapeName, "events", events);
      for (var eventName in events) {
        google.maps.event.addListener(shape, eventName, events[eventName]);
      }
    }
   };
}]);

/**
 * this filters out angularJs specific attributes 
 * and returns attributes to be used as options
 */
ngMap.provider('Attr2Options', function() {

  this.$get = function() {
    return function() {

      /**
       * filtering attributes  
       *  1. skip all angularjs methods $.. $$..
       */
      this.filter = function(attrs) {
        var options = {};
        for(var key in attrs) {
          if (key.match(/^\$/));
          else
            options[key] = attrs[key];
        }
        return options;
      };

      /**
       * converting attributes hash to Google Maps API v3 options
       */
      this.getOptions = function(attrs) {
        var options = {};
        for(var key in attrs) {
          if (key.match(/^on[A-Z]/)) { //skip events, i.e. on-click
            continue;
          } else if (key.match(/ControlOptions$/)) { // skip controlOptions
            continue
          }

          var val = attrs[key];
          try { // 1. Number?
            var num = Number(val);
            if (isNaN(num))
              throw "Not a number";
            else 
              options[key] = num;
          } catch(err) { 
            try { // 2.JSON?
              options[key] = JSON.parse(val);
            } catch(err) {
              // 3. Object Expression. i.e. LatLng(80,-49)
              if (val.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/)) {
                try {
                  var exp = "new google.maps."+val;
                  options[key] = eval(exp); // Warning!! eval can be harmful
                } catch(e) {
                  options[key] = val;
                } 
              } else if (val.match(/^[A-Z][a-zA-Z0-9]+\.[A-Z]+$/)) {
                try {
                  options[key] = eval("google.maps."+val);
                } catch(e) {
                  options[key] = val;
                } 
              } else {
                options[key] = val;
              }
            }
          }
        }
        return options;
      };

      /**
       * converting attributes hash to scope-specific function 
       * scope is to validate a function within the scope
       */
      this.getEvents = function(scope, attrs) {
        var events = {};
        for(var key in attrs) {
          if (!key.match(/^on[A-Z]/)) { //skip events, i.e. on-click
            continue;
          }
          
          //get event name as underscored. i.e. zoom_changed
          var eventName = key.replace(/^on/,'');
          eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1);
          eventName = eventName.replace(/([A-Z])/g, function($1){
            return "_"+$1.toLowerCase();
          });

          var funcName = attrs[key].replace(/\(.*\)/,'');
          var func = scope.$eval(funcName);
          if (func instanceof Function) {
            events[eventName] = func;
          } else {
            var safeJs = attrs[key].replace(/[\n\r\;]/g,'');
            events[eventName] = function(event) { eval(safeJs) }
          }
        }
        return events;
      }

      // control means map controls, i.e streetview, pan, etc, not a general control
      this.getControlOptions = function(filtered) {
        var controlOptions = {};

        for (var attr in filtered) {
          if (!attr.match(/(.*)ControlOptions$/)) { 
            continue; // if not controlOptions, skip it
          }

          //change invalid json to valid one, i.e. {foo:1} to {"foo": 1}
          var orgValue = filtered[attr];
          var newValue = orgValue.replace(/'/g, '"');
          newValue = newValue.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
            if ($1) {
                return $1.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
            } else {
                return $2; 
            } 
          });
          try {
            var options = JSON.parse(newValue);
            for (var key in options) { //assign the right values
              var value = options[key];
              if (typeof value  == 'string') {
                var value = value.toUpperCase();
              } else if (key == "mapTypeIds") {
                var value = value.map(function(str) {
                  return google.maps.MapTypeId[str.toUpperCase()];
                });
              } 
              
              if (key == "style") {
                var str = attr.charAt(0).toUpperCase() + attr.slice(1);
                var objName = str.replace(/Options$/,'')+"Style";
                options[key] = google.maps[objName][value];
              } else if (key == "position") {
                options[key] = google.maps.ControlPosition[value];
              } else {
                options[key] = value;
              }
            }
            controlOptions[attr] = options;
          } catch (e) {
            console.error('invald option for', attr, newValue, e, e.stack);
          }
        } // for

        return controlOptions;
      } // function
    }; // return
  } // $.get
});

ngMap.service('GeoCoder', ['$q', function($q) {
  return {
    geocode : function(options) {
      var deferred = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(options, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          deferred.resolve(results);
        } else {
          deferred.reject('Geocoder failed due to: '+ status);
        }
      });
      return deferred.promise;
    }
  }
}]);

ngMap.service('NavigatorGeolocation', ['$q', function($q) {
  return {
    getCurrentPosition: function() {
      var deferred = $q.defer();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            deferred.resolve(position);
          }, function(evt) {
            console.error(evt);
            deferred.reject(evt);
          }
        );
      } else {
        deferred.reject("Browser Geolocation service failed.");
      }
      return deferred.promise;
    },

    watchPosition: function() {
      return "TODO";
    },

    clearWatch: function() {
      return "TODO";
    }
  }
}]);

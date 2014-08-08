//Injecting the d3 library 


angular.module('d3', [])
 .factory('d3service', function ($document, $q, $rootScope) {
 	var d = $q.defer();
 	function onScriptLoad () {
 		$rootScope.$apply(function () {d.resolve(window.d3);});
 	}
 	var scriptT = $document[0].createElement('script');
 	scriptT.type = 'text/javascript';
 	scriptT.async = true;
 	scriptT.src = 'http://d3js.org/d3.v3.min.js';
 	scriptT.onreadystatechange = function () {
 		if (this.readyState == 'complete') onScriptLoad();
 	}
 	scriptT.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptT);

      return {
        d3: function() { return d.promise; }
      };
 });
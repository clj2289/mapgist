var map;

require(["esri/map", "dojo/domReady!"], function(Map) {
	esri.config.defaults.io.corsEnabledServers.push("api.github.com");
	esri.config.defaults.io.corsEnabledServers.push("gist.github.com");
	var self = this;
	map = new Map("map", {
	basemap: "topo",
	center: [-122.45,37.75], // long, lat
	zoom: 13,
	sliderStyle: "small"
	});

	console.log(init());

	function init(){
		var mapgistId = getMapGistIdFromUrl();
		var gistRawUrl = getGistRawUrl(mapgistId);
			
	}

	function getMapGistIdFromUrl(){ 
		var defaultGistId = "6851442";
		var gistId = "";
		var query = getQueryParams(document.location.search);
		if(typeof query.mapgist != 'undefined'){
			gistId = query.mapgist;
		} else {
			gistId = defaultGistId;
		}
		return gistId;
	}

	function getGistContent(rawUrl){
		console.log(rawUrl);
		var xhrArgs = {
	    	url: rawUrl,
	    	handleAs: "json",
	    	preventCache: true
	  	};

	  	var deferred = dojo.xhrGet(xhrArgs);

	  	deferred.then(
	      function(data){
	      		console.log(data);
	      		//self.map = data;       
	      },
	      function(error){
	          alert("found gist, but no usable map data");
	      }
	  );	

	}

	function saveMap(){
		console.log("saving the world, I mean map");

	}

	function getGistRawUrl(gistId){
		var url = "https://api.github.com/gists/" + gistId;
		var xhrArgs = {
	    	url: url,
	    	handleAs: "json",
	    	preventCache: true
	  	};

	  	var deferred = dojo.xhrGet(xhrArgs);

	  	deferred.then(
	      function(data){
	      		var rawUrl = data.files.mapgist.raw_url;
	      		getGistContent(rawUrl);       
	      },
	      function(error){
	          alert("could not find gist");
	      }
	  );

	}

	function assembleGist(configData){

		var gistPostData = {
			"description": "this is my mad map gist, yo!",
			"public": true,
			"files": {
				"mapgist.json": {
					"content": configData
					}
				}
		};

	}

	function getQueryParams(qs) {
	    qs = qs.split("+").join(" ");

	    var params = {}, tokens,
	        re = /[?&]?([^=]+)=([^&]*)/g;

	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])]
	            = decodeURIComponent(tokens[2]);
	    }

	    return params;
	}

});


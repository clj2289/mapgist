var map;

require(["esri/map", "dojo/domReady!"], function(Map) {
	var self = this;
	map = new Map("map");

	init();
});

function init(){
	var mapgistId = getMapGistIdFromUrl();
	var gistRawUrl = getGistRawUrl(mapgistId);
		
}

function getMapGistIdFromUrl(){ 
	var defaultGistId = "6851442";
	var gistId = "";
	var query = getQueryParams(document.location.search);
	if(typeof query.gist != 'undefined'){
		gistId = query.gist;
	} else {
		gistId = defaultGistId;
	}
	return gistId;
}

function getGistContent(rawUrl){
	console.log(rawUrl);
	var url = "proxy.php?" + rawUrl;
	var xhrArgs = {
    	url: url,
    	handleAs: "json"
  	};

  	var deferred = dojo.xhrGet(xhrArgs);

  	deferred.then(
      function(data){
      		console.log(data);
      		map.setBasemap(data.basemap);
      		map.centerAt(data.center);
      		map.setZoom(data.zoom);
      		//self.map = data;       
      },
      function(error){
          alert("found gist, but no usable map data");
      }
  );	

}

function getMapData(){
	var center = esri.geometry.webMercatorToGeographic(map.extent.getCenter());
	var mapData = {
		basemap: "topo",
		center: [center.x, center.y], // long, lat
		zoom: map.getZoom()
	};
	return mapData;

}

function saveMap(){
	console.log("saving the world, I mean map");
	var mapData = getMapData();
	var postData = assembleGist(mapData);


	var url = "https://api.github.com/gists";
	var xhrArgs = {
      url: url,
      postData: postData,
      handleAs: "json",
      load: function(data){
      	      	var newUrl = window.location.origin + window.location.pathname + "?gist=" + data.id;
        dojo.byId("mapLink").innerHTML = "map has been saved to " + newUrl;
        dojo.connect(dojo.byId("mapLink"), 'onclick', function(){window.open(newUrl)});

        var gistUrl = data.html_url;
        dojo.byId("gistLink").innerHTML = "gist url:" + gistUrl;
        dojo.connect(dojo.byId("gistLink"), 'onclick', function(){window.open(gistUrl)});
      },
      error: function(error){
        dojo.byId("mapLink").innerHTML = "failed to create gist :-(";
      }
    };

  	var deferred = dojo.xhrPost(xhrArgs);


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
	configData = JSON.stringify(configData);

	var gistPostData = {
		"description": "this is my mad map gist, yo!",
		"public": true,
		"files": {
			"mapgist": {
				"content": configData
				}
			}
	};

	return JSON.stringify(gistPostData);

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




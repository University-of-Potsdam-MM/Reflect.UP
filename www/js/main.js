require.config({
    baseUrl : 'js',
    paths : {
        'jquery' : 'lib/jquery.min',
        'underscore' : 'lib/underscore',
        'backbone' : 'lib/backbone',
        'backboneLocalStorage' : 'lib/backbone.localStorage',
        'uri' : 'lib/uri'
    }
});

requirejs.onError = function(error){
	var failedId = error.requireModules && error.requireModules[0];

	if(error.requireType === 'timeout'){
		console.log('Timeout of RequireJS-Module:'+error.requireModules);
	}else{
		throw error;
	}
};

require(['jquery', 'app'], function(){
    app.initialize();
});
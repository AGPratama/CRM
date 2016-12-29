angular.module('starter.services',[])

.factory('site_visit', ['$resource',"ApiEndPoint", function($resource, ApiEndPoint) {
    return $resource(ApiEndPoint.url + "/site_visit/:id");
}])


.factory('schedule', ['$resource','ApiEndPoint', function($resource, ApiEndPoint) {
    return $resource(ApiEndPoint.url + "/schedule/:id");
}])

.factory('lokasi', ['$resource','ApiEndPoint', function($resource, ApiEndPoint) {
    return $resource(ApiEndPoint.url + "/lokasi/:id");
}])


.factory('Auth', function() {
    return {
    	login : function(session){
		   	window.localStorage.setItem("username",session.username);
            window.localStorage.setItem("employee_name",session.employee);
            window.localStorage.setItem("user_id",session.user_id);
            window.localStorage.setItem("role_id",session.role_id);
            window.localStorage.setItem("employee_id",session.employee_id);
		},

  		isLoggedIn : function(){
		    if(window.localStorage.getItem("username")!=undefined)
		    {
		      return true;
		    }
		    else
		    {
		      return false;
		    }
		},

  		logout : function(){
		    window.localStorage.clear();
		}
	}
})

.factory('user', ['$resource',"ApiEndPoint", function($resource, ApiEndPoint) {
	console.log(ApiEndPoint);
    return $resource(ApiEndPoint.url + "/user/:id",
    				 {},
    				 {
    				 	save : {
    				 		method : "POST"
    				 	}
    				 });
}]);
'use strict';

angular.module('ngSwagger', [])
    .constant("BASE_PATH", "PATH TO YOUR API ENDPOINT")
    .constant("APP_NAME", "swagger")
    .factory('Swagger', ['$rootScope', '$http', 'BASE_PATH', 'APP_NAME', function ($rootScope, $http, basepath, appname) {
        var Swagger = function(){
            window.Scope = $rootScope;
            $http.defaults.headers.common['X-DreamFactory-Application-Name'] = appname;
            $http.get(basepath + "/api_docs", {
                params: { app_name: appname }
            }).then(
                function (response) {
                    $rootScope.df = {};
                    response.data.apis.forEach(function (api) {
                        $http.get(basepath + "/api_docs" + api.path)
                            .then(
                            function (response) {
                                response.data.apis.forEach(function (api) {
                                    var end = api.path.indexOf("/", 1);
                                    end = end != -1 ? end : api.path.length;
                                    var resource = api.path.slice(1, end);
                                    $rootScope.df[resource] = $rootScope.df[resource] || {};
                                    api.operations.forEach(function (method) {
                                        $rootScope.df[resource][method.nickname] = function (params) {
                                            $http({
                                                url: basepath + "/" + resource,
                                                method: method.method,
                                                params: params
                                            });
                                        };
                                    })
                                })
                            }
                        )
                    })
                }
            );
        };
        return Swagger();
    }]);

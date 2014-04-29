'use strict';

angular.module('ngSwagger', [])
    .constant("BASE_PATH", "https://dsp-go.cloud.dreamfactory.com/rest")
    .constant("APP_NAME", "swagger")
    .factory('Swagger', ['$rootScope', '$http', 'BASE_PATH', 'APP_NAME', function ($rootScope, $http, basepath, appname) {
        var Swagger = {};
        Swagger.load = function (config) {
            window.Scope = $rootScope;
            $http.defaults.headers.common['X-DreamFactory-Application-Name'] = appname;
            if (!config) {
                $http.get(basepath + "/api_docs", {
                    params: { app_name: appname }
                }).then(function (response) {
                    Swagger.loadEndPoints(response);
                })
            } else {
                config.forEach(function (endpoint) {
                    $http.get(basepath + "/api_docs" + "/" + endpoint)
                        .then(
                        function (response) {
                            Swagger.build(response);
                        }
                    );
                });

            }


        };
        Swagger.loadEndPoints = function (response) {

            response.data.apis.forEach(function (api) {
                $http.get(basepath + "/api_docs" + api.path)
                    .then(
                    function (response) {
                        Swagger.build(response)
                    }

                )
            })
        };
        Swagger.build = function (response) {
            $rootScope.df = $rootScope.df ||  {};
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
                });
            });
        };


        return Swagger;
    }]);
'use strict';
/**
 * This widget simply displays the car number using the colors returned by the SIM.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-car-number data-sra-args-car="ME"&gt;&lt;/sra-car-number&gt;<br />
 * &lt;div data-sra-car="ME"&gt;&lt;/div&gt;
 * </b>
 * <img src="../widgets/CarNumber/icon.png" />
 * @ngdoc directive
 * @name sra-car-number
 * @param {carIdentifier} data-sra-args-car The <a href="../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-" target="_blank">Car Identifier</a> to get the number from.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 2000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2016 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCarNumber",
        url:             'CarNumber',
        template:        'CarNumber.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter','$rootScope',
    function(sraDispatcher,   $filter,  $rootScope) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;
                
                $scope.CarNumber                = "";
                $scope.CarNumberSlant           = "right"; //normal, left, right, forward, backwards
                $scope.CarNumberFont            = "Arial";
                $scope.CarColor                 = "";
                $scope.CarColorNumber           = "";
                $scope.CarColorNumberOutline    = "";
                $scope.CarColorNumberBackground = "";
                $scope.transform                = "";
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                //$scope.value = $scope[self.name] = $attrs[self.name] || $attrs.sraArgsCar || $attrs.sraArgsCarNumber || "REFERENCE";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $attrs.sraArgsCarNumber, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");


                //removed these attributes from the template because sraCar was not resolved at the time of compilation
                $attrs.sraArgsData =
                    ";Car/" + $scope.value + "/Number"                
                  + ";Car/" + $scope.value + "/NumberSlant"                
                  + ";Car/" + $scope.value + "/NumberFont"                
                  + ";Car/" + $scope.value + "/Color"
                  + ";Car/" + $scope.value + "/ColorNumber"
                  + ";Car/" + $scope.value + "/ColorNumberOutline"
                  + ";Car/" + $scope.value + "/ColorNumberBackground";

                $scope.$watch("data.Car['"+$scope.value+"'].Number.Value", function() {
                    $scope.CarNumber = $scope.data.Car[$scope.value].Number.ValueFormatted;
                });
                
                $scope.$watch("data.Car['"+$scope.value+"'].NumberSlant.Value", function() {
                    $scope.CarNumberSlant = $scope.data.Car[$scope.value].NumberSlant.Value;
                    if ($scope.CarNumberSlant == "left")
                        $scope.transform = "translate(-80,0) skewX(15)";
                    else
                    if ($scope.CarNumberSlant == "right")
                        $scope.transform = "translate(80,0) skewX(-15)";
                    else
                    if ($scope.CarNumberSlant == "forward")
                        $scope.transform = "translate(-80,0) skewX(15)";
                    else
                    if ($scope.CarNumberSlant == "backwards")
                        $scope.transform = "translate(80,0) skewX(-15)";
                    else
                        $scope.transform = "";
                        
                });
                
                
                $scope.$watch("data.Car['"+$scope.value+"'].NumberFont.Value", function() {
                    $scope.CarNumberFont = $scope.data.Car[$scope.value].NumberFont.Value;
                });
                
                $scope.$watch("data.Car['"+$scope.value+"'].Color.Value", function() {
                    $scope.CarColor = $scope.data.Car[$scope.value].Color.Value;
                });

                $scope.$watch("data.Car['"+$scope.value+"'].ColorNumber.Value", function() {
                    $scope.CarColorNumber = $scope.data.Car[$scope.value].ColorNumber.Value;
                });

                $scope.$watch("data.Car['"+$scope.value+"'].ColorNumberOutline.Value", function() {
                    $scope.CarColorNumberOutline = $scope.data.Car[$scope.value].ColorNumberOutline.Value;
                });

                $scope.$watch("data.Car['"+$scope.value+"'].ColorNumberBackground.Value", function() {
                    $scope.CarColorNumberBackground = $scope.data.Car[$scope.value].ColorNumberBackground.Value;
                });

            /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});

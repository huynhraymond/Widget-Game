
var myApp = angular.module('myApp', []);

myApp.controller('myController', function($scope, uuid) {

    $scope.widgets = [];

    $scope.create = function(n) {
        //var w = createElement("widget", document.querySelector('div.right-side'), '', {'data-version': n});
        //$scope.widgets.push(w);

        $scope.widgets.push({
            id: uuid.v4(),
            version: n
        });
    };

    $scope.remove = function(wid) {
        // using lodash
        $scope.widgets = _.reject($scope.widgets, {id: wid});
    }
});

myApp.factory('uuid', function() {
    return {
        v4: function () {
            // refer to http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
});

myApp.directive('widget', function($interval) {
    return {
        scope: {
            id: '@',
            version: '@',
            remove: '='
        },

        restrict: 'ACE',
        templateUrl: '_widget.html',
        link: function(scope /*, element, attr */) {

            var interval_promise, option = -1;

            if ( parseInt(scope.version) === 1 ) { option = 1; }

            scope.getRandom = function() {
                scope.random = option * ( ~~(Math.random() * 98) + 1 );
            };

            // Check for auto play
            //if ( option ) scope.play();

            scope.getRandom();

            scope.play = function() {
                // play if $interval never run or $interval in cancel stage
                if ( typeof interval_promise === 'undefined' || interval_promise.$$state.status === 2 ) {
                    interval_promise = $interval( scope.getRandom, 1000 );
                }
            };

            scope.pause = function() {
                $interval.cancel(interval_promise)
            };

            scope.close = function() {
                scope.remove(scope.id);
            };
        }
    };
});


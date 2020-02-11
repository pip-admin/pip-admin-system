((angular, _) => {
    'use strict';

    var thisModule = angular.module('appSamples',
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages', 'pipDates',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',  'pipBehaviors',
            // Application Configuration must go first
            'pipSampleConfig',
            // Modules from WebUI Framework
            'pipEntry', 'pipNav', 'pipShell',
            'pipSystem.Templates', 'pipSystem'

        ]
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, pipTranslate, pipRest, pipToasts,
            pipSession, $mdTheming, $timeout) {


            $scope.isEntryPage = () => {
                return $state.current.name === 'signin' || $state.current.name === 'signup' ||
                    $state.current.name === 'recover_password' || $state.current.name === 'post_signup';
            };

        }
    );

})(window.angular, window._);

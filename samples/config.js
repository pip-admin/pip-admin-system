/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSampleConfig',
        ['pipEntry', 'pipTheme', 'pipLayout', 'pipNav', 'pipDialogs']);

    // Configure application services before start
    thisModule.config(
        function ($mdIconProvider, $urlRouterProvider, pipAuthStateProvider, $stateProvider, pipEntryProvider,
            pipTranslateProvider, pipSideNavProvider, pipNavMenuProvider, pipRestProvider) { //pipSideNavProvider, pipAppBarProvider,  

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);


            pipNavMenuProvider.sections = [
                {
                    title: 'About',
                    icon: 'icons:goal',
                    links: [
                        { title: 'Logging', url: '/logging' },
                        
                        { title: 'Errors', url: '/errors' },
                        
                        { title: 'Counters', url: '/counters' },
                        
                        { title: 'Events', url: '/events' },
                        
                        { title: 'Settings', url: '/settings_tool' },
                        
                        { title: 'Statistics', url: '/statistics' }
                    ]
                },
                {
                    links: [
                        { title: 'SIGNOUT', url: '/signout' }
                    ]
                }
            ];
            pipSideNavProvider.part('user', true);
            pipSideNavProvider.part('links', true);
            pipSideNavProvider.type = 'sticky';
            pipEntryProvider.isPostSignup = false;


            pipRestProvider.serverUrl = 'http://api.positron.stage.iquipsys.net:30001';
            $urlRouterProvider.otherwise(($injector, $location) => {
                return $location.$$path === '' ? '/' : '/logging';
            });

            // String translations
            pipTranslateProvider.translations('en', {
                SAMPLE_APPLICATION: 'Sample application',
                ABOUT_ME: 'About Me',
                ABOUT_SYSTEM: 'About system',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                SAMPLE_APPLICATION: 'Пример приложения',
                ABOUT_ME: 'Обо мне',
                ABOUT_SYSTEM: 'О системе',
                SIGNOUT: 'Выйти'
            });

            // Configure default states
            pipAuthStateProvider.unauthorizedState = 'signin';
            pipAuthStateProvider.authorizedState = 'logging';

        }
    );


})();


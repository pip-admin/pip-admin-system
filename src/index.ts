(() => {

    angular
        .module('pipSystem', [
            'pipDirective',
            
            'pipLoggingResources',
            'pipLoggingData',
            'pipLoggingViewModel',
            'pipLoggingPage',
            'pipLoggingPanel',
            
            'pipErrorsPage',
            'pipErrorsPanel',

            'pipCountersResources',
            'pipCountersData',
            'pipCountersPage',
            'pipCountersPanel',

            'pipEventsResources',
            'pipEventsData',
            'pipEventsPage',
            'pipEventsPanel',

            'pipSettingsResources',
            'pipSettingsData',
            'pipSettingsPage',
            'pipSettingsPanel',

            'pipStatisticsResources',
            'pipStatisticsService',
            'pipStatisticsData',
            'pipStatisticsPage',
            'pipStatisticsPanel'

        ])

})();
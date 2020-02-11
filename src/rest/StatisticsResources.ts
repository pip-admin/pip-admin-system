function configStatisticsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('statistics_counters', '/api/v1/statistics/counters');
    pipRestProvider.registerOperation('statistics_section', '/api/v1/statistics/groups');
    pipRestProvider.registerOperation('statistics', '/api/v1/statistics/:section/:name');
    
}

angular
    .module('pipStatisticsResources', [])
    .config(configStatisticsResources);
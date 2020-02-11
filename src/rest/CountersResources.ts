function configCountersResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('counters', '/api/v1/counters');
}

angular
    .module('pipCountersResources', [])
    .config(configCountersResources);
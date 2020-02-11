function configEventsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('events', '/api/v1/eventlog');
}

angular
    .module('pipEventsResources', [])
    .config(configEventsResources);
function configLoggingResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('logging', '/api/v1/logging');
    pipRestProvider.registerOperation('errors', '/api/v1/logging/errors');
}

angular
    .module('pipLoggingResources', [])
    .config(configLoggingResources);
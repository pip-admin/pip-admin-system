function configSettingsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('settings', '/api/v1/settings/:section/:key',
        { section: '@section' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        }
    );
    pipRestProvider.registerOperation('settings_section', '/api/v1/settings/ids');

}

angular
    .module('pipSettingsResources', [])
    .config(configSettingsResources);
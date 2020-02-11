import { ISettingsDataService, ISettingsDataProvider } from './ISettingsDataService';

class SettingsData implements ISettingsDataService {
    private RESOURCE: string = 'settings';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }


    public readSettingsSections(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('settings_section').get(
            {},
            (data: any) => {
                if (successCallback) {
                    successCallback(data.data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public readSettings(section: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('settings').get(
            {
                section: section
            },
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public createSettings(section: string, data: any = {}, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        console.log('section', section, this.pipRest.getResource('settings'));
        return this.pipRest.getResource('settings').save(
            { section: section },
            data,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public updateSettings(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('settings').update(
            {
                section: section
            },
            data,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

     public saveSettingsKey(section: string, key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('settings').save(
            {
                section: section,
                key: key
            },
            value,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

}

class SettingsDataProvider implements ISettingsDataProvider {
    private _service: ISettingsDataService;
    private RESOURCE: string = 'settings'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new SettingsData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipSettingsData', ['pipRest'])
    .provider('pipSettingsData', SettingsDataProvider);



import { ILoggingDataService, ILoggingDataProvider } from './ILoggingDataService';
import { LogMessages } from './LogMessage';

class LoggingData implements ILoggingDataService {
    private RESOURCE: string = 'logging';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) {
        "ngInject";
    }

    private filterToString(filter: any): string {
        if (filter == null) return null;
        let result = ''; 

        for (let key in filter) {
            if (result.length > 0)
                result += ';';

            let value = filter[key];
            if (value != null)
                result += key + '=' + value
            else
                result += key
        }

        return result;
    }


    public readLogging(params: any, start: number = 0, take: number = 100, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('logging').get(
            params,
            (data: LogMessages) => {
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

    public readErrors(params: any, start: number = 0, take: number = 100, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('errors').get(
            params,
            (data: LogMessages) => {
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

class LoggingDataProvider implements ILoggingDataProvider {
    private _service: ILoggingDataService;
    private RESOURCE: string = 'logging'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new LoggingData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipLoggingData', ['pipRest'])
    .provider('pipLoggingData', LoggingDataProvider);



import { ICountersDataService, ICountersDataProvider } from './ICountersDataService';

class CountersData implements ICountersDataService {
    private RESOURCE: string = 'counters'; 

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }


    public readCounters(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('counters').get(
            {},
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

class CountersDataProvider implements ICountersDataProvider {
    private _service: ICountersDataService;
    private RESOURCE: string = 'counters'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";
        
        if (this._service == null) {
            this._service = new CountersData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipCountersData', ['pipRest'])
    .provider('pipCountersData', CountersDataProvider);



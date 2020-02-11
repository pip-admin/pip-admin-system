import { IEventsDataService, IEventsDataProvider } from './IEventsDataService';

class EventsData implements IEventsDataService {
    private RESOURCE: string = 'events';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }

    public readEvents(params: any, start: number = 0, take: number = 100, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        if (!params) params = {};
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('events').get(
            params,
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

class EventsDataProvider implements IEventsDataProvider {
    private _service: IEventsDataService;
    private RESOURCE: string = 'events'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new EventsData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipEventsData', ['pipRest'])
    .provider('pipEventsData', EventsDataProvider);



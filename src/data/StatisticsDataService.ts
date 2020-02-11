import { IStatisticsDataService, IStatisticsDataProvider } from './IStatisticsDataService';
import { StatCounterValue } from './StatCounters';

class StatisticsData implements IStatisticsDataService {
    private RESOURCE: string = 'statistics';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }


    public readStatisticsSections(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('statistics_section').get(
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

    public readStatistics(section: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('statistics').get(
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


    public getStats(counter: string, type: number = 0, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: any) => void, errorCallback?: (err: any) => void): any {
            console.log('type', type);
        let params: any = {};
        if (counter != null) params.counter = counter;
        if (type != null) params.type = type;
        if (fromTimeUtc != null) params.fromTimeUtc = fromTimeUtc;
        if (toTimeUtc != null) params.toTimeUtc = toTimeUtc;
        params.section = counter;

        return this.pipRest.getResource('statistics').query(
            params,
            params,
            dataCallback,
            errorCallback
        );
    }
      public getTotalStats(counter: string, dataCallback?: (data: any) => void, errorCallback?: (err: any) => void): any {
       
        return this.getStats(counter, 0, null, null, dataCallback, errorCallback);
    }
    public getYearlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any {
        return this.getStats(counter, 1, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    }

    public getMonthlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any {
        return this.getStats(counter, 2, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    }

    public getDailyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any {
        return this.getStats(counter, 3, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    }

    public getHourlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any {
        return this.getStats(counter, 4, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    }

    public createStatistics(section: string, data: any = {}, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        console.log('section', section, this.pipRest.getResource('statistics'));
        return this.pipRest.getResource('statistics').save(
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

    public updateStatistics(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('statistics').update(
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

}

class StatisticsDataProvider implements IStatisticsDataProvider {
    private _service: IStatisticsDataService;
    private RESOURCE: string = 'statistics'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new StatisticsData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipStatisticsData', ['pipRest'])
    .provider('pipStatisticsData', StatisticsDataProvider);



import { StatCounterValue } from './StatCounters';
export interface IStatisticsDataProvider {

}

export interface IStatisticsDataService {
    readStatistics(section: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readStatisticsSections(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createStatistics(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateStatistics(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    getTotalStats(counter: string, dataCallback?: (data: any) => void, errorCallback?: (err: any) => void): any;
    getYearlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getMonthlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getDailyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getHourlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date,
        dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
}
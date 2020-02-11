export interface ICountersDataProvider {

}

export interface ICountersDataService {
    readCounters(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
}
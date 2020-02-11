export interface IEventsDataProvider {

}

export interface IEventsDataService {
    readEvents(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
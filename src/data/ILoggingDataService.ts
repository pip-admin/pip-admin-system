import { LogMessages } from './LogMessage';
export interface ILoggingDataProvider {

}

export interface ILoggingDataService {
    readLogging(params: any, start: number, take: number, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
readErrors(params: any, start: number, take: number, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
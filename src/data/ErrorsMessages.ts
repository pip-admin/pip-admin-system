import {LogMessage} from './LogMessage';

export class ErrorLogMessage extends LogMessage {
    MomentTimeUtc: any;
}

export class ErrorMessageRecord {
    items: ErrorLogMessage[];
    ErrorType: string;
    first: any;
    last: any;
    count: number;
    collapsed: boolean;
    show: number;
}

export interface IErrorMessages {
    [key: string]: ErrorMessageRecord
}
// todo нужны default значения
export interface IConfigErrors {
    start: number; // например тут при инициализации будет 0 и тд
    pageSize: number;
    refresh: number;
    defaultSearch: string;
    refreshEvent: string;
    refreshTimes: number[];
}

export class ConfigErrors implements IConfigErrors {
    readonly start: number = 0;
    readonly pageSize: number = 100;
    readonly refresh: number = 3;
    readonly defaultSearch: string = '';
    readonly refreshEvent: string = 'TOOLS.ERRORS_REFRESH';
    readonly refreshTimes: number[] = [1, 2, 3, 5, 10];
}

export class ErrorsMessagesVisability {
    static Limit: number = 50;
    static Step: number = 50;
}

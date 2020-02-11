import { ErrorDescription } from './ErrorDescription';

export enum LogLevel {
    None = 0,
    Fatal = 1,
    Error = 2,
    Warn = 3,
    Info = 4,
    Debug = 5,
    Trace = 6
}


export class LogMessage {
    public time: Date;
    public source: string;
    public level: LogLevel;
    public correlation_id: string;
    public error: ErrorDescription;
    public message: string;
}

export class LogMessages {
    data: LogMessage[];
    total: number;
}
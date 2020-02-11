import { ILoggingDataService } from '../data/ILoggingDataService';
import { LogMessages } from '../data/LogMessage';
import { LogMessage } from '../data/LogMessage';

export class LoggingsState {
    static Progress: string = 'progress';
    static Data: string = 'data';
    static Empty: string = 'empty';
}

export class LoggingModel {
    public loggings: LogMessage[] = [];
    public state: string = LoggingsState.Progress;

    private total: number = 0;
    private _start: number = 0;
    private _take: number = 100;

    constructor(private pipLoggingData: ILoggingDataService) { }

    public getLoggings() {
        return this.loggings;
    }
    public setLoggings(loggings: LogMessage[]) {
        this.loggings = loggings;
    }

    public setState(state: string) {
        this.state = state; 
    }
    
    public getState(): string {
        return this.state;
    }

    public readLogging(search?: string, callback?: () => void, errorcallback?: (error) => void): void {
        this.pipLoggingData.readLogging(
            { 'Search': search }, this._start, this._take,
            (results: LogMessages) => {
                this.onLoggingRead(results, callback);
            },
            (err: any) => {
                if (errorcallback) {
                    errorcallback(err);
                }
            }
        );

    }


    public refreshLogging(search?: string, callback?: () => void, errorcallback?: (error) => void): void {
        this._start = 0;
        this.readLogging(search, callback, errorcallback);

    }

    private onLoggingRead(traces: LogMessages, callback?: () => void): void {
        this.state = traces.data.length > 0 || (this._start !== 0 && this.loggings.length > 0) ?
            LoggingsState.Data : LoggingsState.Empty;

        _.each(traces.data, (trace, $index) => {
            this.loggings[$index] ? this.loggings[$index + this._start] = trace : this.loggings.push(trace);
        });

        this._start += traces.data.length;

        if (this.total <= this._start || this._take != traces.data.length) {
            this.total = this._start;

            if (this.loggings.length > this.total) {
                this.loggings.splice(this.total, this.loggings.length - this.total);
            }
        } else {
            //this.readLogging();
        }
        if (callback) {
            callback();
        }

    }

}
import { LoggingModel } from './LoggingModel';
import { LogMessage } from '../data/LogMessage';
import { ILoggingDataService } from '../data/ILoggingDataService';

export interface ILoggingViewModel {
    logging: LogMessage[];
    state: string;
    readLogging(search?: string, callback?: () => void, errorcallback?: (error: any) => void);
    refreshLogging(search?: string, callback?: () => void, errorcallback?: (error: any) => void);
}

class LoggingViewModel implements ILoggingViewModel {
    private workflow: LoggingModel;

    constructor(private pipLoggingData: ILoggingDataService) {
        "ngInject";
        this.workflow = new LoggingModel(pipLoggingData);
    }

    public get logging(): LogMessage[] {
        return this.workflow.getLoggings();
    }

    public set logging(loggings: LogMessage[]) {
        this.workflow.setLoggings(loggings);
    }

    public get state(): string {
        return this.workflow.getState();
    }

    public set state(state: string) {
        this.workflow.setState(state);
    }


    public readLogging(search?: string, callback?: () => void, errorcallback?: (error) => void): void {
        this.workflow.readLogging(search, callback, errorcallback);
    }
    public refreshLogging(search?: string, callback?: () => void, errorcallback?: (error) => void) {
        this.workflow.refreshLogging(search, callback, errorcallback)
    }
}

(() => {

    angular
        .module('pipLoggingViewModel', ['pipNav'])
        .service('pipLoggingViewModel', LoggingViewModel)

})();


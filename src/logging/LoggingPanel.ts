import { ILoggingDataService } from '../data/ILoggingDataService';
import { ILoggingViewModel } from './LoggingViewModel';
import { LogMessage } from '../data/LogMessage';

interface ILoggingPanelBindings {
    [key: string]: any;
}

const LoggingPanelBindings: ILoggingPanelBindings = {

}

class LoggingPanelChanges implements ng.IOnChangesObject, ILoggingPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class LoggingsTimer {
    static Times: number[] = [1, 3, 5, 10, 20, 30];
}

class LoggingsFilter {
    static Content: string = 'Content';
    static CorrelationId: string = 'CorrelationId';
    static Level: string = 'Level';
    static All: string[] = ['Content', 'CorrelationId', 'Level'];
}

class LoggingPanelController {
    public transaction: pip.services.Transaction;
    public filter: string;
    public autoUpdate: boolean = true;
    public filters: string[] = LoggingsFilter.All;
    public refresh: number = LoggingsTimer.Times[3];
    public refreshTimes: number[] = LoggingsTimer.Times;
    public search: string = '';
    public localSearch: string = '';
    public error: string = null;

    private stopRefresh: boolean = false;
    private _refreshTime: number;
    private cleanUpFunc: Function;

    constructor(
        private pipLoggingViewModel: ILoggingViewModel,
        private $location: ng.ILocationService,
        private pipTimer: pip.services.ITimerService,
        public pipMedia: pip.layouts.IMediaService,
        pipTransaction: pip.services.ITransactionService,
        $rootScope: ng.IRootScopeService) {


        this.transaction = pipTransaction.create('traces');
        this.filter = this.$location.search().filter || LoggingsFilter.Content;
        this.search = this.$location.search().search || '';
        this.localSearch = this.search;
        this.readLogging();

        this.setRefreshTimer();
        this.cleanUpFunc = $rootScope.$on('Logging', () => {
            if (!this.stopRefresh && this.autoUpdate) {
                this.refreshLogging();
            }
        });

    }

    public $onDestroy() {
        this.pipTimer.removeEvent('Logging');
        if (angular.isFunction(this.cleanUpFunc)) {
            this.cleanUpFunc();
        }
    }

    public loggings(): LogMessage[] {
        return this.pipLoggingViewModel.logging;
    }

    public state(): string {
        return this.pipLoggingViewModel.state;
    }


    public readLogging(): void {
        this.stopRefresh = true;
        this.transaction.begin('PROCESSING');
        this.pipLoggingViewModel.readLogging(this.search, () => { this.onLoggingRead() }, (error) => { this.onError(error) });
    }


    private setRefreshTimer() {
        if (!this.pipTimer.isStarted()) {
            this.pipTimer.start();
        }

        this.setRefresh();
        this.pipTimer.removeEvent('Logging');
        this.pipTimer.addEvent('Logging', this._refreshTime);
    }

    public onRefreshChange(): void {
        this.setRefreshTimer()
    }

    private setRefresh() {
        this._refreshTime = this.refresh * 1000;
    }

    public playStopAutoUpdate() {
        this.autoUpdate = !this.autoUpdate;
    }

    private onError(error: any): void {
        this.error = error;
        this.transaction.abort();
        this.stopRefresh = false;
    }

    private onLoggingRead(): void {
        this.stopRefresh = false;
        this.error = null;
        this.transaction.end();
    }

    public refreshLogging(): void {
        this.$location.search('search', this.search);
        this.stopRefresh = true;
        this.transaction.begin('PROCESSING');
        this.pipLoggingViewModel.refreshLogging(this.search, () => { this.onLoggingRead() }, (error) => { this.onError(error) });
    }
    public onSearch(): void {
        this.search = this.localSearch;
        this.refreshLogging();
    }

}

(() => {
    angular
        .module('pipLoggingPanel', [])
        .component('pipLoggingPanel', {
            bindings: LoggingPanelBindings,
            templateUrl: 'logging/LoggingPanel.html',
            controller: LoggingPanelController
        })

})();

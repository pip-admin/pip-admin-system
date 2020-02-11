import { ILoggingDataService } from '../data/ILoggingDataService';
import { ConfigErrors, ErrorsMessagesVisability, ErrorMessageRecord, IErrorMessages, ErrorLogMessage } from '../data/ErrorsMessages';
import { LogMessage } from '../data/LogMessage';
import { ErrorDescription } from '../data/ErrorDescription';

declare let moment;
declare let async;

interface IErrorsPanelBindings {
    [key: string]: any;
}

const ErrorsPanelBindings: IErrorsPanelBindings = {

}

class ErrorsPanelChanges implements ng.IOnChangesObject, IErrorsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class ErrorsPanelController {
    private _log: ng.ILogService;
    private _q: ng.IQService;
    private _scope: ng.IScope;
    private _state: angular.ui.IStateService;
    private _location: ng.ILocationService;
    private _errorsData: ILoggingDataService;
    private _pipTimer: pip.services.ITimerService;
    //private _pipErrorDetailsDialog: IErrorDetailsService;
    private _config: ConfigErrors = new ConfigErrors();
    private _rootScope: ng.IRootScopeService;
    private _pipConfirmationDialog: any;
    private _pipToasts: any;

    private _start: number;
    private _take: number;
    private _total: boolean;

    private refreshTime: number; // todo Имя должно начитаться с нижнего подчеркивания = это же private _refreshTime
    private errorMessage: any;
    private searchQuery: string = '';
    private stopRefresh: boolean = false;

    public showMessagesLimit: number = ErrorsMessagesVisability.Limit;

    public _pipMedia: pip.layouts.IMediaService;
    public search: string;
    public refresh: number;
    public refreshTimes: number[];
    public errorText: string;

    // data
    public errors: ErrorMessageRecord[];
    // state 
    // todo Стас, нужно сделать State одним параметром с использованием класса States, как в traces
    public state: string;
    public loading: boolean = false;
    public updating: boolean = false; // нужно использовать транзакции, а не просто флаг
    public error: boolean = false;

    constructor(
        $log: ng.ILogService,
        $q: ng.IQService,
        $state: angular.ui.IStateService,
        $scope: ng.IScope,
        $location: ng.ILocationService,
        $rootScope: ng.IRootScopeService,
        pipNavService: pip.nav.INavService,
        pipLoggingData: ILoggingDataService,
        pipTimer: pip.services.ITimerService,
        pipMedia: pip.layouts.IMediaService,
        //pipErrorDetailsDialog: IErrorDetailsService,
        pipConfirmationDialog: any,
        pipToasts: any) {

        this._log = $log;
        this._q = $q;
        this._state = $state;
        this._scope = $scope;
        this._location = $location;
        this._errorsData = pipLoggingData;
        this._pipTimer = pipTimer;
        this._pipMedia = pipMedia;
        //this._pipErrorDetailsDialog = pipErrorDetailsDialog;
        this._pipConfirmationDialog = pipConfirmationDialog;
        this._pipToasts = pipToasts;

        this._start = this._config.start;
        this._take = this._config.pageSize;
        this._total = true;
        this.refresh = this._config.refresh;
        this.refreshTimes = this._config.refreshTimes;


        //this.filter = this._location.search().filter || this._config.defaultFilter;
        this.search = this._location.search().search || this._config.defaultSearch;
        this.searchQuery = this.search;

        this.loading = true;

        this._scope.$on('$destroy', () => {
            this.removeRefreshTimer();
        });


        this.setRefreshTimer();
        var cleanUpFunc = $rootScope.$on('TOOLS.ERRORS_REFRESH', () => {
            if (!this.stopRefresh) {
                this.updating = true;
                this.InitErrors();
            }
        });

        $scope.$on('$destroy', () => {
            if (angular.isFunction(cleanUpFunc)) {
                cleanUpFunc();
            }
        });

        this.setState()
        this.InitErrors();

    }

    private getErrorString(responses: any): string {
        if (responses) {
            if (_.isString(responses)) {
                return responses;
            } else if (responses.message) {
                return responses.message;
            } else if (responses.data && responses.data.message) {
                return responses.data.message;
            } else {
                return responses.statusText || '';
            }
        }

        return '';
    }

    public clean() {
        this.search = null;
        this.onSearchErrors();
    }

    private clearErrors() {
        this._pipConfirmationDialog.show(
            {
                event: null,
                title: 'Clear all errors?',
                ok: 'Clear',
                cancel: 'Cancel'
            },
            () => {
                /*this._errorsData.clearErrors(
                    () => {
                        this.onErrorRead([]);
                        this._pipToasts.showMessage('All errors have been cleared.');
                        this.InitErrors();
                    },
                    (error: any) => {
                        this.clearErrorsError(error);
                    }
                );*/
            },
            () => {
                console.log('You disagreed');
            }
        );
    }

    private clearErrorsError(error: any) {
        this._pipToasts.showError(error);
        // todo need transactions 
    }

    // todo нужно использовать traces data state -> смотри в traces 
    private setState() {
        if (this.loading) {
            this.state = 'loading';
            return;
        }
        if (angular.isArray(this.errors) && this.errors && this.errors.length > 0) {
            this.state = 'data';
            return;
        }
        if (!angular.isArray(this.errors) || (this.errors && this.errors.length == 0)) {
            this.state = 'empty';
            return;
        }
    }

    private setRefresh() {
        this.refreshTime = this.refresh * 60 * 1000;
    }

    // для фильтра тоже нужно использовать класс
    private getFilter() { // нужно писать возвращаемое значение
        let filter: any = {};

        if (this.searchQuery) {
            filter.Search = this.searchQuery;
        }

        return filter;
    }

    private setRefreshTimer() {
        if (!this._pipTimer.isStarted()) {
            this._pipTimer.start();
        }

        this.setRefresh();
        this.removeRefreshTimer();
        this._pipTimer.addEvent('TOOLS.ERRORS_REFRESH', this.refreshTime);
    }

    private removeRefreshTimer() {
        this._pipTimer.removeEvent('TOOLS.ERRORS_REFRESH');
    }

    private onErrorRead(responses: any) {
        console.log(responses);
        let traceErrors: LogMessage[];
        let errorMessageTree: IErrorMessages;
        let errors: ErrorMessageRecord[] = [];

        traceErrors = this.createErrors(responses);
        errorMessageTree = this.prepareErrorTree(this.createErrorTree(traceErrors));

        for (var key in errorMessageTree) { // почему используется for ? Лучше использовать _.each  
            let item = errorMessageTree[key];
            if (this.errors && this.errors.length > 0) {
                let oldItem = _.find(this.errors, (item) => {
                    // все if должны быть с полной записью, но зачем тут вообще if ??????
                    // нужно просто: return item && item.items && item.items.length > 0 && item.items[0].error.Type == key;
                    if (item && item.items && item.items.length > 0 && item.items[0].error.type == key) return true;
                    else return false;
                });
                item.collapsed = oldItem ? !!oldItem.collapsed : false;
            }
            errors.push(item);
        }

        this.errors = _.sortBy(errors, function (item: ErrorMessageRecord) {
            return item.ErrorType;
        });

        // todo зачем тут куча просто переменных если у тебя есть state? 
        this.loading = false;
        this.updating = false;
        this.error = false;
        this.setState();
    }

    private onError(responses: any): void { // тут тоже нужен класс
        this._log.error('Error: ' + JSON.stringify(responses));
        this.errorText = 'Error: Error on load erros messages.';
        this.errorMessage = responses;
        this.loading = false;
        this.updating = false;
        this.error = true;
        this.setState();
    }

    private InitErrors(): void {
        let filter = this.getFilter();

        this.loading = true;
        this.error = false;

        // todo тут с этим куском что-то нужно сделать, это выглядит очень-очень странно 
        // each parallel используй
        async.parallel([
            (callback) => {
                // поему тут используется старые  function ? где тип получаемых значений ?
                this._errorsData.readErrors(filter, this._start, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + this._take, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 2 * this._take, this._take,
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 3 * this._take, this._take,
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 4 * this._take, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 5 * this._take, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 6 * this._take, this._take,
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 7 * this._take, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 8 * this._take, this._take,
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            },
            (callback) => {
                this._errorsData.readErrors(filter, this._start + 9 * this._take, this._take, 
                    function (responses) { callback(null, responses); },
                    function (error) { callback(error, null); })
            }
        ]
            , (error, result) => { // где типы возвращаемых значенией ? 
                if (!error && result) {
                    this.onErrorRead(result);
                }
                if (error) this.onError(result);
            });
    }

    private createErrors(traceErrors: any): LogMessage[] { // тут нет классов 
        let errorData = []; // тут нет классов 
        // join errors
        _.each(traceErrors, (item) => {
            if (angular.isObject(item) && angular.isArray(item.data)) {
                for (let i = 0; i < item.data.length; i++) {
                    errorData.push(item.data[i]);
                }
            }
        });

        return errorData;
    }

    private createErrorTree(traceErrors: LogMessage[]): IErrorMessages {
        let tree: IErrorMessages = {};
        if (angular.isArray(traceErrors)) {
            _.each(traceErrors, (item) => {
                let key;
                if (item.error) {
                    key = item.error.type;
                } else {
                    key = 'undefined';
                    item.error = new ErrorDescription();
                }

                if (!tree[key]) {
                    tree[key] = this.createRecord(key);
                }
                let record = this.createRecord(key);
                tree[key] = this.addToRecord(tree[key], item);
            });
        }

        return tree;
    }

    private prepareErrorTree(tree: IErrorMessages): IErrorMessages { //[]
        // sort each record
        _.each(tree, (item: ErrorMessageRecord) => {
            item = this.sortByTime(item);
        });

        // set first last and count property
        _.each(tree, (item: ErrorMessageRecord) => {
            if (item.items.length > 0) {
                item.count = item.items.length;
                item.first = item.items[item.items.length - 1].MomentTimeUtc;
                item.last = item.items[0].MomentTimeUtc
            }
        });
        return tree;
    }

    private createRecord(key: string): ErrorMessageRecord {
        let record: ErrorMessageRecord;

        record = {
            items: [],
            ErrorType: key,
            first: null,
            last: null,
            count: 0,
            collapsed: false,
            show: ErrorsMessagesVisability.Limit
        }

        return record;
    }

    private addToRecord(record: ErrorMessageRecord, item: LogMessage): ErrorMessageRecord {
        let errorItem: ErrorLogMessage;

        errorItem = new ErrorLogMessage;
        if (record && record.items) {
            errorItem.MomentTimeUtc = moment(item.time);
            errorItem.time = errorItem.MomentTimeUtc.toDate().getTime();
            errorItem.correlation_id = item.correlation_id;
            errorItem.time = item.time;
            errorItem.level = item.level;
            errorItem.error = item.error;
            errorItem.message = item.message;

            record.items.push(errorItem);
        }

        return record;
    }

    private sortByTime(collection: ErrorMessageRecord): ErrorMessageRecord {
        collection.items = _.sortBy(collection.items, function (item: ErrorLogMessage) {
            return item.time;
        });

        return collection;
    }

    public onRefreshClick(): void {
        this.updating = true;
        this.searchQuery = this.search;
        this.InitErrors();
    }

    public onRefreshChange(): void {
        this.setRefreshTimer()
    }

    public onClickErrorDetails(): void {
        // pipErrorDetailsDialog.show(
        // this.errorMessage);
    }

    public onSearchErrors(): void {
        this.searchQuery = this.search;
        this._location.search('search', this.searchQuery);
        this.onRefreshClick();
    }

    public onFilterErrors(): void {
        if (this.search || this.searchQuery) {
            this.searchQuery = this.search;
            this._location.search('search', this.searchQuery);
            this.onRefreshClick();
        }
    }

    public onErrorsDetails(item: LogMessage): void {
        /*this.stopRefresh = true
        this._pipErrorDetailsDialog.show({
            message: item.error.message,
            source: item.error.category,
            trace: item.error.stack_trace,
            correlationId: item.correlation_id,
            type: item.error.type,
            time: item.time
        },
            () => { this.stopRefresh = false; },
            () => { this.stopRefresh = false; }
        );*/
    }

    public onKeyPress = function (event: JQueryKeyEventObject): void {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            this.onSearchErrors();
        }
    }

    public onShowMore(item: ErrorMessageRecord): void {
        item.show = item.show + ErrorsMessagesVisability.Step;
    }

    public onShowLess(item: ErrorMessageRecord): void {
        item.show = ErrorsMessagesVisability.Limit;
    }

    public onBlur(): void {
        //  this.search = this._location.search().search || this._config.defaultSearch;
    }

}

(() => {
    angular
        .module('pipErrorsPanel', [])
        .component('pipErrorsPanel', {
            bindings: ErrorsPanelBindings,
            templateUrl: 'errors/ErrorsPanel.html',
            controller: ErrorsPanelController
        })

})();

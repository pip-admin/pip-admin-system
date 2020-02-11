declare module pip.system {


class CountersController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureCountersRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;



export class ErrorDescription {
    type: string;
    category: string;
    status: number;
    code: string;
    message: string;
    details: any;
    correlation_id: string;
    cause: string;
    stack_trace: string;
}

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
    [key: string]: ErrorMessageRecord;
}
export interface IConfigErrors {
    start: number;
    pageSize: number;
    refresh: number;
    defaultSearch: string;
    refreshEvent: string;
    refreshTimes: number[];
}
export class ConfigErrors implements IConfigErrors {
    readonly start: number;
    readonly pageSize: number;
    readonly refresh: number;
    readonly defaultSearch: string;
    readonly refreshEvent: string;
    readonly refreshTimes: number[];
}
export class ErrorsMessagesVisability {
    static Limit: number;
    static Step: number;
}


export interface ICountersDataProvider {
}
export interface ICountersDataService {
    readCounters(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IEventsDataProvider {
}
export interface IEventsDataService {
    readEvents(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface ILoggingDataProvider {
}
export interface ILoggingDataService {
    readLogging(params: any, start: number, take: number, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readErrors(params: any, start: number, take: number, successCallback?: (data: LogMessages) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface ISettingsDataProvider {
}
export interface ISettingsDataService {
    readSettings(section: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readSettingsSections(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createSettings(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateSettings(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveSettingsKey(section: string, key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IStatisticsDataProvider {
}
export interface IStatisticsDataService {
    readStatistics(section: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readStatisticsSections(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createStatistics(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateStatistics(section: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    getTotalStats(counter: string, dataCallback?: (data: any) => void, errorCallback?: (err: any) => void): any;
    getYearlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date, dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getMonthlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date, dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getDailyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date, dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
    getHourlyStats(counter: string, fromTimeUtc: Date, toTimeUtc: Date, dataCallback?: (data: StatCounterValue[]) => void, errorCallback?: (err: any) => void): any;
}


export enum LogLevel {
    None = 0,
    Fatal = 1,
    Error = 2,
    Warn = 3,
    Info = 4,
    Debug = 5,
    Trace = 6,
}
export class LogMessage {
    time: Date;
    source: string;
    level: LogLevel;
    correlation_id: string;
    error: ErrorDescription;
    message: string;
}
export class LogMessages {
    data: LogMessage[];
    total: number;
}


export enum StatCounterType {
    Total = 0,
    Year = 1,
    Month = 2,
    Day = 3,
    Hour = 4,
}
export class StatCounter {
    group: string;
    name: string;
}
export class StatCounterValue {
    year: number;
    month: number;
    day: number;
    hour: number;
    value: number;
}
export class StatCounterSet {
    group: string;
    name: string;
    type: StatCounterType;
    values: StatCounterValue[];
    counter?: any;
}


class ErrorsController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureErrorsRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;


class EventsController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureEventsRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;


export class LoggingsState {
    static Progress: string;
    static Data: string;
    static Empty: string;
}
export class LoggingModel {
    private pipLoggingData;
    loggings: LogMessage[];
    state: string;
    private total;
    private _start;
    private _take;
    constructor(pipLoggingData: ILoggingDataService);
    getLoggings(): LogMessage[];
    setLoggings(loggings: LogMessage[]): void;
    setState(state: string): void;
    getState(): string;
    readLogging(search?: string, callback?: () => void, errorcallback?: (error) => void): void;
    refreshLogging(search?: string, callback?: () => void, errorcallback?: (error) => void): void;
    private onLoggingRead(traces, callback?);
}

class LoggingController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureLoggingRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;


export interface ILoggingViewModel {
    logging: LogMessage[];
    state: string;
    readLogging(search?: string, callback?: () => void, errorcallback?: (error: any) => void): any;
    refreshLogging(search?: string, callback?: () => void, errorcallback?: (error: any) => void): any;
}

function configCountersResources(pipRestProvider: pip.rest.IRestProvider): void;

function configEventsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configLoggingResources(pipRestProvider: pip.rest.IRestProvider): void;

function configSettingsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configStatisticsResources(pipRestProvider: pip.rest.IRestProvider): void;

export class SettingsKey {
    name: string;
    data: any;
}
export class AddSettingsKeyDialogController {
    title: string;
    $mdDialog: angular.material.IDialogService;
    theme: any;
    key: SettingsKey;
    constructor(params: any, $mdDialog: angular.material.IDialogService, $injector: any, $rootScope: any);
    onOk(): void;
    onCancel(): void;
}

export interface IAddSettingsKeyService {
    show(params: any, successCallback?: (key: SettingsKey) => void, cancelCallback?: () => void): any;
}

export class AddSettingsSectionDialogController {
    $mdDialog: angular.material.IDialogService;
    theme: any;
    sectionName: string;
    constructor(params: any, $mdDialog: angular.material.IDialogService, $injector: any, $rootScope: any);
    onOk(): void;
    onCancel(): void;
}

export interface IAddSettingsSectionService {
    show(params: any, successCallback?: (settingsName: string) => void, cancelCallback?: () => void): any;
}

class SettingsController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureSettingsRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;

export class SettingSection {
    name: string;
    hide: boolean;
}

class StatisticsController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureStatisticsRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;


export class StatisticsFilter {
    static Yearly: string;
    static Monthly: string;
    static Daily: string;
    static Hourly: string;
    static Total: string;
    static All: string[];
}
export class counterStatistics {
    private _counter;
    private _statistics;
    private _value;
    private _seria;
    private _key;
    constructor(counter: string, statistics: StatCounterValue[], value?: number);
    statistics: StatCounterValue[];
    value: number;
    key: string;
    counter: string;
    seria: any;
}
export class statisticsGroup {
    private _group;
    private _series;
    private _counterStats;
    private _singleChartvalue;
    constructor(group: string, counterStats: counterStatistics[]);
    group: string;
    counterStats: counterStatistics[];
    series: any[];
    singleChartvalue: boolean;
}
export class chartValue {
    x: any;
    color: string;
    value: number;
    constructor(x: any, value: number, color?: string);
}
export class lineChartSeria {
    key: string;
    color: string;
    values: chartValue[];
    constructor(key: string, values: chartValue[], color?: string);
}
export class pieChartSeria {
    key: string;
    color: string;
    value: number;
    constructor(key: string, value: number, color?: string);
}
export class ToolsStatisticsGetFunctions {
    static Yearly: string;
    static Monthly: string;
    static Daily: string;
    static Hourly: string;
    static Total: string;
}
export class ToolsStatisticsFormatX {
    static Yearly: string;
    static Monthly: string;
    static Daily: string;
    static Hourly: string;
}
export class ToolsStatisticsFormatTickX {
    static Yearly(x: any): string;
    static Monthly(x: any): string;
    static Daily(x: any): string;
    static Hourly(x: any): string;
}
export class ToolsStatisticsDecade {
    name: string;
    value: any;
    constructor(value: any, name: string);
}
export interface IStatisticsService {
    formatXvalues(x: Date, category: string): chartValue;
    fillLineCharts(statistics: StatCounterValue[], dateFrom: Date, dateTo: Date, category: string): chartValue[];
    fillLast24LineCharts(statistics: StatCounterValue[], dateFrom: Date, dateTo: Date): chartValue[];
    getStatisticsLastActionDate(statistics: StatCounterSet[], statKey: string): Date;
    getStatisticsCount(statistics: StatCounterSet[], statKey: string): number;
}
export interface IStatisticsProvider extends ng.IServiceProvider {
}

class SearchRowController {
    private _element;
    private _scope;
    private _timeout;
    private pipOnSearch;
    private ngDisable;
    placeholder: string;
    localSearch: string;
    constructor($element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService);
    isDisable(): boolean;
    onSearch(): void;
    onClear(): void;
    onKeyPress: (event: JQueryKeyEventObject) => void;
}

}

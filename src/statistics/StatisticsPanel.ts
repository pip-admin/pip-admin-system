import { IStatisticsDataService } from '../data/IStatisticsDataService';
import { StatCounterValue, StatCounterSet } from '../data/StatCounters';
declare let moment;
import {
    IStatisticsService,
    ToolsStatisticsGetFunctions,
    ToolsStatisticsFormatX,
    ToolsStatisticsFormatTickX,
    ToolsStatisticsDecade,
    counterStatistics,
    pieChartSeria,
    statisticsGroup,
    chartValue,
    lineChartSeria,
    StatisticsFilter
} from "./StatisticsService";

class ToolsStatisticsStates {
    static Progress: string = 'progress';
    static Empty: string = 'empty';
    static Data: string = 'data';
}


interface IStatisticsPanelBindings {
    [key: string]: any;
}

const StatisticsPanelBindings: IStatisticsPanelBindings = {

}

class StatisticsPanelChanges implements ng.IOnChangesObject, IStatisticsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class StatisticsPanelController {
    public filters: string[] = StatisticsFilter.All;
    public filter: string;
    public state: string = ToolsStatisticsStates.Progress;
    public search: string;
    public counters: string[];
    public statistics: counterStatistics[];
    public statisticsGroups: statisticsGroup[];
    public transaction: pip.services.Transaction;
    public TOTAL: string = StatisticsFilter.Total;
    public hourlyDate: Date;
    public dailyDate: Date;
    public monthlyDate: Date;
    public yearlyDate: Date;
    public yearlyName: string;
    public chartXTickFormat: any;
    public decades: ToolsStatisticsDecade[];
    public pipMedia: pip.layouts.IMediaService

    private groups: any;
    private _rest: IStatisticsDataService;
    private _pipAuxPanel: pip.layouts.IAuxPanelService;
    private _$state: angular.ui.IStateService;
    private _$location: ng.ILocationService;
    private _$timeout: ng.ITimeoutService;
    private _pipDateConvert: pip.dates.IDateConvertService;//IDateTimeService;
    private _onlyUpdated: boolean = false;
    private _pipStatistics: IStatisticsService;
    private _pipToasts: any;
    constructor(
        $window: ng.IWindowService,
        $timeout: ng.ITimeoutService,
        $state: angular.ui.IStateService,
        $location: ng.ILocationService,
        pipStatisticsData: IStatisticsDataService,
        pipTransaction: pip.services.ITransactionService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        pipDateConvert: pip.dates.IDateConvertService,
        pipMedia: pip.layouts.IMediaService,
        pipStatistics: IStatisticsService,
        pipToasts: any
    ) {

        this.pipMedia = pipMedia;
        this._rest = pipStatisticsData;
        this._pipAuxPanel = pipAuxPanel;
        this._pipDateConvert = pipDateConvert;
        this._$state = $state;
        this._$location = $location;
        this._$timeout = $timeout;
        this._pipStatistics = pipStatistics;
        this._pipToasts = pipToasts;
        this.transaction = pipTransaction.create('statistics');
        this.chartXTickFormat = (x) => {
            if (this.filter == StatisticsFilter.Hourly) {
                //x += this._pipTimeZone.hoursOffset == undefined ? 0 : this._pipTimeZone.hoursOffset;
                x += x > 24 ? -24 : x < -24 ? 24 : 0;
            }

            return ToolsStatisticsFormatTickX[this.filter](x);
        }

        this.filter = $state.params['filter'] || StatisticsFilter.Hourly;
        this.search = $state.params['search'];
        this.configDates();
        this.getCounters();
    }

    private prepareDecades() {
        let stepsCount = 1;
        let utcStartYear = moment.utc().startOf('year').add('years', (-stepsCount * 10 - 6));
        this.decades = new Array<ToolsStatisticsDecade>();
        this.decades.push(new ToolsStatisticsDecade(moment.utc(utcStartYear).toDate(), utcStartYear.year().toString() + ' - ' + utcStartYear.add('years', 10).year().toString()));

        for (let i = -stepsCount + 1; i <= stepsCount; i++) {
            let start = _.cloneDeep(utcStartYear);
            let end = _.cloneDeep(utcStartYear.add('years', 10));
            this.decades.push(new ToolsStatisticsDecade(moment.utc(start).toDate(), start.year().toString() + ' - ' + end.year().toString()));
        }
    }

    private configDates() {
        this.prepareDecades();
        let utcDate = moment.utc();

        this.hourlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsFilter.Hourly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        this.dailyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsFilter.Daily) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        this.monthlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsFilter.Monthly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        utcDate.add('years', -6);
        this.yearlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsFilter.Yearly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
    }

    private getCounters() {
        this.transaction.begin('PROCESSING');
        this._rest.readStatisticsSections(null, (counters) => {
            this.counters = counters;
            if (this.counters.length > 0) {
                this.getStatistics();
            } else {
                this.transaction.end();
                this.state = ToolsStatisticsStates.Empty;
            }
        }, (error: any) => {
            this._pipToasts(error);
            this.transaction.end();
        });
    }

    private getEndDate() {
        let endDate;
        switch (this.filter) {
            case StatisticsFilter.Hourly:
                endDate = moment(this.hourlyDate).add('days', 1).add(0, 'hours').add('minutes', -1).toDate();
                //endDate = moment(this.hourlyDate).add('days', 1).add(-this._pipTimeZone.hoursOffset, 'hours').add('minutes', -1).toDate();
                break;
            case StatisticsFilter.Daily:
                endDate = moment(this.dailyDate).add('weeks', 1).add('minutes', -1).toDate();
                break;
            case StatisticsFilter.Monthly:
                endDate = moment(this.monthlyDate).add('years', 1).add('minutes', -1).toDate();
                break;
            case StatisticsFilter.Yearly:
                endDate = moment(this.yearlyDate).add('years', 10).add('minutes', -1).toDate();
                break;
        }

        return endDate;
    }

    private getStartDate() {
        let startDate;
        switch (this.filter) {
            case StatisticsFilter.Hourly:
                startDate = moment.utc(this.hourlyDate).startOf('day').add(0, 'hours').toDate();
                //startDate = moment.utc(this.hourlyDate).startOf('day').add(-this._pipTimeZone.hoursOffset, 'hours').toDate();
                this.hourlyDate = startDate;
                break;
            case StatisticsFilter.Daily:
                startDate = moment.utc(this.dailyDate).startOf('isoWeek').toDate();
                this.dailyDate = startDate;
                break;
            case StatisticsFilter.Monthly:
                startDate = moment.utc(this.monthlyDate).startOf('year').toDate();
                this.monthlyDate = startDate;
                break;
            case StatisticsFilter.Yearly:
                startDate = moment.utc(this.yearlyDate).startOf('year').toDate();
                this.yearlyDate = startDate;
                this.yearlyName = <string>_.result(_.find(this.decades, function (dec) {
                    return dec.value.toString() == startDate.toString();
                }), 'name');
                break;
        }

        this._$location.search('start', startDate);

        return startDate;
    }

    private getStatistics() {
        this.statistics = new Array<counterStatistics>();
        let dateStart: Date = this.getStartDate();
        let dateEnd: Date = this.getEndDate();
        _.each(this.counters, (counter, index) => {
            if (this.filter !== StatisticsFilter.Total) {
                this._rest[ToolsStatisticsGetFunctions[this.filter]](counter, dateStart, dateEnd,
                    (statistics: any) => {
                        //statistics = _.groupBy(statistics, 'group');
                        //[counter: '', values: [{value: 4, data}]]
                        console.log('st',statistics);
                        this.transaction.end();
                        let temp = new counterStatistics(counter, statistics);
                        temp.seria = this.prepareForLineCharts(statistics, counter, dateStart, dateEnd, this.filter);
                        console.log('temp', temp);
                        this.statistics.push(temp);

                        if (index === this.counters.length - 1) this.groupStatistics();
                    }, (error: any) => {
                        this._pipToasts(error);
                        this.transaction.end();
                    });
            } else {
                this._rest.getTotalStats(counter,
                    (statistics: any) => {
                    
                        this.transaction.end();
                        let temp = new counterStatistics(counter, statistics);
                        temp.seria = this.prepareForPieCharts(statistics, counter);
                          console.log('temp',temp);
                        
                        this.statistics.push(temp);

                        if (index === this.counters.length - 1) this.groupStatistics();
                    },
                    (error: any) => {
                        this._pipToasts(error);
                        this.transaction.end();
                    });
            }
        });
    }

    public clean() {
        this.search = null;
        this.searchClick();
    }

    // private formatXValues(x) {
    //     return x[ToolsStatisticsFormatX[this.filter]]();
    // }

    private prepareForPieCharts(statistics: any[], counter: string): pieChartSeria[] {
         let seria, serias: any[] = [], values;
        _.each(statistics, (item: any) => {
            console.log(item);
            seria = new pieChartSeria(item.counter, item.values[0].value);
            serias.push(seria);
        })
        return serias
    }

    private prepareForLineCharts(statistics: StatCounterValue[], counter: string, dateFrom: Date, dateTo: Date, category: string): lineChartSeria[] {
        let seria, serias: any[] = [], values;
        _.each(statistics, (item: any) => {
            values = this._pipStatistics.fillLineCharts(item.values, dateFrom, dateTo, category);
            seria = new lineChartSeria(item.counter, values);
            serias.push(seria);
        })
        console.log('v', values);
  

        return serias;
    }

    private groupStatistics() {
        this.groups = this.statistics;
        console.log('groups', this.groups);
        /*_.groupBy(this.statistics, (counterStats: counterStatistics) => {
            let oldCounter = _.clone(counterStats.counter);
            counterStats.counter = counterStats.counter.substr(oldCounter.lastIndexOf('.') + 1);

            return oldCounter.substr(0, oldCounter.lastIndexOf('.'));
        });*/

        this.filterStatistics();
    }

    public searchClick() {
        this._$location.search('search', this.search);
        this.transaction.begin('PROCESSING');
        this.filterStatistics();
    }

    public filterStatistics() {
        this.statisticsGroups = new Array<statisticsGroup>();
        _.each(this.groups, (group, name) => {
              console.log('statisticsGroups', group, name);
            if (!this.search || name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                this.statisticsGroups.push(new statisticsGroup(name, group))
        });

        this.state = this.statisticsGroups.length === 0 ? ToolsStatisticsStates.Empty : ToolsStatisticsStates.Data;
        this.transaction.end();
    }

    public refreshStatistics(filter?: string) {
        if (filter) this.filter = filter;
        if (this.statisticsGroups.length == 0) return; 

        this.state = ToolsStatisticsStates.Progress;
        this._$location.search('filter', this.filter);

        this.transaction.begin('PROCESSING');
        this.getStatistics();

        this._onlyUpdated = true;
        this._$timeout(() => {
            this._onlyUpdated = false;
        }, 4000);
    }

    public previousStep() {
        switch (this.filter) {
            case StatisticsFilter.Hourly:
                this.hourlyDate = moment.utc(this.hourlyDate).add('days', -1).toDate();
                break;
            case StatisticsFilter.Daily:
                this.dailyDate = moment.utc(this.dailyDate).add('weeks', -1).toDate();
                break;
            case StatisticsFilter.Monthly:
                this.monthlyDate = moment.utc(this.monthlyDate).add('years', -1).toDate();
                break;
            case StatisticsFilter.Yearly:
                this.yearlyDate = moment.utc(this.yearlyDate).add('years', -10).toDate();
                break;
        }

        this.refreshStatistics();
    }

    public nextStep() {
        switch (this.filter) {
            case StatisticsFilter.Hourly:
                this.hourlyDate = moment.utc(this.hourlyDate).add('days', 1).toDate();
                break;
            case StatisticsFilter.Daily:
                this.dailyDate = moment.utc(this.dailyDate).add('weeks', 1).toDate();
                break;
            case StatisticsFilter.Monthly:
                this.monthlyDate = moment.utc(this.monthlyDate).add('years', 1).toDate();
                break;
            case StatisticsFilter.Yearly:
                this.yearlyDate = moment.utc(this.yearlyDate).add('years', 10).toDate();
                break;
        }

        this.refreshStatistics();
    }

    public today() {
        let utcDate = moment.utc();

        switch (this.filter) {
            case StatisticsFilter.Hourly:
                this.hourlyDate = utcDate.toDate();
                break;
            case StatisticsFilter.Daily:
                this.dailyDate = utcDate.toDate();
                break;
            case StatisticsFilter.Monthly:
                this.monthlyDate = utcDate.toDate();
                break;
            case StatisticsFilter.Yearly:
                utcDate.year(2010);
                this.yearlyDate = utcDate.toDate();
                break;
        }

        this.refreshStatistics();
    }

    public updateDate() {
        if (!this._onlyUpdated) this.refreshStatistics();
    }

    public updateDecade(yearlyDate) {
        this.yearlyDate = yearlyDate;

        this.refreshStatistics();
    }


}

(() => {
    angular
        .module('pipStatisticsPanel', ['pipCharts'])
        .component('pipStatisticsPanel', {
            bindings: StatisticsPanelBindings,
            templateUrl: 'statistics/StatisticsPanel.html',
            controller: StatisticsPanelController
        })

})();

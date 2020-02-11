'use strict'
declare let moment;
import { StatCounterValue, StatCounterSet } from '../data/StatCounters';
import { IStatisticsDataService } from '../data/IStatisticsDataService';

export class StatisticsFilter {
    static Yearly: string = 'Yearly';
    static Monthly: string = 'Monthly';
    static Daily: string = 'Daily';
    static Hourly: string = 'Hourly';
    static Total: string = 'Total';
    static All: string[] = ['Total', 'Yearly', 'Monthly', 'Daily', 'Hourly'];
}

export class counterStatistics {
    private _counter: string;
    private _statistics: StatCounterValue[];
    private _value: number;
    private _seria: any;
    private _key: string;

    public constructor(counter: string, statistics: StatCounterValue[], value?: number) {
        this._counter = counter;
        this._statistics = statistics;
        this._value = value || undefined;
    }

    public get statistics(): StatCounterValue[] {
        return this._statistics;
    }

    public set statistics(statistics: StatCounterValue[]) {
        this._statistics = statistics;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
    }

    public get key(): string {
        return this._key;
    }

    public set key(value: string) {
        this._key = value;
    }

    public get counter(): string {
        return this._counter;
    }

    public set counter(counter: string) {
        this._counter = counter;
        if (this._seria) this._seria.key = counter;
    }

    public get seria(): any {
        return this._seria;
    }

    public set seria(seria: any) {
        this._seria = seria;
    }
}

export class statisticsGroup {
    private _group: string;
    private _series: any[];
    private _counterStats: counterStatistics[];
    private _singleChartvalue: boolean;

    public constructor(group: string, counterStats: counterStatistics[]) {
         console.log('1',group, counterStats);
        this._group = counterStats['counter'];
        _.each(counterStats['seria'], (cs, index) => {
            counterStats['seria'][index].key = counterStats['statistics'][index].name;
        })
        this._counterStats = counterStats;
        this._series = new Array<any>();
        _.each(this._counterStats['seria'], (cs) => {
            this._series.push(cs);

            this._singleChartvalue = this._singleChartvalue === false ? false : (cs.values !== undefined && cs.values.length === 1);
        });
    }

    public get group(): string {
        return this._group;
    }

    public set group(group: string) {
        this._group = group;
    }

    public get counterStats(): counterStatistics[] {
        return this._counterStats;
    }

    public set counterStats(counterStats: counterStatistics[]) {
        this._counterStats = counterStats;
    }

    public get series(): any[] {
        return this._series;
    }

    public set series(series: any[]) {
        this._series = series;
    }

    public get singleChartvalue(): boolean {
        return this._singleChartvalue;
    }

    public set singleChartvalue(singleChartvalue: boolean) {
        this._singleChartvalue = singleChartvalue;
    }
}

export class chartValue {
    public x: any;
    public color: string;
    public value: number;

    public constructor(x: any, value: number, color?: string) {
        this.x = x;
        this.value = value;
        this.color = color || undefined;
    }
}

export class lineChartSeria {
    public key: string;
    public color: string;
    public values: chartValue[];

    public constructor(key: string, values: chartValue[], color?: string) {
        this.key = key;
        this.values = values;
        this.color = color || undefined;
    }
}

export class pieChartSeria {
    public key: string;
    public color: string;
    public value: number;

    public constructor(key: string, value: number, color?: string) {
        this.key = key;
        this.value = value;
        this.color = color || undefined;
    }
}

export class ToolsStatisticsGetFunctions {
    static Yearly: string = 'getYearlyStats';
    static Monthly: string = 'getMonthlyStats';
    static Daily: string = 'getDailyStats';
    static Hourly: string = 'getHourlyStats';
    static Total: string = 'getTotalStats';
}

export class ToolsStatisticsFormatX {
    static Yearly: string = 'getUTCFullYear';
    static Monthly: string = 'getUTCMonth';
    static Daily: string = 'getUTCDate';
    static Hourly: string = 'getUTCHours';
}

export class ToolsStatisticsFormatTickX {
    public static Yearly(x): string {
        return Number(x).toFixed(0);
    }

    public static Monthly(x): string {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[x];
    }

    public static Daily(x): string {
        return Number(x).toFixed(0);
    }

    public static Hourly(x): string {
        x = Number(x);
        return x <= 12 ? x + ' am' : (x - 12) + ' pm';
    }
}
export class ToolsStatisticsDecade {
    public name: string;
    public value: any;

    public constructor(value: any, name: string) {
        this.name = name;
        this.value = value;
    }
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

class StatisticsService implements IStatisticsService {

    public constructor() {
        "ngInject";

    }

    public getStatisticsCount(statistics: StatCounterSet[], statKey: string): number {
        let count: number = 0;

        _.each(statistics, (item: StatCounterSet) => {
            let key = item.counter.split(".").pop();
            if (key == statKey) {

                _.each(item.values, function (a: any) {
                    count += a.value;
                })
            }
        });

        return count;
    }

    public getStatisticsLastActionDate(statistics: StatCounterSet[], statKey: string): Date {
        let date: any = { Day: 0, Hour: 0, Month: 0, Year: 0 };

        _.each(statistics, (item: StatCounterSet) => {
            let key = item.counter.split(".").pop();
            if (key == statKey) {
                _.each(item.values, (a: any) => {
                    if (date.year < a.year) {
                        date = a;
                    } else if (date.year == a.year && date.month < a.month) {
                        date = a;
                    } else if (date.year == a.year && date.month == a.month && date.day < a.day) {
                        date = a;
                    } else if (date.year == a.year && date.month == a.month && date.day == a.day && date.hour < a.hour) {
                        date = a;
                    }
                });
            }
        });

        if (date.year) {
            return moment.utc([date.year, date.month - 1, date.day, date.hour]).toDate();
        } else {
            return null;
        }
    }

    public formatXvalues(x: Date, category: string): chartValue {
        if (x === undefined || !category) return;

        return x[ToolsStatisticsFormatX[category]]();
    }

    public fillLast24LineCharts(statistics: StatCounterValue[], dateFrom: Date, dateTo: Date): chartValue[] {
        let from = moment.utc(dateFrom);
        let size: number;

        var sHour = moment(from).hour(),
            sDay = moment(from).date(),
            sMonth = moment(from).month(),
            sYear = moment(from).year(),
            values = new Array<chartValue>();

        size = 25;

        let startHours = dateFrom.getUTCHours();
        let h: number;
        for (h = 0; h < size; h++) {
            sHour = (startHours + h) % 24;
            let current = moment.utc([sYear, sMonth, sDay, 0]).add(startHours + h, 'hours');

            let statistic = _.find(statistics, (point) => {
                return sHour == point.hour && current.date() == point.day && current.month() + 1 == point.month && current.year() == point.year
            });
            let value = statistic ? statistic.value : 0;

            if (startHours === 0) {
                values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth, sDay, sHour]).toDate(), 'Hourly'), value));
            } else {
                values.push(new chartValue(startHours + h - 24, value));
            }

        }

        return values;
    }

    public fillLineCharts(statistics: StatCounterValue[], dateFrom: Date, dateTo: Date, category: string): chartValue[] {
        let from = moment.utc(dateFrom);
        let to = moment.utc(dateTo);
        let size: number;

        console.log('st2', statistics);

        let sHour = moment(from).hour(),
            sDay = moment(from).date(),
            sMonth = moment(from).month(),
            sYear = moment(from).year(),
            values = new Array<chartValue>();

        switch (category) {
            case StatisticsFilter.Hourly:
                size = to.diff(from, 'hours') + 1;
                if (size > 24) size = 24;
                if (size <= 0) break;

                let startHours = dateFrom.getUTCHours();
                let h: number;
                for (h = 0; h < size; h++) {
                    sHour = (startHours + h) % 24;
                    let current = moment.utc([sYear, sMonth, sDay, 0]).add(startHours + h, 'hours');
                    let statistic = _.find(statistics, (point) => {
                        return sHour == point.hour && current.date() == point.day && current.month() + 1 == point.month && current.year() == point.year
                    });
                    let value = statistic ? statistic.value : 0;

                    if (startHours === 0) {
                        values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth, sDay, sHour]).toDate(), category), value));
                    } else {
                        values.push(new chartValue(startHours + h - 24, value));
                    }
                }
                break;
            case StatisticsFilter.Daily:
                size = to.diff(from, 'days') + 1;
                sHour = null;
                let day: number;
                for (day = sDay; day < sDay + size; day++) {
                    let statistic = _.find(statistics, (point) => {
                        return day == point.day && sMonth + 1 == point.month && sYear == point.year
                    });
                    let value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth, day]).toDate(), category), value));
                }
                break;
            case StatisticsFilter.Monthly:
                sHour = null;
                sDay = null;
                for (sMonth = 0; sMonth < 12; sMonth++) {
                    let statistic = _.find(statistics, (point) => {
                        return sMonth + 1 == point.month && sYear == point.year
                    });
                    let value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth]).toDate(), category), value));
                }
                break;
            case StatisticsFilter.Yearly:
                let i: number;
                size = to.diff(from, 'years') + 1;
                sHour = null;
                sDay = null;
                sMonth = null;
                for (i = sYear; i < sYear + size + 1; i++) {
                    let statistic = _.find(statistics, (point) => {
                        return i == point.year
                    });
                    let value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([i]).toDate(), category), value));
                }
                break;
        }

        return values;
    }

}

class StatisticsProvider implements IStatisticsProvider {
    private _service: StatisticsService;

    constructor() {
    }

    public $get() {
        "ngInject";

        if (this._service == null)
            this._service = new StatisticsService();

        return this._service;
    }
}

angular
    .module('pipStatisticsService', [])
    .provider('pipStatistics', StatisticsProvider);

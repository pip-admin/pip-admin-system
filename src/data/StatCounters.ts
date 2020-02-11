export enum StatCounterType
{
    Total = 0,
    Year = 1,
    Month = 2,
    Day = 3,
    Hour = 4
}

export class StatCounter
{
    public group: string;
    public name: string;
}

export class StatCounterValue
{
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public value: number;
}

export class StatCounterSet
{
    public group: string;
    public name: string;
    public type: StatCounterType;
    public values: StatCounterValue[];
    public counter?: any;
}

import { ICountersDataService } from '../data/ICountersDataService';

interface ICountersPanelBindings {
    [key: string]: any;
}

const CountersPanelBindings: ICountersPanelBindings = {

}

class CountersPanelChanges implements ng.IOnChangesObject, ICountersPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class CountersPanelController {
    public counters: any[];

    constructor(
        private $state: ng.ui.IStateService,
        private pipCountersData: ICountersDataService,
        public pipMedia: pip.layouts.IMediaService) {
        this.readCounters();
    }

    private readCounters() {

        this.pipCountersData.readCounters(null, (results) => { this.counters = results.data; console.log(this.counters, results); });
    }
}

(() => {
    angular
        .module('pipCountersPanel', [])
        .component('pipCountersPanel', {
            bindings: CountersPanelBindings,
            templateUrl: 'counters/CountersPanel.html',
            controller: CountersPanelController
        })

})();

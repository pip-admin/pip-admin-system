import { IEventsDataService } from '../data/IEventsDataService';

interface IEventsPanelBindings {
    [key: string]: any;
}

const EventsPanelBindings: IEventsPanelBindings = {

}

class EventsPanelChanges implements ng.IOnChangesObject, IEventsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class EventsState {
    static Progress: string = 'progress';
    static Data: string = 'data';
    static Empty: string = 'empty';
}

class EventsFilter {
    static Component: string = 'Component';
    static Severity: string = 'Severity';
    static Type: string = 'Type';
    static All: string[] = ['Component', 'Severity', 'Type'];
}


class EventsPanelController {
    public events: any[] = [];
    private _start: number = 0;
    private _take: number = 100;

    public search: string = '';
    public state: string = EventsState.Progress;
    public progress: boolean;
    public updating: boolean;
    public error: string = null;


    constructor(
        private $location: ng.ILocationService,
        private $state: ng.ui.IStateService,
        private pipEventsData: IEventsDataService,
        public pipMedia: pip.layouts.IMediaService,
        private pipToasts: pip.controls.IToastService) {
        this.readEvents();
    }


     public clear() {
        this.search = null;
        this.refreshEvents();
    }

    public readEvents() {
        this.updating = true;

         this.pipEventsData.readEvents(
            this.getFilter(), this._start, this._take,(events: any) => {
                this.onReadEvents(events);
            },
            (err: any) => {
                this.onReadEventsError(err);
            }
        );

    }

     private getFilter() {
        return this.search ? {Search: this.search} : {};
    }

    private onReadEventsError(error) {
        this.error = error;//this._bbHandleErrors.parseError(error);
    }

    private onReadEvents(events: any) {
        this.error = null;
        _.each(events.data, (trace, $index) => {
            if (this._start === 0 && this.events[$index]) {
                this.events[$index] = trace;
            } else {
                this.events.push(trace);
            }
        });
        if (this._start === 0 && events.data.length < this._take) {
            this.events.splice(events.data.length, this._take - events.data.length);
        }

        this._start += this._take;
        this._take = 100;
        this.state = events.data.length > 0 || (this._start !== 0 && this.events.length > 0) ? 
                     EventsState.Data : EventsState.Empty;
    
        this.updating = false;
    }

    public refreshEvents() {
        this._take = this._start > 0 ? this._start : 100;
        this._start = 0;
        this.$location.search('search', this.search);

        this.readEvents();
    }
}

(() => {
    angular
        .module('pipEventsPanel', [])
        .component('pipEventsPanel', {
            bindings: EventsPanelBindings,
            templateUrl: 'events/EventsPanel.html',
            controller: EventsPanelController
        })

})();

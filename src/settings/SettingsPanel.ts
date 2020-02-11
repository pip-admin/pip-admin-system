import { ISettingsDataService } from '../data/ISettingsDataService';
import { IAddSettingsSectionService } from './AddSettingsSectionService';
import { IAddSettingsKeyService } from './AddSettingsKeyService';

interface ISettingsPanelBindings {
    [key: string]: any;
}

const SettingsPanelBindings: ISettingsPanelBindings = {

}

class SettingsPanelChanges implements ng.IOnChangesObject, ISettingsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class SettingsState {
    static Progress: string = 'progress';
    static Data: string = 'data';
    static Empty: string = 'empty';
}


export class SettingSection {
    public name: string;
    public hide: boolean = false;
}


class SettingsPanelController {
    public settingsSections: SettingSection[];
    public settings: any[];//ISettingsMessages[];
    public search: string = null;
    public selectIndex: number;
    public details: boolean;
    public state: string = SettingsState.Progress;
    public error: string = null;
    public transaction: pip.services.Transaction;
    public getSelectDropdown: Function;

    constructor(
        private $window: ng.IWindowService,
        private $location: ng.ILocationService,
        private pipToasts: pip.controls.IToastService,
        pipTransaction: pip.services.ITransactionService,
        $log: ng.ILogService,
        private pipAddSettingsSectionDialog: IAddSettingsSectionService,
        private $state: ng.ui.IStateService,
        private pipSettingsData: ISettingsDataService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAddSettingsKeyDialog: IAddSettingsKeyService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService) {

        this.transaction = pipTransaction.create('settings');
        this.search = this.$location.search().search;
        this.readSettings();
        this.selectIndex = 0;

        this.getSelectDropdown = () => {
            this.selectItem(this.selectIndex);
        }
    }

    private readSettings() {
        this.transaction.begin('Reading settings');

        this.state = SettingsState.Empty;
        this.transaction.end();
        this.pipSettingsData.readSettingsSections({},
            (settingsSections: string[]) => {
                this.state = SettingsState.Progress;
                this.onSettingsRead(settingsSections);
                if (settingsSections.length > 0) {
                    this.state = SettingsState.Data;
                } else {
                    this.state = SettingsState.Empty;
                }
            },
            (error: any) => {
                this.onError(error);
            });
        /*this.pipSettingsData.getSettingSections(
            (settingsSections: string[]) => {
                this.state = SettingsState.Progress;
                this.onSettingsRead(settingsSections);
                if (settingsSections.length > 0) {
                    this.state = SettingsState.Data;
                } else {
                    this.state = SettingsState.Empty;
                }
            },
            (error: any) => {
                this.onError(error);
            }
        );*/
    }

    public onSearch() {
        this.$location.search('search', this.search);

        _.each(this.settingsSections, (item: SettingSection, index: number) => {
            this.settingsSections[index].hide = this.filterSections(item.name);
        })
        if (!this.settingsSections[this.selectIndex] || this.settingsSections[this.selectIndex].hide == true) {
            let index: number = _.findIndex(this.settingsSections, { hide: false })
            if (index == -1) {
                this.state = SettingsState.Empty;
                this.selectIndex = null;
            } else {
                this.state = SettingsState.Data;
                this.selectItem(index);
            }
        }
    }

    public clean() {
        this.search = null;
        this.onSearch();
    }

    private filterSections(section): boolean {
        if (!this.search || this.search == '') {
            return false;
        }

        if (section.indexOf(this.search) != -1) {
            return false;
        } else {
            return true;
        }
    }

    private onSettingsRead(settingsSections: string[]) {
        this.settingsSections = [];
        _.each(settingsSections, (item: string) => {
            this.settingsSections.push({ name: item, hide: false });
        })
        this.settings = [];

        _.each(this.settingsSections, (section: SettingSection, index: number) => {
            if (section.name === this.$location.search().section) {
                this.selectIndex = index;
            }

            this.pipSettingsData.readSettings(section.name, (settings) => {
                let keys: string[] = _.keys(settings);

                keys = _.map(keys, (key) => {
                    if (key == '$promise' || key == '$resolved') return key;

                    let split: string[] = _.split(key, '.');
                    let newKey: string = '';
                    _.each(split, (k: string, index: number) => {
                        newKey += k;
                        if (index != split.length - 1) {
                            newKey += '.<wbr>';
                        }
                    })
                    return newKey;
                })
                let settingsN = _.zipObject(keys, _.values(settings));

                this.settings[index] = settingsN;
                this.transaction.end();
                this.state = SettingsState.Data;
            }, (error: any) => {
                this.transaction.abort();
                this.pipToasts.showError(error, null, null, null, null);
            });

        });
    }

    private onError(error: any) {
        this.error = error;
        this.transaction.end(error);
    }

    public selectItem(index: number) {
        this.selectIndex = index;
        this.$location.search('section', this.settingsSections[index].name);
    }

    public updateKey(name: string, data: string) {
        this.pipAddSettingsKeyDialog.show(
            {
                section: this.settingsSections[this.selectIndex],
                name: name,
                data: data
            },
            (key) => {
                this.transaction.begin('add section');
                if (name == key.name) {
                    this.addKeyDialogCallback(key);
                } else {
                    this.updateKeyDialogCallback(key, name);
                }
            })
    }

    private updateKeyDialogCallback(key, name) {
        name = name.replace('.', '.<wbr>');
        key.name = key.name.replace('.', '.<wbr>');
        //this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], name);
        //this.settings[this.selectIndex][key.name] = key.data;
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, key.name,
            (data) => {
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.abort();

                this.pipToasts.showError(error, null, null, null, null);
            });
    }

    public openDeleteKeyDialog(key: string, value: string) {
        this.pipConfirmationDialog.show(
            {
                event: null,
                title: 'Delete settings key?',
                ok: 'Delete',
                cancel: 'Cancel'
            },
            () => {
                this.deleteKey(key, value);
            },
            () => {
                console.log('You disagreed');
            }
        );
    }

    public deleteKey(key: string, value: string) {
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], key);
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], '$promise');
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], '$resolved');
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, this.settings[this.selectIndex],
            (data) => {
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.abort();

                this.pipToasts.showError(error, null, null, null, null);
            });
    }

    public addKey() {
        this.pipAddSettingsKeyDialog.show({ section: this.settingsSections[this.selectIndex] }, (key) => {
            this.addKeyDialogCallback(key);
        })
    }

    private addKeyDialogCallback(key) {
        this.transaction.begin('add section');

        let settings = {}, keys: string[] = _.keys(this.settings[this.selectIndex]),
            values = _.values(this.settings[this.selectIndex]);
        for (let i: number = 0; i < values.length; i++) {
            if (keys[i] != '$promise' && keys[i] != '$resolved') {
                settings[keys[i]] = values[i];
            }
        }
        settings[key.name] = key.data;
        console.log(settings);
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, settings,
            () => {
                this.saveKeyCallback(key);
            },
            (error: any) => {
                this.transaction.abort();
                this.pipToasts.showError(error, null, null, null, null);
            });

    }

    private saveKeyCallback(key) {
        this.transaction.end();

        key.name = key.name.replace('.', '.<wbr>');
        if (!this.settings[this.selectIndex]) {
            this.settings[this.selectIndex] = {};
        }
        this.settings[this.selectIndex][key.name] = key.data;
    }

    private errorkeyCallback(error: any) {
        this.transaction.abort();
        this.pipToasts.showError(error, null, null, null, null);
    }

    public addSection() {
        this.pipAddSettingsSectionDialog.show({}, (sectionName: string) => {
            this.addSectionDialogCallback(sectionName);
        })
    }

    private addSectionDialogCallback(sectionName: string, data: any = {}) {
        this.transaction.begin('Adding section');
        this.pipSettingsData.createSettings(sectionName, data,
            () => {
                this.saveSectionCallback(sectionName);
            },
            (error: any) => {
                this.errorkeyCallback(error);
            });
    }

    private saveSectionCallback(data: string) {
        this.transaction.end();
        this.settingsSections.push({ name: data, hide: this.filterSections(data) }); // todo
        this.selectItem(this.settingsSections.length - 1);
    }

    private errorSectionCallback(error) {
        this.transaction.end('error');
        this.pipToasts.showError(error, null, null, null, null);
    }


}

(() => {
    angular
        .module('pipSettingsPanel', ['pipAddSettingsSectionDialog', 'pipAddSettingsKeyDialog'])
        .component('pipSettingsPanel', {
            bindings: SettingsPanelBindings,
            templateUrl: 'settings/SettingsPanel.html',
            controller: SettingsPanelController
        })

})();


import { SettingsKey } from "./AddSettingsKeyController";

export interface IAddSettingsKeyService {
    show(params: any, successCallback?: (key: SettingsKey) => void, cancelCallback?: () => void): any;
}

class AddSettingsKeyService implements IAddSettingsKeyService {
    public _mdDialog: angular.material.IDialogService;
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }
    public show(params, successCallback?: (key: SettingsKey) => void, cancelCallback?: () => void) {
         this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'settings/AddSettingsKeyDialog.html',
            controller: 'pipAddSettingsKeyDialogController',
            controllerAs: '$ctrl',
            locals: {params: params},
            clickOutsideToClose: true
         })
        .then((key: SettingsKey) => {
            if (successCallback) {
                successCallback(key);
            }
        }, () => {
            if (cancelCallback) {
                cancelCallback();
            }
        });
                
    }
    
}

angular
    .module('pipAddSettingsKeyDialog')
    .service('pipAddSettingsKeyDialog', AddSettingsKeyService);
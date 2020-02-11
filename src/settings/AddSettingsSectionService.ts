
export interface IAddSettingsSectionService {
    show(params: any, successCallback?: (settingsName: string) => void, cancelCallback?: () => void): any;
}

class AddSettingsSectionService implements IAddSettingsSectionService {
    public _mdDialog: angular.material.IDialogService;
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }
    public show(params, successCallback?: (settingsName: string) => void, cancelCallback?: () => void) {
         this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'settings/AddSettingsSectionDialog.html',
            controller: 'pipAddSettingsSectionDialogController',
            controllerAs: '$ctrl',
            locals: {params: params},
            clickOutsideToClose: true
         })
        .then((settingsName: string) => {
            if (successCallback) {
                successCallback(settingsName);
            }
        }, () => {
            if (cancelCallback) {
                cancelCallback();
            }
        });
                
    }
    
}

angular
    .module('pipAddSettingsSectionDialog')
    .service('pipAddSettingsSectionDialog', AddSettingsSectionService);
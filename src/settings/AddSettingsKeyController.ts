'use strict';

export class SettingsKey {
    name: string;
    data: any;
}

export class AddSettingsKeyDialogController {
    public title: string = "New settings key";
    public $mdDialog: angular.material.IDialogService;
    public theme;
    public key: SettingsKey;

    constructor(
        params,
        $mdDialog: angular.material.IDialogService,
        $injector,
        $rootScope) {
        "ngInject";

        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.key = new SettingsKey();
        this.key.name = params.name ? params.name.replace('<wbr>', '') : null;
        this.key.data = params.data;

        if (params.name && params.data) {
            this.title = "Edit settings key";
        }
    }

    public onOk(): void {
        this.$mdDialog.hide(this.key);
    }

    public onCancel(): void {
        this.$mdDialog.cancel();
    }
}

angular
    .module('pipAddSettingsKeyDialog', ['ngMaterial'])
    .controller('pipAddSettingsKeyDialogController', AddSettingsKeyDialogController);

import './AddSettingsKeyService';
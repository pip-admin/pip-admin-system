'use strict';

export class AddSettingsSectionDialogController {

    public $mdDialog: angular.material.IDialogService;
    public theme;
    public sectionName: string;

    constructor(
        params,
        $mdDialog: angular.material.IDialogService,
        $injector,
        $rootScope) {
        "ngInject";

        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
    
    }

    public onOk(): void {
        this.$mdDialog.hide(this.sectionName);
    }

    public onCancel(): void {
        this.$mdDialog.cancel();
    }
}

angular
    .module('pipAddSettingsSectionDialog', ['ngMaterial'])
    .controller('pipAddSettingsSectionDialogController', AddSettingsSectionDialogController);

import './AddSettingsSectionService';
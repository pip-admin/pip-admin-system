class StatisticsController {
    constructor(
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        $state: ng.ui.IStateService,
        $rootScope: ng.IRootScopeService,
        $mdMedia: angular.material.IMedia,
        $injector: angular.auto.IInjectorService,
        private pipNavService: pip.nav.INavService
    ) {
        "ngInject";

        let pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Statistics';
        this.pipNavService.actions.hide();
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureStatisticsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider//: ng.ui.IStateProvider
) {
    "ngInject";

    $stateProvider
        .state('statistics', {
            url: '/statistics',
            controller: StatisticsController,
            auth: false,
            controllerAs: '$ctrl',
            templateUrl: 'statistics/StatisticsPage.html'
        });
}



(() => {

    angular
        .module('pipStatisticsPage', ['pipNav'])
        .config(configureStatisticsRoute)

})();

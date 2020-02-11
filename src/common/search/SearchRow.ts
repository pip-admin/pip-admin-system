class SearchRowController {
    private _element;
    private _scope: angular.IScope;
    private _timeout: ng.ITimeoutService;
    private pipOnSearch: Function;
    private ngDisable: Function;
    public placeholder: string;

    public localSearch: string;
    
    constructor(
        $element: any,
        $attrs: angular.IAttributes,
        $scope: angular.IScope,
        $timeout: ng.ITimeoutService
    ) {
        "ngInject";

        $element.addClass('pip-search-row');
        $element.addClass('flex');

        this._element = $element;
        this._scope = $scope;
        this._timeout = $timeout;

        this.pipOnSearch = $scope['onSearch'] ?  $scope['onSearch'] : null;

        this.placeholder = $scope['placeholder'] ?  $scope['placeholder'] : 'SEARCH_ROW_PLACEHOLDER';

        $scope.$watch('search', (search: string) => {
            if (search != this.localSearch) {
                this.localSearch = search;
            }
        });
    }

    public isDisable(): boolean {
        this.ngDisable = this._scope['ngDisabled'] ? this._scope['ngDisabled'] : null;

        return _.isFunction(this.ngDisable) && this.ngDisable();
    }

    public onSearch(): void {
        if (this.isDisable()) {
            return;
        }
        this._scope['search'] = this.localSearch;        

        this._timeout(() => {
            if (_.isFunction(this.pipOnSearch)) {
                this.pipOnSearch();
            }            
        }, 200);
    }
    
    public onClear() {
        if (this.isDisable()) {
            return;
        }

        this.localSearch = null;
        this.onSearch();        
    }

    public onKeyPress = function (event: JQueryKeyEventObject): void {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            this.onSearch()
        }
    } 

}

(() => {
    function SearchRowDirective() {
        return {
            restrict: 'E',
            controller: SearchRowController,
            controllerAs: 'searchRow',
            scope: {
                search: '=pipSearch',
                onSearch: '&pipOnSearch',
                placeholder: '=pipPlaceholder',
                ngDisabled: '&'
            },
            templateUrl: 'common/search/SearchRow.html'
        };
    }

    function declareSearchRowResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            SEARCH_ROW_PLACEHOLDER: 'Search ...',

        });
        pipTranslateProvider.translations('ru', {
            SEARCH_ROW_PLACEHOLDER: 'Найти ...',
        });
    }

    angular
        .module('pipDirective', [])
        .directive('pipSearchRow', SearchRowDirective)
        .config(declareSearchRowResources);

})();
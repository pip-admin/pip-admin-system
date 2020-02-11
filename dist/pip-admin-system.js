(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).system = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var SearchRowController = (function () {
    SearchRowController.$inject = ['$element', '$attrs', '$scope', '$timeout'];
    function SearchRowController($element, $attrs, $scope, $timeout) {
        "ngInject";
        var _this = this;
        this.onKeyPress = function (event) {
            if (event.keyCode === 13) {
                event.stopPropagation();
                event.preventDefault();
                this.onSearch();
            }
        };
        $element.addClass('pip-search-row');
        $element.addClass('flex');
        this._element = $element;
        this._scope = $scope;
        this._timeout = $timeout;
        this.pipOnSearch = $scope['onSearch'] ? $scope['onSearch'] : null;
        this.placeholder = $scope['placeholder'] ? $scope['placeholder'] : 'SEARCH_ROW_PLACEHOLDER';
        $scope.$watch('search', function (search) {
            if (search != _this.localSearch) {
                _this.localSearch = search;
            }
        });
    }
    SearchRowController.prototype.isDisable = function () {
        this.ngDisable = this._scope['ngDisabled'] ? this._scope['ngDisabled'] : null;
        return _.isFunction(this.ngDisable) && this.ngDisable();
    };
    SearchRowController.prototype.onSearch = function () {
        var _this = this;
        if (this.isDisable()) {
            return;
        }
        this._scope['search'] = this.localSearch;
        this._timeout(function () {
            if (_.isFunction(_this.pipOnSearch)) {
                _this.pipOnSearch();
            }
        }, 200);
    };
    SearchRowController.prototype.onClear = function () {
        if (this.isDisable()) {
            return;
        }
        this.localSearch = null;
        this.onSearch();
    };
    return SearchRowController;
}());
(function () {
    declareSearchRowResources.$inject = ['pipTranslateProvider'];
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
    function declareSearchRowResources(pipTranslateProvider) {
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
},{}],3:[function(require,module,exports){
configureCountersRoute.$inject = ['$injector', '$stateProvider'];
var CountersController = (function () {
    CountersController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function CountersController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    CountersController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Counters';
        this.pipNavService.actions.hide();
    };
    CountersController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return CountersController;
}());
function configureCountersRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('counters', {
        url: '/counters',
        controller: CountersController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'counters/CountersPage.html'
    });
}
(function () {
    angular
        .module('pipCountersPage', ['pipNav'])
        .config(configureCountersRoute);
})();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CountersPanelBindings = {};
var CountersPanelChanges = (function () {
    function CountersPanelChanges() {
    }
    return CountersPanelChanges;
}());
var CountersPanelController = (function () {
    CountersPanelController.$inject = ['$state', 'pipCountersData', 'pipMedia'];
    function CountersPanelController($state, pipCountersData, pipMedia) {
        this.$state = $state;
        this.pipCountersData = pipCountersData;
        this.pipMedia = pipMedia;
        this.readCounters();
    }
    CountersPanelController.prototype.readCounters = function () {
        var _this = this;
        this.pipCountersData.readCounters(null, function (results) { _this.counters = results.data; console.log(_this.counters, results); });
    };
    return CountersPanelController;
}());
(function () {
    angular
        .module('pipCountersPanel', [])
        .component('pipCountersPanel', {
        bindings: CountersPanelBindings,
        templateUrl: 'counters/CountersPanel.html',
        controller: CountersPanelController
    });
})();
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CountersData = (function () {
    CountersData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function CountersData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'counters';
    }
    CountersData.prototype.readCounters = function (params, successCallback, errorCallback) {
        return this.pipRest.getResource('counters').get({}, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return CountersData;
}());
var CountersDataProvider = (function () {
    function CountersDataProvider() {
        this.RESOURCE = 'counters';
    }
    CountersDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new CountersData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return CountersDataProvider;
}());
angular
    .module('pipCountersData', ['pipRest'])
    .provider('pipCountersData', CountersDataProvider);
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorDescription = (function () {
    function ErrorDescription() {
    }
    return ErrorDescription;
}());
exports.ErrorDescription = ErrorDescription;
},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LogMessage_1 = require("./LogMessage");
var ErrorLogMessage = (function (_super) {
    __extends(ErrorLogMessage, _super);
    function ErrorLogMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ErrorLogMessage;
}(LogMessage_1.LogMessage));
exports.ErrorLogMessage = ErrorLogMessage;
var ErrorMessageRecord = (function () {
    function ErrorMessageRecord() {
    }
    return ErrorMessageRecord;
}());
exports.ErrorMessageRecord = ErrorMessageRecord;
var ConfigErrors = (function () {
    function ConfigErrors() {
        this.start = 0;
        this.pageSize = 100;
        this.refresh = 3;
        this.defaultSearch = '';
        this.refreshEvent = 'TOOLS.ERRORS_REFRESH';
        this.refreshTimes = [1, 2, 3, 5, 10];
    }
    return ConfigErrors;
}());
exports.ConfigErrors = ConfigErrors;
var ErrorsMessagesVisability = (function () {
    function ErrorsMessagesVisability() {
    }
    return ErrorsMessagesVisability;
}());
ErrorsMessagesVisability.Limit = 50;
ErrorsMessagesVisability.Step = 50;
exports.ErrorsMessagesVisability = ErrorsMessagesVisability;
},{"./LogMessage":14}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventsData = (function () {
    EventsData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function EventsData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'events';
    }
    EventsData.prototype.readEvents = function (params, start, take, successCallback, errorCallback) {
        if (start === void 0) { start = 0; }
        if (take === void 0) { take = 100; }
        if (!params)
            params = {};
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('events').get(params, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return EventsData;
}());
var EventsDataProvider = (function () {
    function EventsDataProvider() {
        this.RESOURCE = 'events';
    }
    EventsDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new EventsData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return EventsDataProvider;
}());
angular
    .module('pipEventsData', ['pipRest'])
    .provider('pipEventsData', EventsDataProvider);
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Fatal"] = 1] = "Fatal";
    LogLevel[LogLevel["Error"] = 2] = "Error";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Info"] = 4] = "Info";
    LogLevel[LogLevel["Debug"] = 5] = "Debug";
    LogLevel[LogLevel["Trace"] = 6] = "Trace";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogMessage = (function () {
    function LogMessage() {
    }
    return LogMessage;
}());
exports.LogMessage = LogMessage;
var LogMessages = (function () {
    function LogMessages() {
    }
    return LogMessages;
}());
exports.LogMessages = LogMessages;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggingData = (function () {
    LoggingData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function LoggingData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'logging';
    }
    LoggingData.prototype.filterToString = function (filter) {
        if (filter == null)
            return null;
        var result = '';
        for (var key in filter) {
            if (result.length > 0)
                result += ';';
            var value = filter[key];
            if (value != null)
                result += key + '=' + value;
            else
                result += key;
        }
        return result;
    };
    LoggingData.prototype.readLogging = function (params, start, take, successCallback, errorCallback) {
        if (start === void 0) { start = 0; }
        if (take === void 0) { take = 100; }
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('logging').get(params, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    LoggingData.prototype.readErrors = function (params, start, take, successCallback, errorCallback) {
        if (start === void 0) { start = 0; }
        if (take === void 0) { take = 100; }
        params.skip = start;
        params.take = take;
        params.total = true;
        return this.pipRest.getResource('errors').get(params, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return LoggingData;
}());
var LoggingDataProvider = (function () {
    function LoggingDataProvider() {
        this.RESOURCE = 'logging';
    }
    LoggingDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new LoggingData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return LoggingDataProvider;
}());
angular
    .module('pipLoggingData', ['pipRest'])
    .provider('pipLoggingData', LoggingDataProvider);
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsData = (function () {
    SettingsData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function SettingsData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'settings';
    }
    SettingsData.prototype.readSettingsSections = function (params, successCallback, errorCallback) {
        return this.pipRest.getResource('settings_section').get({}, function (data) {
            if (successCallback) {
                successCallback(data.data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    SettingsData.prototype.readSettings = function (section, successCallback, errorCallback) {
        return this.pipRest.getResource('settings').get({
            section: section
        }, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    SettingsData.prototype.createSettings = function (section, data, successCallback, errorCallback) {
        if (data === void 0) { data = {}; }
        console.log('section', section, this.pipRest.getResource('settings'));
        return this.pipRest.getResource('settings').save({ section: section }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    SettingsData.prototype.updateSettings = function (section, data, successCallback, errorCallback) {
        return this.pipRest.getResource('settings').update({
            section: section
        }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    SettingsData.prototype.saveSettingsKey = function (section, key, value, successCallback, errorCallback) {
        return this.pipRest.getResource('settings').save({
            section: section,
            key: key
        }, value, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return SettingsData;
}());
var SettingsDataProvider = (function () {
    function SettingsDataProvider() {
        this.RESOURCE = 'settings';
    }
    SettingsDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new SettingsData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return SettingsDataProvider;
}());
angular
    .module('pipSettingsData', ['pipRest'])
    .provider('pipSettingsData', SettingsDataProvider);
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatCounterType;
(function (StatCounterType) {
    StatCounterType[StatCounterType["Total"] = 0] = "Total";
    StatCounterType[StatCounterType["Year"] = 1] = "Year";
    StatCounterType[StatCounterType["Month"] = 2] = "Month";
    StatCounterType[StatCounterType["Day"] = 3] = "Day";
    StatCounterType[StatCounterType["Hour"] = 4] = "Hour";
})(StatCounterType = exports.StatCounterType || (exports.StatCounterType = {}));
var StatCounter = (function () {
    function StatCounter() {
    }
    return StatCounter;
}());
exports.StatCounter = StatCounter;
var StatCounterValue = (function () {
    function StatCounterValue() {
    }
    return StatCounterValue;
}());
exports.StatCounterValue = StatCounterValue;
var StatCounterSet = (function () {
    function StatCounterSet() {
    }
    return StatCounterSet;
}());
exports.StatCounterSet = StatCounterSet;
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatisticsData = (function () {
    StatisticsData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function StatisticsData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'statistics';
    }
    StatisticsData.prototype.readStatisticsSections = function (params, successCallback, errorCallback) {
        return this.pipRest.getResource('statistics_section').get({}, function (data) {
            if (successCallback) {
                successCallback(data.data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    StatisticsData.prototype.readStatistics = function (section, successCallback, errorCallback) {
        return this.pipRest.getResource('statistics').get({
            section: section
        }, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    StatisticsData.prototype.getStats = function (counter, type, fromTimeUtc, toTimeUtc, dataCallback, errorCallback) {
        if (type === void 0) { type = 0; }
        console.log('type', type);
        var params = {};
        if (counter != null)
            params.counter = counter;
        if (type != null)
            params.type = type;
        if (fromTimeUtc != null)
            params.fromTimeUtc = fromTimeUtc;
        if (toTimeUtc != null)
            params.toTimeUtc = toTimeUtc;
        params.section = counter;
        return this.pipRest.getResource('statistics').query(params, params, dataCallback, errorCallback);
    };
    StatisticsData.prototype.getTotalStats = function (counter, dataCallback, errorCallback) {
        return this.getStats(counter, 0, null, null, dataCallback, errorCallback);
    };
    StatisticsData.prototype.getYearlyStats = function (counter, fromTimeUtc, toTimeUtc, dataCallback, errorCallback) {
        return this.getStats(counter, 1, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    };
    StatisticsData.prototype.getMonthlyStats = function (counter, fromTimeUtc, toTimeUtc, dataCallback, errorCallback) {
        return this.getStats(counter, 2, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    };
    StatisticsData.prototype.getDailyStats = function (counter, fromTimeUtc, toTimeUtc, dataCallback, errorCallback) {
        return this.getStats(counter, 3, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    };
    StatisticsData.prototype.getHourlyStats = function (counter, fromTimeUtc, toTimeUtc, dataCallback, errorCallback) {
        return this.getStats(counter, 4, fromTimeUtc, toTimeUtc, dataCallback, errorCallback);
    };
    StatisticsData.prototype.createStatistics = function (section, data, successCallback, errorCallback) {
        if (data === void 0) { data = {}; }
        console.log('section', section, this.pipRest.getResource('statistics'));
        return this.pipRest.getResource('statistics').save({ section: section }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    StatisticsData.prototype.updateStatistics = function (section, data, successCallback, errorCallback) {
        return this.pipRest.getResource('statistics').update({
            section: section
        }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return StatisticsData;
}());
var StatisticsDataProvider = (function () {
    function StatisticsDataProvider() {
        this.RESOURCE = 'statistics';
    }
    StatisticsDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new StatisticsData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return StatisticsDataProvider;
}());
angular
    .module('pipStatisticsData', ['pipRest'])
    .provider('pipStatisticsData', StatisticsDataProvider);
},{}],19:[function(require,module,exports){
configureErrorsRoute.$inject = ['$injector', '$stateProvider'];
var ErrorsController = (function () {
    ErrorsController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function ErrorsController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    ErrorsController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Errors';
        this.pipNavService.actions.hide();
    };
    ErrorsController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return ErrorsController;
}());
function configureErrorsRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('errors', {
        url: '/errors',
        controller: ErrorsController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'errors/ErrorsPage.html'
    });
}
(function () {
    angular
        .module('pipErrorsPage', ['pipNav'])
        .config(configureErrorsRoute);
})();
},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorsMessages_1 = require("../data/ErrorsMessages");
var ErrorDescription_1 = require("../data/ErrorDescription");
var ErrorsPanelBindings = {};
var ErrorsPanelChanges = (function () {
    function ErrorsPanelChanges() {
    }
    return ErrorsPanelChanges;
}());
var ErrorsPanelController = (function () {
    ErrorsPanelController.$inject = ['$log', '$q', '$state', '$scope', '$location', '$rootScope', 'pipNavService', 'pipLoggingData', 'pipTimer', 'pipMedia', 'pipConfirmationDialog', 'pipToasts'];
    function ErrorsPanelController($log, $q, $state, $scope, $location, $rootScope, pipNavService, pipLoggingData, pipTimer, pipMedia, pipConfirmationDialog, pipToasts) {
        var _this = this;
        this._config = new ErrorsMessages_1.ConfigErrors();
        this.searchQuery = '';
        this.stopRefresh = false;
        this.showMessagesLimit = ErrorsMessages_1.ErrorsMessagesVisability.Limit;
        this.loading = false;
        this.updating = false;
        this.error = false;
        this.onKeyPress = function (event) {
            if (event.keyCode === 13) {
                event.stopPropagation();
                event.preventDefault();
                this.onSearchErrors();
            }
        };
        this._log = $log;
        this._q = $q;
        this._state = $state;
        this._scope = $scope;
        this._location = $location;
        this._errorsData = pipLoggingData;
        this._pipTimer = pipTimer;
        this._pipMedia = pipMedia;
        this._pipConfirmationDialog = pipConfirmationDialog;
        this._pipToasts = pipToasts;
        this._start = this._config.start;
        this._take = this._config.pageSize;
        this._total = true;
        this.refresh = this._config.refresh;
        this.refreshTimes = this._config.refreshTimes;
        this.search = this._location.search().search || this._config.defaultSearch;
        this.searchQuery = this.search;
        this.loading = true;
        this._scope.$on('$destroy', function () {
            _this.removeRefreshTimer();
        });
        this.setRefreshTimer();
        var cleanUpFunc = $rootScope.$on('TOOLS.ERRORS_REFRESH', function () {
            if (!_this.stopRefresh) {
                _this.updating = true;
                _this.InitErrors();
            }
        });
        $scope.$on('$destroy', function () {
            if (angular.isFunction(cleanUpFunc)) {
                cleanUpFunc();
            }
        });
        this.setState();
        this.InitErrors();
    }
    ErrorsPanelController.prototype.getErrorString = function (responses) {
        if (responses) {
            if (_.isString(responses)) {
                return responses;
            }
            else if (responses.message) {
                return responses.message;
            }
            else if (responses.data && responses.data.message) {
                return responses.data.message;
            }
            else {
                return responses.statusText || '';
            }
        }
        return '';
    };
    ErrorsPanelController.prototype.clean = function () {
        this.search = null;
        this.onSearchErrors();
    };
    ErrorsPanelController.prototype.clearErrors = function () {
        this._pipConfirmationDialog.show({
            event: null,
            title: 'Clear all errors?',
            ok: 'Clear',
            cancel: 'Cancel'
        }, function () {
        }, function () {
            console.log('You disagreed');
        });
    };
    ErrorsPanelController.prototype.clearErrorsError = function (error) {
        this._pipToasts.showError(error);
    };
    ErrorsPanelController.prototype.setState = function () {
        if (this.loading) {
            this.state = 'loading';
            return;
        }
        if (angular.isArray(this.errors) && this.errors && this.errors.length > 0) {
            this.state = 'data';
            return;
        }
        if (!angular.isArray(this.errors) || (this.errors && this.errors.length == 0)) {
            this.state = 'empty';
            return;
        }
    };
    ErrorsPanelController.prototype.setRefresh = function () {
        this.refreshTime = this.refresh * 60 * 1000;
    };
    ErrorsPanelController.prototype.getFilter = function () {
        var filter = {};
        if (this.searchQuery) {
            filter.Search = this.searchQuery;
        }
        return filter;
    };
    ErrorsPanelController.prototype.setRefreshTimer = function () {
        if (!this._pipTimer.isStarted()) {
            this._pipTimer.start();
        }
        this.setRefresh();
        this.removeRefreshTimer();
        this._pipTimer.addEvent('TOOLS.ERRORS_REFRESH', this.refreshTime);
    };
    ErrorsPanelController.prototype.removeRefreshTimer = function () {
        this._pipTimer.removeEvent('TOOLS.ERRORS_REFRESH');
    };
    ErrorsPanelController.prototype.onErrorRead = function (responses) {
        console.log(responses);
        var traceErrors;
        var errorMessageTree;
        var errors = [];
        traceErrors = this.createErrors(responses);
        errorMessageTree = this.prepareErrorTree(this.createErrorTree(traceErrors));
        for (var key in errorMessageTree) {
            var item = errorMessageTree[key];
            if (this.errors && this.errors.length > 0) {
                var oldItem = _.find(this.errors, function (item) {
                    if (item && item.items && item.items.length > 0 && item.items[0].error.type == key)
                        return true;
                    else
                        return false;
                });
                item.collapsed = oldItem ? !!oldItem.collapsed : false;
            }
            errors.push(item);
        }
        this.errors = _.sortBy(errors, function (item) {
            return item.ErrorType;
        });
        this.loading = false;
        this.updating = false;
        this.error = false;
        this.setState();
    };
    ErrorsPanelController.prototype.onError = function (responses) {
        this._log.error('Error: ' + JSON.stringify(responses));
        this.errorText = 'Error: Error on load erros messages.';
        this.errorMessage = responses;
        this.loading = false;
        this.updating = false;
        this.error = true;
        this.setState();
    };
    ErrorsPanelController.prototype.InitErrors = function () {
        var _this = this;
        var filter = this.getFilter();
        this.loading = true;
        this.error = false;
        async.parallel([
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 2 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 3 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 4 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 5 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 6 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 7 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 8 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            },
            function (callback) {
                _this._errorsData.readErrors(filter, _this._start + 9 * _this._take, _this._take, function (responses) { callback(null, responses); }, function (error) { callback(error, null); });
            }
        ], function (error, result) {
            if (!error && result) {
                _this.onErrorRead(result);
            }
            if (error)
                _this.onError(result);
        });
    };
    ErrorsPanelController.prototype.createErrors = function (traceErrors) {
        var errorData = [];
        _.each(traceErrors, function (item) {
            if (angular.isObject(item) && angular.isArray(item.data)) {
                for (var i = 0; i < item.data.length; i++) {
                    errorData.push(item.data[i]);
                }
            }
        });
        return errorData;
    };
    ErrorsPanelController.prototype.createErrorTree = function (traceErrors) {
        var _this = this;
        var tree = {};
        if (angular.isArray(traceErrors)) {
            _.each(traceErrors, function (item) {
                var key;
                if (item.error) {
                    key = item.error.type;
                }
                else {
                    key = 'undefined';
                    item.error = new ErrorDescription_1.ErrorDescription();
                }
                if (!tree[key]) {
                    tree[key] = _this.createRecord(key);
                }
                var record = _this.createRecord(key);
                tree[key] = _this.addToRecord(tree[key], item);
            });
        }
        return tree;
    };
    ErrorsPanelController.prototype.prepareErrorTree = function (tree) {
        var _this = this;
        _.each(tree, function (item) {
            item = _this.sortByTime(item);
        });
        _.each(tree, function (item) {
            if (item.items.length > 0) {
                item.count = item.items.length;
                item.first = item.items[item.items.length - 1].MomentTimeUtc;
                item.last = item.items[0].MomentTimeUtc;
            }
        });
        return tree;
    };
    ErrorsPanelController.prototype.createRecord = function (key) {
        var record;
        record = {
            items: [],
            ErrorType: key,
            first: null,
            last: null,
            count: 0,
            collapsed: false,
            show: ErrorsMessages_1.ErrorsMessagesVisability.Limit
        };
        return record;
    };
    ErrorsPanelController.prototype.addToRecord = function (record, item) {
        var errorItem;
        errorItem = new ErrorsMessages_1.ErrorLogMessage;
        if (record && record.items) {
            errorItem.MomentTimeUtc = moment(item.time);
            errorItem.time = errorItem.MomentTimeUtc.toDate().getTime();
            errorItem.correlation_id = item.correlation_id;
            errorItem.time = item.time;
            errorItem.level = item.level;
            errorItem.error = item.error;
            errorItem.message = item.message;
            record.items.push(errorItem);
        }
        return record;
    };
    ErrorsPanelController.prototype.sortByTime = function (collection) {
        collection.items = _.sortBy(collection.items, function (item) {
            return item.time;
        });
        return collection;
    };
    ErrorsPanelController.prototype.onRefreshClick = function () {
        this.updating = true;
        this.searchQuery = this.search;
        this.InitErrors();
    };
    ErrorsPanelController.prototype.onRefreshChange = function () {
        this.setRefreshTimer();
    };
    ErrorsPanelController.prototype.onClickErrorDetails = function () {
    };
    ErrorsPanelController.prototype.onSearchErrors = function () {
        this.searchQuery = this.search;
        this._location.search('search', this.searchQuery);
        this.onRefreshClick();
    };
    ErrorsPanelController.prototype.onFilterErrors = function () {
        if (this.search || this.searchQuery) {
            this.searchQuery = this.search;
            this._location.search('search', this.searchQuery);
            this.onRefreshClick();
        }
    };
    ErrorsPanelController.prototype.onErrorsDetails = function (item) {
    };
    ErrorsPanelController.prototype.onShowMore = function (item) {
        item.show = item.show + ErrorsMessages_1.ErrorsMessagesVisability.Step;
    };
    ErrorsPanelController.prototype.onShowLess = function (item) {
        item.show = ErrorsMessages_1.ErrorsMessagesVisability.Limit;
    };
    ErrorsPanelController.prototype.onBlur = function () {
    };
    return ErrorsPanelController;
}());
(function () {
    angular
        .module('pipErrorsPanel', [])
        .component('pipErrorsPanel', {
        bindings: ErrorsPanelBindings,
        templateUrl: 'errors/ErrorsPanel.html',
        controller: ErrorsPanelController
    });
})();
},{"../data/ErrorDescription":6,"../data/ErrorsMessages":7}],21:[function(require,module,exports){
configureEventsRoute.$inject = ['$injector', '$stateProvider'];
var EventsController = (function () {
    EventsController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function EventsController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    EventsController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Events';
        this.pipNavService.actions.hide();
    };
    EventsController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return EventsController;
}());
function configureEventsRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('events', {
        url: '/events',
        controller: EventsController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'events/EventsPage.html'
    });
}
(function () {
    angular
        .module('pipEventsPage', ['pipNav'])
        .config(configureEventsRoute);
})();
},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventsPanelBindings = {};
var EventsPanelChanges = (function () {
    function EventsPanelChanges() {
    }
    return EventsPanelChanges;
}());
var EventsState = (function () {
    function EventsState() {
    }
    return EventsState;
}());
EventsState.Progress = 'progress';
EventsState.Data = 'data';
EventsState.Empty = 'empty';
var EventsFilter = (function () {
    function EventsFilter() {
    }
    return EventsFilter;
}());
EventsFilter.Component = 'Component';
EventsFilter.Severity = 'Severity';
EventsFilter.Type = 'Type';
EventsFilter.All = ['Component', 'Severity', 'Type'];
var EventsPanelController = (function () {
    EventsPanelController.$inject = ['$location', '$state', 'pipEventsData', 'pipMedia', 'pipToasts'];
    function EventsPanelController($location, $state, pipEventsData, pipMedia, pipToasts) {
        this.$location = $location;
        this.$state = $state;
        this.pipEventsData = pipEventsData;
        this.pipMedia = pipMedia;
        this.pipToasts = pipToasts;
        this.events = [];
        this._start = 0;
        this._take = 100;
        this.search = '';
        this.state = EventsState.Progress;
        this.error = null;
        this.readEvents();
    }
    EventsPanelController.prototype.clear = function () {
        this.search = null;
        this.refreshEvents();
    };
    EventsPanelController.prototype.readEvents = function () {
        var _this = this;
        this.updating = true;
        this.pipEventsData.readEvents(this.getFilter(), this._start, this._take, function (events) {
            _this.onReadEvents(events);
        }, function (err) {
            _this.onReadEventsError(err);
        });
    };
    EventsPanelController.prototype.getFilter = function () {
        return this.search ? { Search: this.search } : {};
    };
    EventsPanelController.prototype.onReadEventsError = function (error) {
        this.error = error;
    };
    EventsPanelController.prototype.onReadEvents = function (events) {
        var _this = this;
        this.error = null;
        _.each(events.data, function (trace, $index) {
            if (_this._start === 0 && _this.events[$index]) {
                _this.events[$index] = trace;
            }
            else {
                _this.events.push(trace);
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
    };
    EventsPanelController.prototype.refreshEvents = function () {
        this._take = this._start > 0 ? this._start : 100;
        this._start = 0;
        this.$location.search('search', this.search);
        this.readEvents();
    };
    return EventsPanelController;
}());
(function () {
    angular
        .module('pipEventsPanel', [])
        .component('pipEventsPanel', {
        bindings: EventsPanelBindings,
        templateUrl: 'events/EventsPanel.html',
        controller: EventsPanelController
    });
})();
},{}],23:[function(require,module,exports){
(function () {
    angular
        .module('pipSystem', [
        'pipDirective',
        'pipLoggingResources',
        'pipLoggingData',
        'pipLoggingViewModel',
        'pipLoggingPage',
        'pipLoggingPanel',
        'pipErrorsPage',
        'pipErrorsPanel',
        'pipCountersResources',
        'pipCountersData',
        'pipCountersPage',
        'pipCountersPanel',
        'pipEventsResources',
        'pipEventsData',
        'pipEventsPage',
        'pipEventsPanel',
        'pipSettingsResources',
        'pipSettingsData',
        'pipSettingsPage',
        'pipSettingsPanel',
        'pipStatisticsResources',
        'pipStatisticsService',
        'pipStatisticsData',
        'pipStatisticsPage',
        'pipStatisticsPanel'
    ]);
})();
},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggingsState = (function () {
    function LoggingsState() {
    }
    return LoggingsState;
}());
LoggingsState.Progress = 'progress';
LoggingsState.Data = 'data';
LoggingsState.Empty = 'empty';
exports.LoggingsState = LoggingsState;
var LoggingModel = (function () {
    function LoggingModel(pipLoggingData) {
        this.pipLoggingData = pipLoggingData;
        this.loggings = [];
        this.state = LoggingsState.Progress;
        this.total = 0;
        this._start = 0;
        this._take = 100;
    }
    LoggingModel.prototype.getLoggings = function () {
        return this.loggings;
    };
    LoggingModel.prototype.setLoggings = function (loggings) {
        this.loggings = loggings;
    };
    LoggingModel.prototype.setState = function (state) {
        this.state = state;
    };
    LoggingModel.prototype.getState = function () {
        return this.state;
    };
    LoggingModel.prototype.readLogging = function (search, callback, errorcallback) {
        var _this = this;
        this.pipLoggingData.readLogging({ 'Search': search }, this._start, this._take, function (results) {
            _this.onLoggingRead(results, callback);
        }, function (err) {
            if (errorcallback) {
                errorcallback(err);
            }
        });
    };
    LoggingModel.prototype.refreshLogging = function (search, callback, errorcallback) {
        this._start = 0;
        this.readLogging(search, callback, errorcallback);
    };
    LoggingModel.prototype.onLoggingRead = function (traces, callback) {
        var _this = this;
        this.state = traces.data.length > 0 || (this._start !== 0 && this.loggings.length > 0) ?
            LoggingsState.Data : LoggingsState.Empty;
        _.each(traces.data, function (trace, $index) {
            _this.loggings[$index] ? _this.loggings[$index + _this._start] = trace : _this.loggings.push(trace);
        });
        this._start += traces.data.length;
        if (this.total <= this._start || this._take != traces.data.length) {
            this.total = this._start;
            if (this.loggings.length > this.total) {
                this.loggings.splice(this.total, this.loggings.length - this.total);
            }
        }
        else {
        }
        if (callback) {
            callback();
        }
    };
    return LoggingModel;
}());
exports.LoggingModel = LoggingModel;
},{}],25:[function(require,module,exports){
configureLoggingRoute.$inject = ['$injector', '$stateProvider'];
var LoggingController = (function () {
    LoggingController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function LoggingController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    LoggingController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Logging';
        this.pipNavService.actions.hide();
    };
    LoggingController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return LoggingController;
}());
function configureLoggingRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('logging', {
        url: '/logging',
        controller: LoggingController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'logging/LoggingPage.html'
    });
}
(function () {
    angular
        .module('pipLoggingPage', ['pipNav'])
        .config(configureLoggingRoute);
})();
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggingPanelBindings = {};
var LoggingPanelChanges = (function () {
    function LoggingPanelChanges() {
    }
    return LoggingPanelChanges;
}());
var LoggingsTimer = (function () {
    function LoggingsTimer() {
    }
    return LoggingsTimer;
}());
LoggingsTimer.Times = [1, 3, 5, 10, 20, 30];
var LoggingsFilter = (function () {
    function LoggingsFilter() {
    }
    return LoggingsFilter;
}());
LoggingsFilter.Content = 'Content';
LoggingsFilter.CorrelationId = 'CorrelationId';
LoggingsFilter.Level = 'Level';
LoggingsFilter.All = ['Content', 'CorrelationId', 'Level'];
var LoggingPanelController = (function () {
    LoggingPanelController.$inject = ['pipLoggingViewModel', '$location', 'pipTimer', 'pipMedia', 'pipTransaction', '$rootScope'];
    function LoggingPanelController(pipLoggingViewModel, $location, pipTimer, pipMedia, pipTransaction, $rootScope) {
        var _this = this;
        this.pipLoggingViewModel = pipLoggingViewModel;
        this.$location = $location;
        this.pipTimer = pipTimer;
        this.pipMedia = pipMedia;
        this.autoUpdate = true;
        this.filters = LoggingsFilter.All;
        this.refresh = LoggingsTimer.Times[3];
        this.refreshTimes = LoggingsTimer.Times;
        this.search = '';
        this.localSearch = '';
        this.error = null;
        this.stopRefresh = false;
        this.transaction = pipTransaction.create('traces');
        this.filter = this.$location.search().filter || LoggingsFilter.Content;
        this.search = this.$location.search().search || '';
        this.localSearch = this.search;
        this.readLogging();
        this.setRefreshTimer();
        this.cleanUpFunc = $rootScope.$on('Logging', function () {
            if (!_this.stopRefresh && _this.autoUpdate) {
                _this.refreshLogging();
            }
        });
    }
    LoggingPanelController.prototype.$onDestroy = function () {
        this.pipTimer.removeEvent('Logging');
        if (angular.isFunction(this.cleanUpFunc)) {
            this.cleanUpFunc();
        }
    };
    LoggingPanelController.prototype.loggings = function () {
        return this.pipLoggingViewModel.logging;
    };
    LoggingPanelController.prototype.state = function () {
        return this.pipLoggingViewModel.state;
    };
    LoggingPanelController.prototype.readLogging = function () {
        var _this = this;
        this.stopRefresh = true;
        this.transaction.begin('PROCESSING');
        this.pipLoggingViewModel.readLogging(this.search, function () { _this.onLoggingRead(); }, function (error) { _this.onError(error); });
    };
    LoggingPanelController.prototype.setRefreshTimer = function () {
        if (!this.pipTimer.isStarted()) {
            this.pipTimer.start();
        }
        this.setRefresh();
        this.pipTimer.removeEvent('Logging');
        this.pipTimer.addEvent('Logging', this._refreshTime);
    };
    LoggingPanelController.prototype.onRefreshChange = function () {
        this.setRefreshTimer();
    };
    LoggingPanelController.prototype.setRefresh = function () {
        this._refreshTime = this.refresh * 1000;
    };
    LoggingPanelController.prototype.playStopAutoUpdate = function () {
        this.autoUpdate = !this.autoUpdate;
    };
    LoggingPanelController.prototype.onError = function (error) {
        this.error = error;
        this.transaction.abort();
        this.stopRefresh = false;
    };
    LoggingPanelController.prototype.onLoggingRead = function () {
        this.stopRefresh = false;
        this.error = null;
        this.transaction.end();
    };
    LoggingPanelController.prototype.refreshLogging = function () {
        var _this = this;
        this.$location.search('search', this.search);
        this.stopRefresh = true;
        this.transaction.begin('PROCESSING');
        this.pipLoggingViewModel.refreshLogging(this.search, function () { _this.onLoggingRead(); }, function (error) { _this.onError(error); });
    };
    LoggingPanelController.prototype.onSearch = function () {
        this.search = this.localSearch;
        this.refreshLogging();
    };
    return LoggingPanelController;
}());
(function () {
    angular
        .module('pipLoggingPanel', [])
        .component('pipLoggingPanel', {
        bindings: LoggingPanelBindings,
        templateUrl: 'logging/LoggingPanel.html',
        controller: LoggingPanelController
    });
})();
},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggingModel_1 = require("./LoggingModel");
var LoggingViewModel = (function () {
    LoggingViewModel.$inject = ['pipLoggingData'];
    function LoggingViewModel(pipLoggingData) {
        "ngInject";
        this.pipLoggingData = pipLoggingData;
        this.workflow = new LoggingModel_1.LoggingModel(pipLoggingData);
    }
    Object.defineProperty(LoggingViewModel.prototype, "logging", {
        get: function () {
            return this.workflow.getLoggings();
        },
        set: function (loggings) {
            this.workflow.setLoggings(loggings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoggingViewModel.prototype, "state", {
        get: function () {
            return this.workflow.getState();
        },
        set: function (state) {
            this.workflow.setState(state);
        },
        enumerable: true,
        configurable: true
    });
    LoggingViewModel.prototype.readLogging = function (search, callback, errorcallback) {
        this.workflow.readLogging(search, callback, errorcallback);
    };
    LoggingViewModel.prototype.refreshLogging = function (search, callback, errorcallback) {
        this.workflow.refreshLogging(search, callback, errorcallback);
    };
    return LoggingViewModel;
}());
(function () {
    angular
        .module('pipLoggingViewModel', ['pipNav'])
        .service('pipLoggingViewModel', LoggingViewModel);
})();
},{"./LoggingModel":24}],28:[function(require,module,exports){
configCountersResources.$inject = ['pipRestProvider'];
function configCountersResources(pipRestProvider) {
    pipRestProvider.registerOperation('counters', '/api/v1/counters');
}
angular
    .module('pipCountersResources', [])
    .config(configCountersResources);
},{}],29:[function(require,module,exports){
configEventsResources.$inject = ['pipRestProvider'];
function configEventsResources(pipRestProvider) {
    pipRestProvider.registerOperation('events', '/api/v1/eventlog');
}
angular
    .module('pipEventsResources', [])
    .config(configEventsResources);
},{}],30:[function(require,module,exports){
configLoggingResources.$inject = ['pipRestProvider'];
function configLoggingResources(pipRestProvider) {
    pipRestProvider.registerOperation('logging', '/api/v1/logging');
    pipRestProvider.registerOperation('errors', '/api/v1/logging/errors');
}
angular
    .module('pipLoggingResources', [])
    .config(configLoggingResources);
},{}],31:[function(require,module,exports){
configSettingsResources.$inject = ['pipRestProvider'];
function configSettingsResources(pipRestProvider) {
    pipRestProvider.registerPagedCollection('settings', '/api/v1/settings/:section/:key', { section: '@section' }, {
        page: { method: 'GET', isArray: false },
        update: { method: 'PUT' }
    });
    pipRestProvider.registerOperation('settings_section', '/api/v1/settings/ids');
}
angular
    .module('pipSettingsResources', [])
    .config(configSettingsResources);
},{}],32:[function(require,module,exports){
configStatisticsResources.$inject = ['pipRestProvider'];
function configStatisticsResources(pipRestProvider) {
    pipRestProvider.registerOperation('statistics_counters', '/api/v1/statistics/counters');
    pipRestProvider.registerOperation('statistics_section', '/api/v1/statistics/groups');
    pipRestProvider.registerOperation('statistics', '/api/v1/statistics/:section/:name');
}
angular
    .module('pipStatisticsResources', [])
    .config(configStatisticsResources);
},{}],33:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsKey = (function () {
    function SettingsKey() {
    }
    return SettingsKey;
}());
exports.SettingsKey = SettingsKey;
var AddSettingsKeyDialogController = (function () {
    AddSettingsKeyDialogController.$inject = ['params', '$mdDialog', '$injector', '$rootScope'];
    function AddSettingsKeyDialogController(params, $mdDialog, $injector, $rootScope) {
        "ngInject";
        this.title = "New settings key";
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.key = new SettingsKey();
        this.key.name = params.name ? params.name.replace('<wbr>', '') : null;
        this.key.data = params.data;
        if (params.name && params.data) {
            this.title = "Edit settings key";
        }
    }
    AddSettingsKeyDialogController.prototype.onOk = function () {
        this.$mdDialog.hide(this.key);
    };
    AddSettingsKeyDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return AddSettingsKeyDialogController;
}());
exports.AddSettingsKeyDialogController = AddSettingsKeyDialogController;
angular
    .module('pipAddSettingsKeyDialog', ['ngMaterial'])
    .controller('pipAddSettingsKeyDialogController', AddSettingsKeyDialogController);
require("./AddSettingsKeyService");
},{"./AddSettingsKeyService":34}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddSettingsKeyService = (function () {
    AddSettingsKeyService.$inject = ['$mdDialog'];
    function AddSettingsKeyService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    AddSettingsKeyService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'settings/AddSettingsKeyDialog.html',
            controller: 'pipAddSettingsKeyDialogController',
            controllerAs: '$ctrl',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (key) {
            if (successCallback) {
                successCallback(key);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return AddSettingsKeyService;
}());
angular
    .module('pipAddSettingsKeyDialog')
    .service('pipAddSettingsKeyDialog', AddSettingsKeyService);
},{}],35:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var AddSettingsSectionDialogController = (function () {
    AddSettingsSectionDialogController.$inject = ['params', '$mdDialog', '$injector', '$rootScope'];
    function AddSettingsSectionDialogController(params, $mdDialog, $injector, $rootScope) {
        "ngInject";
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
    }
    AddSettingsSectionDialogController.prototype.onOk = function () {
        this.$mdDialog.hide(this.sectionName);
    };
    AddSettingsSectionDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return AddSettingsSectionDialogController;
}());
exports.AddSettingsSectionDialogController = AddSettingsSectionDialogController;
angular
    .module('pipAddSettingsSectionDialog', ['ngMaterial'])
    .controller('pipAddSettingsSectionDialogController', AddSettingsSectionDialogController);
require("./AddSettingsSectionService");
},{"./AddSettingsSectionService":36}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddSettingsSectionService = (function () {
    AddSettingsSectionService.$inject = ['$mdDialog'];
    function AddSettingsSectionService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    AddSettingsSectionService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'settings/AddSettingsSectionDialog.html',
            controller: 'pipAddSettingsSectionDialogController',
            controllerAs: '$ctrl',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (settingsName) {
            if (successCallback) {
                successCallback(settingsName);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return AddSettingsSectionService;
}());
angular
    .module('pipAddSettingsSectionDialog')
    .service('pipAddSettingsSectionDialog', AddSettingsSectionService);
},{}],37:[function(require,module,exports){
configureSettingsRoute.$inject = ['$injector', '$stateProvider'];
var SettingsController = (function () {
    SettingsController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function SettingsController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    SettingsController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Settings';
        this.pipNavService.actions.hide();
    };
    SettingsController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return SettingsController;
}());
function configureSettingsRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('settings_tool', {
        url: '/settings_tool',
        controller: SettingsController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'settings/SettingsPage.html'
    });
}
(function () {
    angular
        .module('pipSettingsPage', ['pipNav'])
        .config(configureSettingsRoute);
})();
},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPanelBindings = {};
var SettingsPanelChanges = (function () {
    function SettingsPanelChanges() {
    }
    return SettingsPanelChanges;
}());
var SettingsState = (function () {
    function SettingsState() {
    }
    return SettingsState;
}());
SettingsState.Progress = 'progress';
SettingsState.Data = 'data';
SettingsState.Empty = 'empty';
var SettingSection = (function () {
    function SettingSection() {
        this.hide = false;
    }
    return SettingSection;
}());
exports.SettingSection = SettingSection;
var SettingsPanelController = (function () {
    SettingsPanelController.$inject = ['$window', '$location', 'pipToasts', 'pipTransaction', '$log', 'pipAddSettingsSectionDialog', '$state', 'pipSettingsData', 'pipMedia', 'pipAddSettingsKeyDialog', 'pipConfirmationDialog'];
    function SettingsPanelController($window, $location, pipToasts, pipTransaction, $log, pipAddSettingsSectionDialog, $state, pipSettingsData, pipMedia, pipAddSettingsKeyDialog, pipConfirmationDialog) {
        var _this = this;
        this.$window = $window;
        this.$location = $location;
        this.pipToasts = pipToasts;
        this.pipAddSettingsSectionDialog = pipAddSettingsSectionDialog;
        this.$state = $state;
        this.pipSettingsData = pipSettingsData;
        this.pipMedia = pipMedia;
        this.pipAddSettingsKeyDialog = pipAddSettingsKeyDialog;
        this.pipConfirmationDialog = pipConfirmationDialog;
        this.search = null;
        this.state = SettingsState.Progress;
        this.error = null;
        this.transaction = pipTransaction.create('settings');
        this.search = this.$location.search().search;
        this.readSettings();
        this.selectIndex = 0;
        this.getSelectDropdown = function () {
            _this.selectItem(_this.selectIndex);
        };
    }
    SettingsPanelController.prototype.readSettings = function () {
        var _this = this;
        this.transaction.begin('Reading settings');
        this.state = SettingsState.Empty;
        this.transaction.end();
        this.pipSettingsData.readSettingsSections({}, function (settingsSections) {
            _this.state = SettingsState.Progress;
            _this.onSettingsRead(settingsSections);
            if (settingsSections.length > 0) {
                _this.state = SettingsState.Data;
            }
            else {
                _this.state = SettingsState.Empty;
            }
        }, function (error) {
            _this.onError(error);
        });
    };
    SettingsPanelController.prototype.onSearch = function () {
        var _this = this;
        this.$location.search('search', this.search);
        _.each(this.settingsSections, function (item, index) {
            _this.settingsSections[index].hide = _this.filterSections(item.name);
        });
        if (!this.settingsSections[this.selectIndex] || this.settingsSections[this.selectIndex].hide == true) {
            var index = _.findIndex(this.settingsSections, { hide: false });
            if (index == -1) {
                this.state = SettingsState.Empty;
                this.selectIndex = null;
            }
            else {
                this.state = SettingsState.Data;
                this.selectItem(index);
            }
        }
    };
    SettingsPanelController.prototype.clean = function () {
        this.search = null;
        this.onSearch();
    };
    SettingsPanelController.prototype.filterSections = function (section) {
        if (!this.search || this.search == '') {
            return false;
        }
        if (section.indexOf(this.search) != -1) {
            return false;
        }
        else {
            return true;
        }
    };
    SettingsPanelController.prototype.onSettingsRead = function (settingsSections) {
        var _this = this;
        this.settingsSections = [];
        _.each(settingsSections, function (item) {
            _this.settingsSections.push({ name: item, hide: false });
        });
        this.settings = [];
        _.each(this.settingsSections, function (section, index) {
            if (section.name === _this.$location.search().section) {
                _this.selectIndex = index;
            }
            _this.pipSettingsData.readSettings(section.name, function (settings) {
                var keys = _.keys(settings);
                keys = _.map(keys, function (key) {
                    if (key == '$promise' || key == '$resolved')
                        return key;
                    var split = _.split(key, '.');
                    var newKey = '';
                    _.each(split, function (k, index) {
                        newKey += k;
                        if (index != split.length - 1) {
                            newKey += '.<wbr>';
                        }
                    });
                    return newKey;
                });
                var settingsN = _.zipObject(keys, _.values(settings));
                _this.settings[index] = settingsN;
                _this.transaction.end();
                _this.state = SettingsState.Data;
            }, function (error) {
                _this.transaction.abort();
                _this.pipToasts.showError(error, null, null, null, null);
            });
        });
    };
    SettingsPanelController.prototype.onError = function (error) {
        this.error = error;
        this.transaction.end(error);
    };
    SettingsPanelController.prototype.selectItem = function (index) {
        this.selectIndex = index;
        this.$location.search('section', this.settingsSections[index].name);
    };
    SettingsPanelController.prototype.updateKey = function (name, data) {
        var _this = this;
        this.pipAddSettingsKeyDialog.show({
            section: this.settingsSections[this.selectIndex],
            name: name,
            data: data
        }, function (key) {
            _this.transaction.begin('add section');
            if (name == key.name) {
                _this.addKeyDialogCallback(key);
            }
            else {
                _this.updateKeyDialogCallback(key, name);
            }
        });
    };
    SettingsPanelController.prototype.updateKeyDialogCallback = function (key, name) {
        var _this = this;
        name = name.replace('.', '.<wbr>');
        key.name = key.name.replace('.', '.<wbr>');
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, key.name, function (data) {
            _this.transaction.end();
        }, function (error) {
            _this.transaction.abort();
            _this.pipToasts.showError(error, null, null, null, null);
        });
    };
    SettingsPanelController.prototype.openDeleteKeyDialog = function (key, value) {
        var _this = this;
        this.pipConfirmationDialog.show({
            event: null,
            title: 'Delete settings key?',
            ok: 'Delete',
            cancel: 'Cancel'
        }, function () {
            _this.deleteKey(key, value);
        }, function () {
            console.log('You disagreed');
        });
    };
    SettingsPanelController.prototype.deleteKey = function (key, value) {
        var _this = this;
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], key);
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], '$promise');
        this.settings[this.selectIndex] = _.omit(this.settings[this.selectIndex], '$resolved');
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, this.settings[this.selectIndex], function (data) {
            _this.transaction.end();
        }, function (error) {
            _this.transaction.abort();
            _this.pipToasts.showError(error, null, null, null, null);
        });
    };
    SettingsPanelController.prototype.addKey = function () {
        var _this = this;
        this.pipAddSettingsKeyDialog.show({ section: this.settingsSections[this.selectIndex] }, function (key) {
            _this.addKeyDialogCallback(key);
        });
    };
    SettingsPanelController.prototype.addKeyDialogCallback = function (key) {
        var _this = this;
        this.transaction.begin('add section');
        var settings = {}, keys = _.keys(this.settings[this.selectIndex]), values = _.values(this.settings[this.selectIndex]);
        for (var i = 0; i < values.length; i++) {
            if (keys[i] != '$promise' && keys[i] != '$resolved') {
                settings[keys[i]] = values[i];
            }
        }
        settings[key.name] = key.data;
        console.log(settings);
        this.pipSettingsData.createSettings(this.settingsSections[this.selectIndex].name, settings, function () {
            _this.saveKeyCallback(key);
        }, function (error) {
            _this.transaction.abort();
            _this.pipToasts.showError(error, null, null, null, null);
        });
    };
    SettingsPanelController.prototype.saveKeyCallback = function (key) {
        this.transaction.end();
        key.name = key.name.replace('.', '.<wbr>');
        if (!this.settings[this.selectIndex]) {
            this.settings[this.selectIndex] = {};
        }
        this.settings[this.selectIndex][key.name] = key.data;
    };
    SettingsPanelController.prototype.errorkeyCallback = function (error) {
        this.transaction.abort();
        this.pipToasts.showError(error, null, null, null, null);
    };
    SettingsPanelController.prototype.addSection = function () {
        var _this = this;
        this.pipAddSettingsSectionDialog.show({}, function (sectionName) {
            _this.addSectionDialogCallback(sectionName);
        });
    };
    SettingsPanelController.prototype.addSectionDialogCallback = function (sectionName, data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        this.transaction.begin('Adding section');
        this.pipSettingsData.createSettings(sectionName, data, function () {
            _this.saveSectionCallback(sectionName);
        }, function (error) {
            _this.errorkeyCallback(error);
        });
    };
    SettingsPanelController.prototype.saveSectionCallback = function (data) {
        this.transaction.end();
        this.settingsSections.push({ name: data, hide: this.filterSections(data) });
        this.selectItem(this.settingsSections.length - 1);
    };
    SettingsPanelController.prototype.errorSectionCallback = function (error) {
        this.transaction.end('error');
        this.pipToasts.showError(error, null, null, null, null);
    };
    return SettingsPanelController;
}());
(function () {
    angular
        .module('pipSettingsPanel', ['pipAddSettingsSectionDialog', 'pipAddSettingsKeyDialog'])
        .component('pipSettingsPanel', {
        bindings: SettingsPanelBindings,
        templateUrl: 'settings/SettingsPanel.html',
        controller: SettingsPanelController
    });
})();
},{}],39:[function(require,module,exports){
configureStatisticsRoute.$inject = ['$injector', '$stateProvider'];
var StatisticsController = (function () {
    StatisticsController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function StatisticsController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    StatisticsController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Statistics';
        this.pipNavService.actions.hide();
    };
    StatisticsController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return StatisticsController;
}());
function configureStatisticsRoute($injector, $stateProvider) {
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
(function () {
    angular
        .module('pipStatisticsPage', ['pipNav'])
        .config(configureStatisticsRoute);
})();
},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatisticsService_1 = require("./StatisticsService");
var ToolsStatisticsStates = (function () {
    function ToolsStatisticsStates() {
    }
    return ToolsStatisticsStates;
}());
ToolsStatisticsStates.Progress = 'progress';
ToolsStatisticsStates.Empty = 'empty';
ToolsStatisticsStates.Data = 'data';
var StatisticsPanelBindings = {};
var StatisticsPanelChanges = (function () {
    function StatisticsPanelChanges() {
    }
    return StatisticsPanelChanges;
}());
var StatisticsPanelController = (function () {
    StatisticsPanelController.$inject = ['$window', '$timeout', '$state', '$location', 'pipStatisticsData', 'pipTransaction', 'pipAuxPanel', 'pipDateConvert', 'pipMedia', 'pipStatistics', 'pipToasts'];
    function StatisticsPanelController($window, $timeout, $state, $location, pipStatisticsData, pipTransaction, pipAuxPanel, pipDateConvert, pipMedia, pipStatistics, pipToasts) {
        var _this = this;
        this.filters = StatisticsService_1.StatisticsFilter.All;
        this.state = ToolsStatisticsStates.Progress;
        this.TOTAL = StatisticsService_1.StatisticsFilter.Total;
        this._onlyUpdated = false;
        this.pipMedia = pipMedia;
        this._rest = pipStatisticsData;
        this._pipAuxPanel = pipAuxPanel;
        this._pipDateConvert = pipDateConvert;
        this._$state = $state;
        this._$location = $location;
        this._$timeout = $timeout;
        this._pipStatistics = pipStatistics;
        this._pipToasts = pipToasts;
        this.transaction = pipTransaction.create('statistics');
        this.chartXTickFormat = function (x) {
            if (_this.filter == StatisticsService_1.StatisticsFilter.Hourly) {
                x += x > 24 ? -24 : x < -24 ? 24 : 0;
            }
            return StatisticsService_1.ToolsStatisticsFormatTickX[_this.filter](x);
        };
        this.filter = $state.params['filter'] || StatisticsService_1.StatisticsFilter.Hourly;
        this.search = $state.params['search'];
        this.configDates();
        this.getCounters();
    }
    StatisticsPanelController.prototype.prepareDecades = function () {
        var stepsCount = 1;
        var utcStartYear = moment.utc().startOf('year').add('years', (-stepsCount * 10 - 6));
        this.decades = new Array();
        this.decades.push(new StatisticsService_1.ToolsStatisticsDecade(moment.utc(utcStartYear).toDate(), utcStartYear.year().toString() + ' - ' + utcStartYear.add('years', 10).year().toString()));
        for (var i = -stepsCount + 1; i <= stepsCount; i++) {
            var start = _.cloneDeep(utcStartYear);
            var end = _.cloneDeep(utcStartYear.add('years', 10));
            this.decades.push(new StatisticsService_1.ToolsStatisticsDecade(moment.utc(start).toDate(), start.year().toString() + ' - ' + end.year().toString()));
        }
    };
    StatisticsPanelController.prototype.configDates = function () {
        this.prepareDecades();
        var utcDate = moment.utc();
        this.hourlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsService_1.StatisticsFilter.Hourly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        this.dailyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsService_1.StatisticsFilter.Daily) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        this.monthlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsService_1.StatisticsFilter.Monthly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
        utcDate.add('years', -6);
        this.yearlyDate = (this._$state.params['start'] && this._$state.params['filter'] === StatisticsService_1.StatisticsFilter.Yearly) ? this._$state.params['start'] : _.cloneDeep(utcDate.toDate());
    };
    StatisticsPanelController.prototype.getCounters = function () {
        var _this = this;
        this.transaction.begin('PROCESSING');
        this._rest.readStatisticsSections(null, function (counters) {
            _this.counters = counters;
            if (_this.counters.length > 0) {
                _this.getStatistics();
            }
            else {
                _this.transaction.end();
                _this.state = ToolsStatisticsStates.Empty;
            }
        }, function (error) {
            _this._pipToasts(error);
            _this.transaction.end();
        });
    };
    StatisticsPanelController.prototype.getEndDate = function () {
        var endDate;
        switch (this.filter) {
            case StatisticsService_1.StatisticsFilter.Hourly:
                endDate = moment(this.hourlyDate).add('days', 1).add(0, 'hours').add('minutes', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Daily:
                endDate = moment(this.dailyDate).add('weeks', 1).add('minutes', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Monthly:
                endDate = moment(this.monthlyDate).add('years', 1).add('minutes', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Yearly:
                endDate = moment(this.yearlyDate).add('years', 10).add('minutes', -1).toDate();
                break;
        }
        return endDate;
    };
    StatisticsPanelController.prototype.getStartDate = function () {
        var startDate;
        switch (this.filter) {
            case StatisticsService_1.StatisticsFilter.Hourly:
                startDate = moment.utc(this.hourlyDate).startOf('day').add(0, 'hours').toDate();
                this.hourlyDate = startDate;
                break;
            case StatisticsService_1.StatisticsFilter.Daily:
                startDate = moment.utc(this.dailyDate).startOf('isoWeek').toDate();
                this.dailyDate = startDate;
                break;
            case StatisticsService_1.StatisticsFilter.Monthly:
                startDate = moment.utc(this.monthlyDate).startOf('year').toDate();
                this.monthlyDate = startDate;
                break;
            case StatisticsService_1.StatisticsFilter.Yearly:
                startDate = moment.utc(this.yearlyDate).startOf('year').toDate();
                this.yearlyDate = startDate;
                this.yearlyName = _.result(_.find(this.decades, function (dec) {
                    return dec.value.toString() == startDate.toString();
                }), 'name');
                break;
        }
        this._$location.search('start', startDate);
        return startDate;
    };
    StatisticsPanelController.prototype.getStatistics = function () {
        var _this = this;
        this.statistics = new Array();
        var dateStart = this.getStartDate();
        var dateEnd = this.getEndDate();
        _.each(this.counters, function (counter, index) {
            if (_this.filter !== StatisticsService_1.StatisticsFilter.Total) {
                _this._rest[StatisticsService_1.ToolsStatisticsGetFunctions[_this.filter]](counter, dateStart, dateEnd, function (statistics) {
                    console.log('st', statistics);
                    _this.transaction.end();
                    var temp = new StatisticsService_1.counterStatistics(counter, statistics);
                    temp.seria = _this.prepareForLineCharts(statistics, counter, dateStart, dateEnd, _this.filter);
                    console.log('temp', temp);
                    _this.statistics.push(temp);
                    if (index === _this.counters.length - 1)
                        _this.groupStatistics();
                }, function (error) {
                    _this._pipToasts(error);
                    _this.transaction.end();
                });
            }
            else {
                _this._rest.getTotalStats(counter, function (statistics) {
                    _this.transaction.end();
                    var temp = new StatisticsService_1.counterStatistics(counter, statistics);
                    temp.seria = _this.prepareForPieCharts(statistics, counter);
                    console.log('temp', temp);
                    _this.statistics.push(temp);
                    if (index === _this.counters.length - 1)
                        _this.groupStatistics();
                }, function (error) {
                    _this._pipToasts(error);
                    _this.transaction.end();
                });
            }
        });
    };
    StatisticsPanelController.prototype.clean = function () {
        this.search = null;
        this.searchClick();
    };
    StatisticsPanelController.prototype.prepareForPieCharts = function (statistics, counter) {
        var seria, serias = [], values;
        _.each(statistics, function (item) {
            console.log(item);
            seria = new StatisticsService_1.pieChartSeria(item.counter, item.values[0].value);
            serias.push(seria);
        });
        return serias;
    };
    StatisticsPanelController.prototype.prepareForLineCharts = function (statistics, counter, dateFrom, dateTo, category) {
        var _this = this;
        var seria, serias = [], values;
        _.each(statistics, function (item) {
            values = _this._pipStatistics.fillLineCharts(item.values, dateFrom, dateTo, category);
            seria = new StatisticsService_1.lineChartSeria(item.counter, values);
            serias.push(seria);
        });
        console.log('v', values);
        return serias;
    };
    StatisticsPanelController.prototype.groupStatistics = function () {
        this.groups = this.statistics;
        console.log('groups', this.groups);
        this.filterStatistics();
    };
    StatisticsPanelController.prototype.searchClick = function () {
        this._$location.search('search', this.search);
        this.transaction.begin('PROCESSING');
        this.filterStatistics();
    };
    StatisticsPanelController.prototype.filterStatistics = function () {
        var _this = this;
        this.statisticsGroups = new Array();
        _.each(this.groups, function (group, name) {
            console.log('statisticsGroups', group, name);
            if (!_this.search || name.toLowerCase().indexOf(_this.search.toLowerCase()) > -1)
                _this.statisticsGroups.push(new StatisticsService_1.statisticsGroup(name, group));
        });
        this.state = this.statisticsGroups.length === 0 ? ToolsStatisticsStates.Empty : ToolsStatisticsStates.Data;
        this.transaction.end();
    };
    StatisticsPanelController.prototype.refreshStatistics = function (filter) {
        var _this = this;
        if (filter)
            this.filter = filter;
        if (this.statisticsGroups.length == 0)
            return;
        this.state = ToolsStatisticsStates.Progress;
        this._$location.search('filter', this.filter);
        this.transaction.begin('PROCESSING');
        this.getStatistics();
        this._onlyUpdated = true;
        this._$timeout(function () {
            _this._onlyUpdated = false;
        }, 4000);
    };
    StatisticsPanelController.prototype.previousStep = function () {
        switch (this.filter) {
            case StatisticsService_1.StatisticsFilter.Hourly:
                this.hourlyDate = moment.utc(this.hourlyDate).add('days', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Daily:
                this.dailyDate = moment.utc(this.dailyDate).add('weeks', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Monthly:
                this.monthlyDate = moment.utc(this.monthlyDate).add('years', -1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Yearly:
                this.yearlyDate = moment.utc(this.yearlyDate).add('years', -10).toDate();
                break;
        }
        this.refreshStatistics();
    };
    StatisticsPanelController.prototype.nextStep = function () {
        switch (this.filter) {
            case StatisticsService_1.StatisticsFilter.Hourly:
                this.hourlyDate = moment.utc(this.hourlyDate).add('days', 1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Daily:
                this.dailyDate = moment.utc(this.dailyDate).add('weeks', 1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Monthly:
                this.monthlyDate = moment.utc(this.monthlyDate).add('years', 1).toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Yearly:
                this.yearlyDate = moment.utc(this.yearlyDate).add('years', 10).toDate();
                break;
        }
        this.refreshStatistics();
    };
    StatisticsPanelController.prototype.today = function () {
        var utcDate = moment.utc();
        switch (this.filter) {
            case StatisticsService_1.StatisticsFilter.Hourly:
                this.hourlyDate = utcDate.toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Daily:
                this.dailyDate = utcDate.toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Monthly:
                this.monthlyDate = utcDate.toDate();
                break;
            case StatisticsService_1.StatisticsFilter.Yearly:
                utcDate.year(2010);
                this.yearlyDate = utcDate.toDate();
                break;
        }
        this.refreshStatistics();
    };
    StatisticsPanelController.prototype.updateDate = function () {
        if (!this._onlyUpdated)
            this.refreshStatistics();
    };
    StatisticsPanelController.prototype.updateDecade = function (yearlyDate) {
        this.yearlyDate = yearlyDate;
        this.refreshStatistics();
    };
    return StatisticsPanelController;
}());
(function () {
    angular
        .module('pipStatisticsPanel', ['pipCharts'])
        .component('pipStatisticsPanel', {
        bindings: StatisticsPanelBindings,
        templateUrl: 'statistics/StatisticsPanel.html',
        controller: StatisticsPanelController
    });
})();
},{"./StatisticsService":41}],41:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var StatisticsFilter = (function () {
    function StatisticsFilter() {
    }
    return StatisticsFilter;
}());
StatisticsFilter.Yearly = 'Yearly';
StatisticsFilter.Monthly = 'Monthly';
StatisticsFilter.Daily = 'Daily';
StatisticsFilter.Hourly = 'Hourly';
StatisticsFilter.Total = 'Total';
StatisticsFilter.All = ['Total', 'Yearly', 'Monthly', 'Daily', 'Hourly'];
exports.StatisticsFilter = StatisticsFilter;
var counterStatistics = (function () {
    function counterStatistics(counter, statistics, value) {
        this._counter = counter;
        this._statistics = statistics;
        this._value = value || undefined;
    }
    Object.defineProperty(counterStatistics.prototype, "statistics", {
        get: function () {
            return this._statistics;
        },
        set: function (statistics) {
            this._statistics = statistics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(counterStatistics.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(counterStatistics.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (value) {
            this._key = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(counterStatistics.prototype, "counter", {
        get: function () {
            return this._counter;
        },
        set: function (counter) {
            this._counter = counter;
            if (this._seria)
                this._seria.key = counter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(counterStatistics.prototype, "seria", {
        get: function () {
            return this._seria;
        },
        set: function (seria) {
            this._seria = seria;
        },
        enumerable: true,
        configurable: true
    });
    return counterStatistics;
}());
exports.counterStatistics = counterStatistics;
var statisticsGroup = (function () {
    function statisticsGroup(group, counterStats) {
        var _this = this;
        console.log('1', group, counterStats);
        this._group = counterStats['counter'];
        _.each(counterStats['seria'], function (cs, index) {
            counterStats['seria'][index].key = counterStats['statistics'][index].name;
        });
        this._counterStats = counterStats;
        this._series = new Array();
        _.each(this._counterStats['seria'], function (cs) {
            _this._series.push(cs);
            _this._singleChartvalue = _this._singleChartvalue === false ? false : (cs.values !== undefined && cs.values.length === 1);
        });
    }
    Object.defineProperty(statisticsGroup.prototype, "group", {
        get: function () {
            return this._group;
        },
        set: function (group) {
            this._group = group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(statisticsGroup.prototype, "counterStats", {
        get: function () {
            return this._counterStats;
        },
        set: function (counterStats) {
            this._counterStats = counterStats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(statisticsGroup.prototype, "series", {
        get: function () {
            return this._series;
        },
        set: function (series) {
            this._series = series;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(statisticsGroup.prototype, "singleChartvalue", {
        get: function () {
            return this._singleChartvalue;
        },
        set: function (singleChartvalue) {
            this._singleChartvalue = singleChartvalue;
        },
        enumerable: true,
        configurable: true
    });
    return statisticsGroup;
}());
exports.statisticsGroup = statisticsGroup;
var chartValue = (function () {
    function chartValue(x, value, color) {
        this.x = x;
        this.value = value;
        this.color = color || undefined;
    }
    return chartValue;
}());
exports.chartValue = chartValue;
var lineChartSeria = (function () {
    function lineChartSeria(key, values, color) {
        this.key = key;
        this.values = values;
        this.color = color || undefined;
    }
    return lineChartSeria;
}());
exports.lineChartSeria = lineChartSeria;
var pieChartSeria = (function () {
    function pieChartSeria(key, value, color) {
        this.key = key;
        this.value = value;
        this.color = color || undefined;
    }
    return pieChartSeria;
}());
exports.pieChartSeria = pieChartSeria;
var ToolsStatisticsGetFunctions = (function () {
    function ToolsStatisticsGetFunctions() {
    }
    return ToolsStatisticsGetFunctions;
}());
ToolsStatisticsGetFunctions.Yearly = 'getYearlyStats';
ToolsStatisticsGetFunctions.Monthly = 'getMonthlyStats';
ToolsStatisticsGetFunctions.Daily = 'getDailyStats';
ToolsStatisticsGetFunctions.Hourly = 'getHourlyStats';
ToolsStatisticsGetFunctions.Total = 'getTotalStats';
exports.ToolsStatisticsGetFunctions = ToolsStatisticsGetFunctions;
var ToolsStatisticsFormatX = (function () {
    function ToolsStatisticsFormatX() {
    }
    return ToolsStatisticsFormatX;
}());
ToolsStatisticsFormatX.Yearly = 'getUTCFullYear';
ToolsStatisticsFormatX.Monthly = 'getUTCMonth';
ToolsStatisticsFormatX.Daily = 'getUTCDate';
ToolsStatisticsFormatX.Hourly = 'getUTCHours';
exports.ToolsStatisticsFormatX = ToolsStatisticsFormatX;
var ToolsStatisticsFormatTickX = (function () {
    function ToolsStatisticsFormatTickX() {
    }
    ToolsStatisticsFormatTickX.Yearly = function (x) {
        return Number(x).toFixed(0);
    };
    ToolsStatisticsFormatTickX.Monthly = function (x) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[x];
    };
    ToolsStatisticsFormatTickX.Daily = function (x) {
        return Number(x).toFixed(0);
    };
    ToolsStatisticsFormatTickX.Hourly = function (x) {
        x = Number(x);
        return x <= 12 ? x + ' am' : (x - 12) + ' pm';
    };
    return ToolsStatisticsFormatTickX;
}());
exports.ToolsStatisticsFormatTickX = ToolsStatisticsFormatTickX;
var ToolsStatisticsDecade = (function () {
    function ToolsStatisticsDecade(value, name) {
        this.name = name;
        this.value = value;
    }
    return ToolsStatisticsDecade;
}());
exports.ToolsStatisticsDecade = ToolsStatisticsDecade;
var StatisticsService = (function () {
    function StatisticsService() {
        "ngInject";
    }
    StatisticsService.prototype.getStatisticsCount = function (statistics, statKey) {
        var count = 0;
        _.each(statistics, function (item) {
            var key = item.counter.split(".").pop();
            if (key == statKey) {
                _.each(item.values, function (a) {
                    count += a.value;
                });
            }
        });
        return count;
    };
    StatisticsService.prototype.getStatisticsLastActionDate = function (statistics, statKey) {
        var date = { Day: 0, Hour: 0, Month: 0, Year: 0 };
        _.each(statistics, function (item) {
            var key = item.counter.split(".").pop();
            if (key == statKey) {
                _.each(item.values, function (a) {
                    if (date.year < a.year) {
                        date = a;
                    }
                    else if (date.year == a.year && date.month < a.month) {
                        date = a;
                    }
                    else if (date.year == a.year && date.month == a.month && date.day < a.day) {
                        date = a;
                    }
                    else if (date.year == a.year && date.month == a.month && date.day == a.day && date.hour < a.hour) {
                        date = a;
                    }
                });
            }
        });
        if (date.year) {
            return moment.utc([date.year, date.month - 1, date.day, date.hour]).toDate();
        }
        else {
            return null;
        }
    };
    StatisticsService.prototype.formatXvalues = function (x, category) {
        if (x === undefined || !category)
            return;
        return x[ToolsStatisticsFormatX[category]]();
    };
    StatisticsService.prototype.fillLast24LineCharts = function (statistics, dateFrom, dateTo) {
        var from = moment.utc(dateFrom);
        var size;
        var sHour = moment(from).hour(), sDay = moment(from).date(), sMonth = moment(from).month(), sYear = moment(from).year(), values = new Array();
        size = 25;
        var startHours = dateFrom.getUTCHours();
        var h;
        var _loop_1 = function () {
            sHour = (startHours + h) % 24;
            var current = moment.utc([sYear, sMonth, sDay, 0]).add(startHours + h, 'hours');
            var statistic = _.find(statistics, function (point) {
                return sHour == point.hour && current.date() == point.day && current.month() + 1 == point.month && current.year() == point.year;
            });
            var value = statistic ? statistic.value : 0;
            if (startHours === 0) {
                values.push(new chartValue(this_1.formatXvalues(moment.utc([sYear, sMonth, sDay, sHour]).toDate(), 'Hourly'), value));
            }
            else {
                values.push(new chartValue(startHours + h - 24, value));
            }
        };
        var this_1 = this;
        for (h = 0; h < size; h++) {
            _loop_1();
        }
        return values;
    };
    StatisticsService.prototype.fillLineCharts = function (statistics, dateFrom, dateTo, category) {
        var from = moment.utc(dateFrom);
        var to = moment.utc(dateTo);
        var size;
        console.log('st2', statistics);
        var sHour = moment(from).hour(), sDay = moment(from).date(), sMonth = moment(from).month(), sYear = moment(from).year(), values = new Array();
        switch (category) {
            case StatisticsFilter.Hourly:
                size = to.diff(from, 'hours') + 1;
                if (size > 24)
                    size = 24;
                if (size <= 0)
                    break;
                var startHours = dateFrom.getUTCHours();
                var h = void 0;
                var _loop_2 = function () {
                    sHour = (startHours + h) % 24;
                    var current = moment.utc([sYear, sMonth, sDay, 0]).add(startHours + h, 'hours');
                    var statistic = _.find(statistics, function (point) {
                        return sHour == point.hour && current.date() == point.day && current.month() + 1 == point.month && current.year() == point.year;
                    });
                    var value = statistic ? statistic.value : 0;
                    if (startHours === 0) {
                        values.push(new chartValue(this_2.formatXvalues(moment.utc([sYear, sMonth, sDay, sHour]).toDate(), category), value));
                    }
                    else {
                        values.push(new chartValue(startHours + h - 24, value));
                    }
                };
                var this_2 = this;
                for (h = 0; h < size; h++) {
                    _loop_2();
                }
                break;
            case StatisticsFilter.Daily:
                size = to.diff(from, 'days') + 1;
                sHour = null;
                var day_1;
                for (day_1 = sDay; day_1 < sDay + size; day_1++) {
                    var statistic = _.find(statistics, function (point) {
                        return day_1 == point.day && sMonth + 1 == point.month && sYear == point.year;
                    });
                    var value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth, day_1]).toDate(), category), value));
                }
                break;
            case StatisticsFilter.Monthly:
                sHour = null;
                sDay = null;
                for (sMonth = 0; sMonth < 12; sMonth++) {
                    var statistic = _.find(statistics, function (point) {
                        return sMonth + 1 == point.month && sYear == point.year;
                    });
                    var value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([sYear, sMonth]).toDate(), category), value));
                }
                break;
            case StatisticsFilter.Yearly:
                var i_1;
                size = to.diff(from, 'years') + 1;
                sHour = null;
                sDay = null;
                sMonth = null;
                for (i_1 = sYear; i_1 < sYear + size + 1; i_1++) {
                    var statistic = _.find(statistics, function (point) {
                        return i_1 == point.year;
                    });
                    var value = statistic ? statistic.value : 0;
                    values.push(new chartValue(this.formatXvalues(moment.utc([i_1]).toDate(), category), value));
                }
                break;
        }
        return values;
    };
    return StatisticsService;
}());
var StatisticsProvider = (function () {
    function StatisticsProvider() {
    }
    StatisticsProvider.prototype.$get = function () {
        "ngInject";
        if (this._service == null)
            this._service = new StatisticsService();
        return this._service;
    };
    return StatisticsProvider;
}());
angular
    .module('pipStatisticsService', [])
    .provider('pipStatistics', StatisticsProvider);
},{}],42:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('counters/CountersPage.html',
    '<pip-counters-panel></pip-counters-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('counters/CountersPanel.html',
    '<table class="table table-striped table-hover bm0 pip-admin-counters-header" ng-if="$ctrl.pipMedia(\'gt-sm\')"><thead><tr><th class="pip-admin-small-td">Type</th><th>Name</th><th>Count</th></tr></thead></table><div class="pip-admin-counters pip-scroll-y pip-scroll" ng-class="{\'pip-admin-read-error\':$ctrl.error}"><table class="table table-striped table-hover" ng-if="$ctrl.pipMedia(\'gt-sm\') && $ctrl.counters" pip-scroll-container="\'.pip-admin-counters\'" pip-scroll-listen-for-event="windowResized" pip-scroll-distance="0.1"><tbody><tr ng-repeat="counter in $ctrl.counters"><td class="pip-admin-small-td">{{counter.type}}</td><td>{{counter.name}}</td><td>{{counter.count}}</td></tr></tbody></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('errors/ErrorsPage.html',
    '<pip-errors-panel></pip-errors-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('errors/ErrorsPanel.html',
    '<div class="pip-errors"><div class="pip-page-errors" ng-if="$ctrl.error"><span class="pip-error-text text-overflow color-error flex">{{::$ctrl.errorText | translate}}</span> <span class="pointer layout-row layout-align-start-center flex-fixed" ng-click="$ctrl.onClickErrorDetails()"><md-icon md-svg-icon="icons:info-circle" class="rm16 color-error"></md-icon><span class="flex text-body2 color-error">{{:: \'DETAILS\' | translate }}</span></span></div><div class="pip-filter-row divider-bottom layout-row pip-search-panel rp16 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" class="pip-search-panel-primary" pip-on-search="$ctrl.onSearchErrors()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row><div class="pip-search-panel-secondary layout-row layout-align-start-center"><div class="flex"></div><div class="pip-filter-text">Autorefresh</div><md-input-container class="md-block"><md-select class="flex" aria-label="Status" ng-model="$ctrl.refresh" ng-disabled="$ctrl.updating" md-on-close="$ctrl.onRefreshChange()"><md-option ng-value="minutes" ng-repeat="minutes in $ctrl.refreshTimes">{{::minutes}} mins</md-option></md-select></md-input-container></div></div><md-button class="md-fab md-accent md-fab-bottom-right" aria-label="add" ng-hide="$ctrl.loading" ng-disabled="$ctrl.updating" ng-click="$ctrl.onRefreshClick()"><md-icon md-svg-icon="icons:reload"></md-icon></md-button><md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.updating"></md-progress-linear><table class="table table-striped table-hover bm0 pip-errors-header" ng-if="$ctrl._pipMedia(\'gt-xs\') && $ctrl.state == \'data\'"><thead><tr><th class="pip-big-td">Error</th><th class="pip-small-medium-td">First</th><th class="pip-small-medium-td">Last</th><th class="pip-small-td">Count</th><th class="pip-small-td p4"></th></tr></thead></table><div class="pip-errors-container pip-scroll-y pip-scroll" ng-class="{\'pip-read-error\':$ctrl.error}" ng-if="$ctrl.state == \'data\'"><table class="table table-striped table-hover bm0" ng-if="$ctrl._pipMedia(\'gt-xs\')"><tbody><tr ng-repeat-start="errorType in $ctrl.errors track by $index" ng-click="errorType.collapsed = !errorType.collapsed"><td class="pip-big-td text-overflow">{{errorType.ErrorType}}</td><td class="pip-small-medium-td text-overflow">{{ errorType.first }}</td><td class="pip-small-medium-td text-overflow">{{ errorType.last }}</td><td class="pip-small-td">{{ errorType.count }}</td><td class="pip-small-td text-center p4"><md-button class="md-icon-button m0 p0" aria-label="expand"><md-icon md-svg-icon="icons:chevron-down" ng-class="{\'error-expand\': errorType.collapsed, \'error-not-expand\': !errorType.collapsed }"></md-icon></md-button></td></tr><tr ng-repeat-end="" ng-if="errorType.collapsed"><td class="p0 error-messages" colspan="5"><table class="table table-striped table-hover bm0"><tfoot ng-if="errorType.items.length > $ctrl.showMessagesLimit"><tr><td colspan="4"><a class="lm16" ng-click="$ctrl.onShowMore(errorType)" ng-class="{\'rm16\': errorType.show > $ctrl.showMessagesLimit}" ng-show="errorType.show < errorType.items.length">Show More ...</a> <a ng-click="$ctrl.onShowLess(errorType)" ng-show="errorType.show > $ctrl.showMessagesLimit">Show Less ...</a></td></tr></tfoot><tbody><tr ng-repeat="item in errorType.items | limitTo:errorType.show" class="active .error-message" ng-click="$ctrl.onErrorsDetails(item)"><td class="pip-big-td text-overflow">{{ item.message }}</td><td class="pip-small-medium-td text-overflow">{{ item.time}}</td><td class="pip-small-medium-td text-overflow">{{ item.correlation_id }}</td><td class="pip-small-td"></td><td class="pip-small-td text-center p4"><md-button class="md-icon-button m0 p0" aria-label="show-details"><md-icon class="pointer" md-svg-icon="icons:search"></md-icon></md-button></td></tr></tbody></table></td></tr></tbody></table><md-list class="pip-menu pip-ref-list" ng-if="$ctrl._pipMedia(\'xs\')" style="overflow-x: hidden"><md-list-item class="pip-ref-list-item" ng-class="{\'divider-bottom\': !$last}" md-ink-ripple="" ng-repeat-start="errorType in $ctrl.errors"><div class="pip-content flex" ng-click="errorType.collapsed = !errorType.collapsed"><div class="pip-title text-overflow">{{errorType.items[0].Error.Type}}</div><p class="pip-subtitle text-overflow tm4">{{errorType.first }} • {{errorType.last}} • {{errorType.count}}</p></div><div class="pip-pic flex-fixed" ng-click="errorType.collapsed = !errorType.collapsed"><md-icon md-svg-icon="icons:chevron-down" ng-class="{\'error-expand\': errorType.collapsed, \'error-not-expand\': !errorType.collapsed }"></md-icon></div></md-list-item><div ng-repeat-end="" ng-if="errorType.collapsed"><md-list-item class="pip-ref-list-item error-messages" ng-class="{\'divider-bottom\': !$last}" md-ink-ripple="" ng-repeat="item in errorType.items | limitTo:errorType.show"><div class="pip-content flex" ng-click="$ctrl.onErrorsDetails(item)"><div class="pip-title text-overflow">{{ item.message }}</div><p class="pip-subtitle text-overflow tm4">{{ item.correlation_id }} <span ng-show="item.correlation_id && item.time">•</span> {{ item.time }}</p></div><div class="pip-pic flex-fixed" ng-click="$ctrl.onErrorsDetails(item)"><md-icon md-svg-icon="icons:search"></md-icon></div></md-list-item><div class="h48 layout-align-start-center layout-row divider-bottom" ng-if="errorType.items.length > $ctrl.showMessagesLimit"><a class="lm16" ng-click="$ctrl.onShowMore(errorType)" ng-class="{\'rm16\': errorType.show > $ctrl.showMessagesLimit}" ng-show="errorType.show < errorType.items.length">Show More ...</a> <a ng-click="$ctrl.onShowLess(errorType)" ng-show="errorType.show > $ctrl.showMessagesLimit">Show Less ...</a></div></div></md-list></div><div class="layout-column layout-align-center-center flex pip-admin-empty" ng-if="$ctrl.state == \'empty\' || $ctrl.state == \'loading\'"><div class="pip-empty" ng-if="$ctrl.state == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There are no errors…<br>Try again later <span ng-show="$ctrl.searchQuery">or change filter options</span></div></div><div class="pip-empty" ng-if="$ctrl.state == \'loading\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading errors<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/EventsPage.html',
    '<pip-events-panel></pip-events-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/EventsPanel.html',
    '<div ng-show="$ctrl.error" class="pip-page-errors"><span class="pip-error-text color-error text-overflow flex">{{$ctrl.error}}</span><md-icon md-svg-icon="icons:warn-circle" class="color-error"></md-icon></div><div class="pip-filter-row divider-bottom layout-row pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" pip-on-search="$ctrl.refreshEvents()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row></div><md-button class="md-fab md-accent md-fab-bottom-right" ng-click="$ctrl.refreshEvents()" aria-label="add"><md-icon md-svg-icon="icons:reload"></md-icon></md-button><md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.updating && $ctrl.state == \'data\'"></md-progress-linear><table class="table table-striped table-hover bm0 pip-admin-events-header" ng-if="$ctrl.pipMedia(\'gt-sm\') && $ctrl.state == \'data\'"><thead><tr><th class="pip-admin-small-td">Severity</th><th ng-class="$ctrl.pipMedia(\'gt-md\') ? \'pip-admin-medium-td\': \'pip-admin-small-medium-td\'">ID</th><th class="pip-admin-small-medium-td">Time</th><th class="pip-admin-small-medium-td">Type</th><th class="pip-admin-medium-td">Source</th><th>Message</th></tr></thead></table><div class="pip-admin-events pip-scroll-y pip-scroll" ng-if="$ctrl.state == \'data\'"><table class="table table-striped table-hover" ng-if="$ctrl.pipMedia(\'gt-sm\')" pip-infinite-scroll="$ctrl.readEvents()" pip-scroll-container="\'.pip-admin-events\'" pip-scroll-listen-for-event="windowResized" pip-scroll-distance="0.1"><tbody><tr class="w-streach" ng-repeat="event in $ctrl.events"><td class="pip-admin-small-td">{{event.severity}}</td><td class="pip-admin-break" ng-class="$ctrl.pipMedia(\'gt-md\') ? \'pip-admin-medium-td\': \'pip-admin-small-medium-td\'">{{event.id}}</td><td class="pip-admin-small-medium-td">{{event.time }}</td><td class="pip-admin-small-medium-td">{{event.type}}</td><td class="pip-admin-medium-td">{{event.source}}</td><td class="">{{event.message}}</td></tr></tbody></table><md-list class="pip-menu pip-ref-list" ng-if="($ctrl.pipMedia(\'xs\') || $ctrl.pipMedia(\'sm\')) && $ctrl.state == \'data\'" style="overflow-x: hidden"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="event in $ctrl.events"><div class="pip-pic layout-row layout-align-center-center"><md-icon md-svg-icon="icons:warn-star" ng-if="event.severity == 0" class="color-error"><md-tooltip md-visible="showTooltip" md-direction="right">Critical</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-triangle" ng-if="event.severity == 1" class="color-warm"><md-tooltip md-visible="showTooltip" md-direction="right">Important</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-circle" ng-if="event.severity == 2" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Informational</md-tooltip></md-icon></div><div class="pip-content"><div class="text-body2 text-overflow">{{event.correlation_id}} <span>•</span> {{event.time }} <span ng-if="event.Type">•</span> {{event.type}}</div><div class="text-body2">{{event.component}}</div><p class="pip-subtitle">{{event.message}}</p></div></md-list-item></md-list></div><div class="layout-column layout-align-center-center flex pip-admin-empty pip-scroll" ng-if="$ctrl.state == \'progress\' || $ctrl.state == \'empty\'"><div class="pip-empty" ng-if="$ctrl.state == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There are no events right now…<br>Try again later or change filter options</div></div><div class="pip-empty" ng-if="$ctrl.state == \'progress\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading events<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('logging/LoggingPage.html',
    '<pip-logging-panel></pip-logging-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('logging/LoggingPanel.html',
    '<div class="pip-filter-row divider-bottom layout-row pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.localSearch" pip-on-search="$ctrl.onSearch()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row><div class="flex layout-row layout-align-start-center"><div class="flex"></div><div class="pip-filter-text">Autorefresh</div><md-input-container class="md-block"><md-select class="flex" aria-label="Status" ng-model="$ctrl.refresh" md-on-close="$ctrl.onRefreshChange()"><md-option ng-value="minutes" ng-repeat="minutes in $ctrl.refreshTimes">{{::minutes}} sec</md-option></md-select></md-input-container></div></div><md-button class="md-fab md-accent md-fab-bottom-right" aria-label="add" ng-click="$ctrl.playStopAutoUpdate()"><md-icon md-svg-icon="icons:play" ng-if="!$ctrl.autoUpdate"></md-icon><md-icon md-svg-icon="icons:pause" ng-if="$ctrl.autoUpdate"></md-icon></md-button><md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.transaction.busy() && $ctrl.state() != \'progress\'"></md-progress-linear><table class="table table-striped table-hover bm0 pip-admin-loggings-header" ng-if="$ctrl.pipMedia(\'gt-sm\') && $ctrl.state() != \'empty\'"><thead><tr><th class="pip-admin-small-td">level</th><th class="pip-admin-medium-td">Time</th><th class="pip-admin-medium-td">Correlation ID</th><th>Message</th><th class="pip-admin-small-td"></th></tr></thead></table><div class="pip-admin-loggings pip-scroll-y pip-scroll" ng-class="{\'pip-admin-read-error\':$ctrl.error}" ng-if="$ctrl.state() != \'empty\'"><table class="table table-striped table-hover" ng-if="$ctrl.pipMedia(\'gt-sm\') && $ctrl.loggings && $ctrl.state() != \'empty\'" pip-infinite-scroll="$ctrl.readLogging()" pip-scroll-container="\'.pip-admin-loggings\'" pip-scroll-listen-for-event="windowResized" pip-scroll-distance="0.1"><tbody><tr ng-repeat="trace in $ctrl.loggings()"><td class="pip-admin-small-td"><md-icon md-svg-icon="icons:menu" ng-if="trace.level == 6" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Trace</md-tooltip></md-icon><md-icon md-svg-icon="icons:bug" ng-if="trace.level == 5" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Debug</md-tooltip></md-icon><md-icon md-svg-icon="icons:info-circle-outline" ng-if="trace.level == 4" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Info</md-tooltip></md-icon><md-icon md-svg-icon="icons:info-circle" ng-if="trace.level == 3" class="color-warm"><md-tooltip md-visible="showTooltip" md-direction="right">Warning</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-triangle" ng-if="trace.level == 2" class="color-warn"><md-tooltip md-visible="showTooltip" md-direction="right">Error</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-star" ng-if="trace.level == 1" class="color-error"><md-tooltip md-visible="showTooltip" md-direction="right">Fatal</md-tooltip></md-icon></td><td class="pip-admin-medium-td">{{trace.time}}</td><td class="pip-admin-medium-td">{{trace.correlation_id}}</td><td class=""><div class="pip-admin-trace-message">{{trace.message}}</div></td><td class="pip-admin-small-td tp4 bp4"><md-button class="md-icon-button" ng-click="$ctrl.onErrorDetails(trace)" aria-label="error" ng-if="trace.error"><md-icon md-svg-icon="icons:search"></md-icon></md-button></td></tr></tbody></table><md-list class="pip-menu pip-ref-list tp0" ng-if="($ctrl.pipMedia(\'xs\') || $ctrl.pipMedia(\'sm\')) && $ctrl.state() == \'data\'"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="trace in $ctrl.loggings"><div class="pip-pic flex-fixed lm16 layout-row layout-align-center-center"><md-icon md-svg-icon="icons:menu" ng-if="trace.level == 6" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Trace</md-tooltip></md-icon><md-icon md-svg-icon="icons:bug" ng-if="trace.level == 5" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Debug</md-tooltip></md-icon><md-icon md-svg-icon="icons:info-circle-outline" ng-if="trace.level == 4" class="fg-cyan"><md-tooltip md-visible="showTooltip" md-direction="right">Info</md-tooltip></md-icon><md-icon md-svg-icon="icons:info-circle" ng-if="trace.level == 3" class="color-warm"><md-tooltip md-visible="showTooltip" md-direction="right">Warning</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-triangle" ng-if="trace.level == 2" class="color-warn"><md-tooltip md-visible="showTooltip" md-direction="right">Error</md-tooltip></md-icon><md-icon md-svg-icon="icons:warn-star" ng-if="trace.level == 1" class="color-error"><md-tooltip md-visible="showTooltip" md-direction="right">Fatal</md-tooltip></md-icon></div><div class="pip-content flex"><div class="text-body2 text-overflow">{{trace.time}} <span ng-if="trace.CorrelationId">•</span> {{trace.correlation_id}}</div><p class="pip-subtitle pip-trace-message">{{trace.message}}</p></div><div class="pip-pic rm0"><md-button class="md-icon-button flex-fixed" ng-if="trace.Error" ng-click="$ctrl.onErrorDetails(trace)" aria-label="error"><md-icon md-svg-icon="icons:search"></md-icon></md-button></div></md-list-item></md-list></div><div class="layout-column layout-align-center-center flex pip-admin-empty pip-scroll" ng-if="$ctrl.state() == \'empty\' || $ctrl.state() == \'progress\'"><div class="pip-empty" ng-if="$ctrl.state() == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There is no data right now…<br>Try again later or change filter options</div></div><div class="pip-empty" ng-show="$ctrl.state() == \'progress\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading traces<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings/AddSettingsKeyDialog.html',
    '<md-dialog class="pip-dialog layout-column bb-settings-key-dialog" width="400" md-theme="{{$ctrl.theme}}"><div class="pip-body pip-scroll p16 bp0"><h3 class="tm0">{{$ctrl.title}}</h3><md-input-container class="md-block flex bm0"><label>Key</label> <input ng-model="$ctrl.key.name"></md-input-container><md-input-container class="md-block flex bm0"><label>Value</label> <textarea ng-model="$ctrl.key.data"> </textarea></md-input-container></div><div class="pip-footer"><div><md-button class="md-accent" ng-click="$ctrl.onCancel()">Cancel</md-button><md-button class="md-accent" ng-click="$ctrl.onOk()" ng-disabled="!$ctrl.key.name || !$ctrl.key.data">Ok</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings/AddSettingsSectionDialog.html',
    '<md-dialog class="pip-dialog layout-column pip-scroll" width="400" md-theme="{{$ctrl.theme}}"><div class="pip-body"><h3 class="tm0">New section</h3><md-input-container class="md-block flex bm0"><label>Section name</label> <input ng-model="$ctrl.sectionName"></md-input-container></div><div class="pip-footer"><div><md-button class="md-accent" ng-click="$ctrl.onCancel()">Cancel</md-button><md-button class="md-accent" ng-click="$ctrl.onOk()" ng-disabled="!$ctrl.sectionName">Ok</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings/SettingsPage.html',
    '<pip-settings-panel></pip-settings-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings/SettingsPanel.html',
    '<div class="pip-main-menu pip-settings" ng-class="{\'pip-single-content\': $ctrl.details}" ng-if="$ctrl.pipMedia(\'gt-sm\')"><div class="pip-menu"><div class="pip-filter-row layout-row pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" pip-on-search="$ctrl.onSearch()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row></div><div ng-show="$ctrl.error" class="pip-page-errors"><span class="pip-error-text color-error flex">{{$ctrl.error}}</span><md-icon md-svg-icon="icons:warn-circle" class="color-error"></md-icon></div><div class="pip-list-container pip-scroll" style="height: calc(100% - 48px);" ng-class="{\'pip-menu-empty\': $ctrl.state == \'empty\'}"><md-list class="pip-simple-list tp0" pip-selected="$ctrl.selectIndex" pip-select="$ctrl.selectItem($event.index)"><md-list-item class="pip-simple-list-item pip-selectable {{ $ctrl.selectIndex == $index ? \'selected\' : \'\' }}" md-ink-ripple="" ng-repeat="section in $ctrl.settingsSections" ng-show="!section.hide"><p class="pip-title text-body2">{{ section.name }}</p></md-list-item></md-list></div></div><div class="pip-content-container"><div><pip-document><div class="pip-header p0" ng-if="$ctrl.pipMedia(\'gt-md\') && $ctrl.state == \'data\'"><table class="table table-striped table-hover bm0"><thead><tr><th class="lp16">Key</th><th class="pip-settings-value">Value</th><th style="width: 48px"></th></tr></thead></table></div><div class="pip-body p0 layout-column layout-align-center-center" ng-if="$ctrl.pipMedia(\'gt-md\') && $ctrl.state != \'data\'"><div class="layout-column layout-align-center-center flex pip-empty pip-scroll w-stretch" ng-if="$ctrl.state == \'empty\'"><div class="pip-empty"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There is no data right now…<br>Try again later or change filter options</div></div></div><div class="layout-column layout-align-center-center flex pip-empty pip-scroll w-stretch" ng-if="$ctrl.state == \'progress\'"><div class="pip-empty"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading settings<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div></div><div class="pip-body p0" ng-if="$ctrl.state == \'data\'"><table class="table table-striped table-hover" style="margin-bottom: 72px" ng-if="$ctrl.pipMedia(\'gt-md\')"><tbody><tr ng-repeat="(key, value) in $ctrl.settings[$ctrl.selectIndex]" ng-if="key != \'toJSON\'"><td class="pip-settings-key lp16" ng-bind-html="key"></td><td class="pip-settings-value"><div class="pip-settings-key" ng-if="!key.includes(\'Utc\')">{{ value }}</div><div class="pip-settings-key" ng-if="key.includes(\'Utc\')">{{ value }}</div></td><td class="tp4 bp4" style="width: 48px"><md-menu><md-button class="md-icon-button" ng-click="$mdOpenMenu()" aria-label="vdots"><md-icon md-menu-origin="" md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item><md-button ng-click="$ctrl.updateKey(key, value)" aria-label="update">Update</md-button></md-menu-item><md-menu-item ng-click="$ctrl.openDeleteKeyDialog(key, value)"><md-button aria-label="delete">Delete</md-button></md-menu-item></md-menu-content></md-menu></td></tr></tbody></table><div ng-if="$ctrl.pipMedia(\'md\') && $ctrl.state == \'data\'"><div class="pip-menu" style="width: 100% !important;"><div class="pip-list-container pip-scroll"><md-list class="pip-ref-list tp0"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-if="key != \'toJSON\'" ng-repeat="(key, value) in $ctrl.settings[$ctrl.selectIndex]"><div class="pip-content flex"><div class="text-body2 text-overflow" ng-bind-html="key"></div><p class="pip-subtitle">{{value}}</p></div><div class="pip-pic rm0"><md-menu><md-button class="md-icon-button" ng-click="$mdOpenMenu()" aria-label="vdots"><md-icon md-menu-origin="" md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item><md-button ng-click="$ctrl.updateKey(key, value)" aria-label="update">Update</md-button></md-menu-item><md-menu-item ng-click="$ctrl.openDeleteKeyDialog(key, value)"><md-button aria-label="delete">Delete</md-button></md-menu-item></md-menu-content></md-menu></div></md-list-item></md-list><div style="margin-bottom: 72px"></div></div></div></div></div><md-fab-speed-dial md-direction="up" style="z-index: 55" ng-if="$ctrl.state != \'progress\'" class="md-fab-bottom-right md-fling" pip-fab-tooltip-visibility="opened" pip-fab-show-tooltip="showTooltip" md-open="opened"><md-fab-trigger><md-button aria-label="menu" class="md-fab md-accent"><md-icon md-svg-icon="icons:plus"></md-icon></md-button></md-fab-trigger><md-fab-actions><md-button aria-label="New section" class="md-fab md-accent md-mini pip-fab-mini md-raised" ng-disabled="transaction.busy()" ng-click="$ctrl.addSection()"><md-tooltip md-visible="showTooltip" md-direction="left">Section</md-tooltip><md-icon md-svg-icon="icons:pie-chart"></md-icon></md-button><md-button aria-label="New key" class="md-fab md-accent md-mini md-raised pip-fab-mini" ng-disabled="transaction.busy()" ng-click="$ctrl.addKey()"><md-tooltip md-visible="showTooltip" md-direction="left">Key</md-tooltip><md-icon md-svg-icon="icons:submenu"></md-icon></md-button></md-fab-actions></md-fab-speed-dial></pip-document></div></div></div><md-fab-speed-dial md-direction="up" style="z-index: 55" ng-if="$ctrl.state != \'progress\' && !$ctrl.pipMedia(\'gt-sm\')" class="md-fab-bottom-right md-fling" pip-fab-tooltip-visibility="opened" pip-fab-show-tooltip="showTooltip" md-open="opened"><md-fab-trigger><md-button aria-label="menu" class="md-fab md-accent"><md-icon md-svg-icon="icons:plus"></md-icon></md-button></md-fab-trigger><md-fab-actions><md-button aria-label="New section" class="md-fab md-accent md-mini pip-fab-mini md-raised" ng-disabled="transaction.busy()" ng-click="$ctrl.addSection()"><md-tooltip md-visible="showTooltip" md-direction="left">Section</md-tooltip><md-icon md-svg-icon="icons:pie-chart"></md-icon></md-button><md-button aria-label="New key" class="md-fab md-accent md-mini md-raised pip-fab-mini" ng-disabled="transaction.busy()" ng-click="$ctrl.addKey()"><md-tooltip md-visible="showTooltip" md-direction="left">Key</md-tooltip><md-icon md-svg-icon="icons:submenu"></md-icon></md-button></md-fab-actions></md-fab-speed-dial><pip-dropdown pip-actions="$ctrl.settingsSections" pip-active-index="$ctrl.selectIndex" pip-change="$ctrl.getSelectDropdown()" ng-if="!$ctrl.pipMedia(\'gt-sm\') && $ctrl.state != \'progress\'"></pip-dropdown><div class="pip-main-menu pip-settings" ng-if="!$ctrl.pipMedia(\'gt-sm\') && $ctrl.state != \'progress\'"><div class="pip-menu" style="width: 100% !important;"><div class="pip-list-container pip-scroll"><md-list class="pip-ref-list tp0"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="(key, value) in $ctrl.settings[$ctrl.selectIndex]" ng-if="key != \'toJSON\'"><div class="pip-content flex"><div class="text-body2 text-overflow" ng-bind-html="key"></div><p class="pip-subtitle">{{value}}</p></div><div class="pip-pic rm0"><md-menu><md-button class="md-icon-button" ng-click="$mdOpenMenu()"><md-icon md-menu-origin="" md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item><md-button ng-click="$ctrl.updateKey(key, value)">Update</md-button></md-menu-item><md-menu-item ng-click="$ctrl.openDeleteKeyDialog(key, value)"><md-button>Delete</md-button></md-menu-item></md-menu-content></md-menu></div></md-list-item></md-list><div style="margin-bottom: 72px"></div></div></div></div><div class="layout-column layout-align-center-center flex pip-empty" ng-if="$ctrl.state == \'progress\'"><div class="pip-empty"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading settings<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div><md-progress-linear md-mode="indeterminate" style="position: absolute; z-index: 100" ng-show="$ctrl.transaction.busy() && $ctrl.state != \'progress\'"></md-progress-linear>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('statistics/StatisticsPage.html',
    '<pip-statistics-panel></pip-statistics-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('statistics/StatisticsPanel.html',
    '<div class="pip-filter-row divider-bottom layout-row pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" pip-on-search="$ctrl.searchClick()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row><div class="pip-search-panel-primary flex layout-row layout-align-start-center"><md-input-container class="md-block"><md-select class="flex" aria-label="Status" ng-model="$ctrl.filter"><md-option ng-value="opt" ng-click="$ctrl.refreshStatistics(opt)" ng-repeat="opt in $ctrl.filters">{{::opt}}</md-option></md-select></md-input-container><div class="pip-filter-text" ng-if="$ctrl.filter !== $ctrl.TOTAL">for</div><div ng-if="$ctrl.filter === \'Hourly\'"><md-datepicker ng-model="$ctrl.hourlyDate" ng-change="$ctrl.refreshStatistics()"></md-datepicker></div><div ng-if="$ctrl.filter === \'Daily\'"><pip-date-range pip-date-range-type="weekly" ng-model="$ctrl.dailyDate" pip-changed="$ctrl.updateDate()"></pip-date-range></div><div ng-if="$ctrl.filter === \'Monthly\'"><pip-date-range pip-date-range-type="yearly" ng-model="$ctrl.monthlyDate" pip-changed="$ctrl.updateDate()"></pip-date-range></div><div ng-if="$ctrl.filter === \'Yearly\'"><md-input-container class="md-block"><md-select ng-model="$ctrl.yearlyName" class="flex"><md-option ng-repeat="decade in $ctrl.decades" ng-value="decade.name" ng-click="$ctrl.updateDecade(decade.value)">{{ decade.name }}</md-option></md-select></md-input-container></div><md-button ng-if="$ctrl.filter !== $ctrl.TOTAL && $ctrl.pipMedia(\'gt-sm\')" class="rm0"><md-icon md-svg-icon="icons:arrow-left" ng-click="$ctrl.previousStep()"></md-icon></md-button><md-button ng-if="$ctrl.filter !== $ctrl.TOTAL && $ctrl.pipMedia(\'gt-sm\')" class="lm0 rm0"><md-icon md-svg-icon="icons:date" ng-click="$ctrl.today()"></md-icon></md-button><md-button ng-if="$ctrl.filter !== $ctrl.TOTAL && $ctrl.pipMedia(\'gt-sm\')" class="lm0"><md-icon md-svg-icon="icons:arrow-right" ng-click="$ctrl.nextStep()"></md-icon></md-button></div></div><md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.transaction.busy() && $ctrl.state != \'progress\'"></md-progress-linear><pip-simple ng-if="$ctrl.state === \'data\'"><div class="p16"><div ng-repeat="statistics in $ctrl.statisticsGroups" ng-if="$ctrl.filter !== $ctrl.TOTAL" style="margin-bottom: 24px;"><h4>{{ statistics.group }}</h4><pip-line-chart pip-series="statistics.series" pip-inter-legend="true" ng-if="!statistics.singleChartValue" pip-x-tick-format="$ctrl.chartXTickFormat"></pip-line-chart><pip-bar-chart pip-series="statistics.series" pip-inter-legend="true" ng-if="statistics.singleChartValue" pip-x-tick-format="$ctrl.chartXTickFormat()"></pip-bar-chart></div><div ng-repeat="statistics in $ctrl.statisticsGroups" ng-if="$ctrl.filter === $ctrl.TOTAL" ng-class="{\'w-stretch\': !$ctrl.pipMedia(\'gt-sm\')}" style="display: inline-block; width: 295px; height:330px; margin-bottom: 24px; margin-right: 16px;"><h4>{{ statistics.group }}</h4><pip-pie-chart pip-series="statistics.series" pip-centered="true" pip-donut="true" pip-size="250"></pip-pie-chart></div></div></pip-simple><div class="layout-column layout-align-center-center flex pip-admin-empty" ng-if="$ctrl.state == \'empty\' || $ctrl.state == \'progress\'"><div class="pip-empty" ng-if="$ctrl.state == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There is no data right now…<br>Try again later or change filter options</div></div><div class="pip-empty" ng-if="$ctrl.state == \'progress\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading statistics<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSystem.Templates');
} catch (e) {
  module = angular.module('pipSystem.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/search/SearchRow.html',
    '<div class="pip-search layout-row layout-align-start-center flex"><md-button class="md-icon-button pip-search-button flex-fixed" ng-click="searchRow.onSearch()" ng-disabled="searchRow.isDisable()" aria-label="search"><md-icon md-svg-icon="icons:search"></md-icon></md-button><md-input-container md-no-float="" class="md-block tm8 bm8" ng-disabled="searchRow.isDisable()"><input ng-model="searchRow.localSearch" placeholder="{{::searchRow.placeholder | translate}}" ng-keypress="searchRow.onKeyPress($event)" ng-change="searchRow.onSearch()"></md-input-container><md-button class="md-icon-button flex-fixed pip-search-clear-button" ng-if="searchRow.localSearch != \'\' && searchRow.localSearch" ng-click="searchRow.onClear()" n="" ng-disabled="searchRow.isDisable()" aria-label="search"><md-icon md-svg-icon="icons:delete"></md-icon></md-button></div>');
}]);
})();



},{}]},{},[42,1,2,3,4,5,6,7,8,9,10,11,12,13,15,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41])(42)
});

//# sourceMappingURL=pip-admin-system.js.map

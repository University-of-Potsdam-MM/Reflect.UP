webpackJsonp([14],{

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var EventProvider = (function () {
    function EventProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        this.configStorageKey = "config";
        this.checkIfReady();
        this.loadParams();
    }
    EventProvider.prototype.checkIfReady = function () {
        var _this = this;
        this.readyObservable = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].create(function (observer) {
            _this.storage.get("eventParameterLoaded").then(function (loaded) {
                if (loaded) {
                    observer.next(true);
                }
                else {
                    observer.next(false);
                }
            });
        });
    };
    EventProvider.prototype.loadParams = function () {
        var _this = this;
        this.storage.get(this.configStorageKey).then(function (config) {
            if (config) {
                _this.url = config.moodleServiceEndpoint;
                _this.course_id = config.courseID;
                _this.accessToken = config.authorization.credentials.accessToken;
                _this.storage.set("eventParameterLoaded", true);
            }
        });
        this.storage.get("session").then(function (token) {
            if (token) {
                _this.wstoken = token.token;
            }
        });
    };
    EventProvider.prototype.getAppointments = function () {
        var today = new Date();
        var oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear() + 1);
        var params = new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["d" /* HttpParams */]()
            .append("wstoken", this.wstoken)
            .append("wsfunction", "local_reflect_get_calendar_entries")
            .append("moodlewsrestformat", "json")
            .append("options[userevents]", "0")
            .append("options[siteevents]", "0")
            .append("options[timestart]", Math.floor(today.getTime() / 1000).toString())
            .append("options[timeend]", Math.floor(oneYearLater.getTime() / 1000).toString())
            .append("options[ignorehidden]", "1")
            .append("courseID", this.course_id);
        var headers = new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", this.accessToken);
        return this.http.get(this.url, { headers: headers, params: params });
    };
    EventProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], EventProvider);
    return EventProvider;
}());

//# sourceMappingURL=event-provider.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ContactsPage = (function () {
    function ContactsPage(navCtrl, navParams, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.configStorageKey = "config";
        this.selectedModule = null;
        this.showLevel1 = null;
        this.showLevel2 = null;
        this.storage.get(this.configStorageKey).then(function (config) {
            if (config) {
                _this.selectedModule = config;
            }
        });
    }
    ContactsPage.prototype.toggleLevel1 = function (idx) {
        if (this.isLevel1Shown(idx)) {
            this.showLevel1 = null;
            this.showLevel2 = null;
        }
        else {
            this.showLevel1 = idx;
            this.showLevel2 = null;
        }
    };
    ContactsPage.prototype.toggleLevel2 = function (idx) {
        if (this.isLevel2Shown(idx)) {
            this.showLevel2 = null;
        }
        else {
            this.showLevel2 = idx;
        }
    };
    ContactsPage.prototype.isLevel1Shown = function (idx) {
        return this.showLevel1 === idx;
    };
    ContactsPage.prototype.isLevel2Shown = function (idx) {
        return this.showLevel2 === idx;
    };
    ContactsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-contacts',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/contacts/contacts.html"*/'<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle right>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>{{ "pageHeader.contactsPage" | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div *ngIf="selectedModule">\n        <ion-list>\n            <div *ngFor="let module of selectedModule.contactPersonsObject; let i = index" padding-left padding-right padding-top>\n                <ion-item no-lines class="groupLevel1"  tappable (click)="toggleLevel1(\'idx\'+i)" [ngClass]="{active: isLevel1Shown(\'idx\'+i)}">\n                    <ion-icon item-left name="arrow-dropright" *ngIf="!isLevel1Shown(\'idx\'+i)"></ion-icon>\n                    <ion-icon item-left name="arrow-dropdown" *ngIf="isLevel1Shown(\'idx\'+i)"></ion-icon>\n                    <h2 text-wrap>{{ module.category }}</h2>\n                </ion-item>\n                <div *ngIf="module.content && isLevel1Shown(\'idx\'+i)">\n                    <div *ngFor="let child of module.content; let j = index">\n\n                        <div *ngIf="child.content">\n                            <!-- Es gibt eventuell Unterkategorien -->\n\n                            <div *ngIf="child.category">\n                                <!-- Es gibt Unterkategorien -->\n                                <ion-item no-lines class="groupLevel2" tappable (click)="toggleLevel2(\'idx\'+i+\'idx\'+j)" [ngClass]="{active: isLevel2Shown(\'idx\'+i+\'idx\'+j)}">\n                                    <ion-icon item-left name="arrow-dropright" *ngIf="!isLevel2Shown(\'idx\'+i+\'idx\'+j)"></ion-icon>\n                                    <ion-icon item-left name="arrow-dropdown" *ngIf="isLevel2Shown(\'idx\'+i+\'idx\'+j)"></ion-icon>\n                                    <h3 text-wrap>{{ child.category }}</h3>\n                                </ion-item>\n                                <div *ngIf="isLevel2Shown(\'idx\'+i+\'idx\'+j)">\n                                    <ion-item class="childitem" no-lines *ngFor="let item of child.content">\n                                        <contact\n                                        [name]="item.name"\n                                        [location]="item.location"\n                                        [tel]="item.tel"\n                                        [mail]="item.mail"\n                                        [consultation]="item.consultation"\n                                        [consultation_url]="item.consultation_url"></contact>\n                                    </ion-item>\n                                </div>\n                            </div>\n\n                            <div *ngIf="!child.category">\n                                <!-- Es sind Unterkategorien angelegt, aber ohne Namen -->\n                                <ion-item no-lines *ngFor="let item of child.content">\n                                    <contact\n                                    [name]="item.name"\n                                    [location]="item.location"\n                                    [tel]="item.tel"\n                                    [mail]="item.mail"\n                                    [consultation]="item.consultation"\n                                    [consultation_url]="item.consultation_url"></contact>\n                                </ion-item>\n                            </div>\n                        </div>\n\n                        <div *ngIf="!child.content">\n                            <!-- Es gibt keine Unterkategorien -->\n                            <ion-item no-lines>\n                                <contact\n                                [name]="child.name"\n                                [location]="child.location"\n                                [tel]="child.tel"\n                                [mail]="child.mail"\n                                [consultation]="child.consultation"\n                                [consultation_url]="child.consultation_url"></contact>\n                            </ion-item>\n                        </div>\n\n                    </div>\n                </div>\n            </div>\n        </ion-list>\n    </div>\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/contacts/contacts.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], ContactsPage);
    return ContactsPage;
}());

//# sourceMappingURL=contacts.js.map

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisagreeTosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DisagreeTosPage = (function () {
    function DisagreeTosPage(navCtrl, navParams, menu, translate, storage, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menu = menu;
        this.translate = translate;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        // disable side menu so user can't access pages if ToS aren't accepted
        this.menu.enable(false, "sideMenu");
    }
    DisagreeTosPage.prototype.tryTOSagain = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: this.translate.instant('statusMessage.tos.title'),
            message: this.translate.instant('statusMessage.tos.message'),
            buttons: [
                {
                    text: this.translate.instant('buttonLabel.disagree'),
                    role: 'disagree',
                    handler: function () {
                        _this.storage.set("ToS", "disagree");
                    }
                },
                {
                    text: this.translate.instant('buttonLabel.agree'),
                    role: 'agree',
                    handler: function () {
                        _this.storage.set("ToS", "agree");
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_1__select_module_select_module__["a" /* SelectModulePage */]);
                    }
                }
            ],
            enableBackdropDismiss: false,
        });
        alert.present();
    };
    DisagreeTosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'page-disagree-tos',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/disagree-tos/disagree-tos.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.disagreeTOSPage" | translate}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-row>\n    <ion-col>\n      <ion-card>\n        <ion-card-content class="reminder">\n          {{ "label.disagreeTOSPage.infoMessage" | translate }}\n        </ion-card-content>\n      </ion-card>\n    </ion-col>\n  </ion-row>\n  <div align="center">\n    <button ion-button (click)="tryTOSagain()">\n      {{ "buttonLabel.tryAgain" | translate }}\n    </button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/disagree-tos/disagree-tos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["MenuController"], __WEBPACK_IMPORTED_MODULE_0__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["AlertController"]])
    ], DisagreeTosPage);
    return DisagreeTosPage;
}());

//# sourceMappingURL=disagree-tos.js.map

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(8);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PopoverPage = (function () {
    function PopoverPage(viewCtrl, navParams, appCtrl) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.appCtrl = appCtrl;
        this.moduleConfigList = [];
        this.moduleSemester = [];
        this.moduleConfigList = navParams.data;
        var i;
        this.moduleSemester = [];
        for (i = 0; i < this.moduleConfigList.length; i++) {
            var semesterFound = false;
            var editedTerm = this.moduleConfigList[i].courseID.slice(4, 6).concat('/').concat(this.moduleConfigList[i].courseID.slice(6, 8));
            var j;
            for (j = 0; j < this.moduleSemester.length; j++) {
                if (this.moduleSemester[j] == editedTerm) {
                    semesterFound = true;
                }
            }
            if (!semesterFound) {
                this.moduleSemester.push(editedTerm);
            }
        }
    }
    PopoverPage.prototype.close = function (searchTerm) {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNavs()[0].setRoot(__WEBPACK_IMPORTED_MODULE_0__select_module_select_module__["a" /* SelectModulePage */], { searchTerm: searchTerm });
    };
    PopoverPage.prototype.clear = function () {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNavs()[0].setRoot(__WEBPACK_IMPORTED_MODULE_0__select_module_select_module__["a" /* SelectModulePage */]);
    };
    PopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'page-popover',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/popover/popover.html"*/'<ion-list>\n  <ion-list-header>\n    <h2>{{ "buttonLabel.filter" | translate }}\n      <button class="clearBtn" ion-button clear icon-only (click)="clear()">\n        <ion-icon name="close"></ion-icon>\n      </button>\n    </h2>\n  </ion-list-header>\n  <button class="listBtn" ion-item *ngFor="let module of moduleSemester" (click)="close(module)">\n    <div text-wrap>Semester {{ module }}</div>\n  </button>\n</ion-list>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/popover/popover.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["ViewController"], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["App"]])
    ], PopoverPage);
    return PopoverPage;
}());

//# sourceMappingURL=popover.js.map

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_login_provider_interfaces__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_login_provider_login__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__impressum_impressum__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__settings_settings__ = __webpack_require__(51);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};











/**
 * LoginPage
 *
 * contains form for login and login logic
 */
var LoginPage = (function () {
    function LoginPage(navCtrl, loadingCtrl, alertCtrl, storage, connection, translate, upLogin, menu) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.connection = connection;
        this.translate = translate;
        this.upLogin = upLogin;
        this.menu = menu;
        this.configStorageKey = "config";
        this.menu.enable(false, "sideMenu");
        this.resetCredentials();
    }
    /**
     * resetCredentials
     *
     * resets the credentials model
     */
    LoginPage.prototype.resetCredentials = function () {
        this.loginCredentials = { username: '', password: '' };
    };
    /**
     * login
     *
     * performs login when submit button has been pressed
     */
    LoginPage.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var online, config, method, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.checkOnlinePromise()];
                    case 1:
                        online = _a.sent();
                        return [4 /*yield*/, this.storage.get(this.configStorageKey)];
                    case 2:
                        config = _a.sent();
                        method = config.authorization.method;
                        session = null;
                        if (online) {
                            this.showLoading();
                            switch (method) {
                                case "credentials": {
                                    session = this.upLogin.credentialsLogin(this.loginCredentials, config.authorization.credentials);
                                    break;
                                }
                                case "sso": {
                                    session = this.upLogin.ssoLogin(this.loginCredentials, config.authorization.sso);
                                    break;
                                }
                            }
                            if (session) {
                                // now handle the Observable which hopefully contains a session
                                session.subscribe(function (session) {
                                    // console.log("[LoginPage]: Login successfully executed. Token:", session.token);
                                    _this.storage.set("session", session);
                                    _this.endLoading();
                                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */], { fromSideMenu: true });
                                }, function (error) {
                                    console.log(error);
                                    _this.endLoading();
                                    if (error.reason == __WEBPACK_IMPORTED_MODULE_7__providers_login_provider_interfaces__["a" /* ELoginErrors */].AUTHENTICATION) {
                                        _this.showAlert("statusMessage.error.loginCredentials");
                                    }
                                    else {
                                        _this.showAlert("statusMessage.error.unknown");
                                    }
                                });
                            }
                            else {
                                this.showAlert("statusMessage.error.unknown");
                                console.log("[LoginPage]: Somehow no session has been passed by login-provider");
                            }
                        }
                        else {
                            // there is no network connection
                            this.endLoading();
                            this.showAlert("statusMessage.error.network");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * abort
     *
     * cancels login process and send user back to module selection
     */
    LoginPage.prototype.abort = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__select_module_select_module__["a" /* SelectModulePage */]);
    };
    /**
     * showLoading
     *
     * shows a loading animation
     */
    LoginPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: this.translate.instant("statusMessage.login.running"),
            dismissOnPageChange: true,
            spinner: "crescent"
        });
        this.loading.present();
    };
    /**
     * endLoading
     *
     * ends the loading animation
     */
    LoginPage.prototype.endLoading = function () {
        this.loading.dismiss();
    };
    /**
     * showAlert
     *
     * shows an alert fitting the passed state
     */
    LoginPage.prototype.showAlert = function (alertTextKey) {
        var alert = this.alertCtrl.create({
            title: this.translate.instant("statusMessage.error.title"),
            subTitle: this.translate.instant(alertTextKey),
            buttons: [
                this.translate.instant("buttonLabel.ok")
            ]
        });
        alert.present();
    };
    LoginPage.prototype.openImpressum = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__impressum_impressum__["a" /* ImpressumPage */]);
    };
    LoginPage.prototype.openSettings = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__settings_settings__["a" /* SettingsPage */], { hideTabBar: true });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/login/login.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.loginPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div>\n    <form (ngSubmit)="login()" #registerForm="ngForm">\n      <!-- input fields -->\n      <ion-row>\n        <ion-col>\n          <ion-list inset>\n\n            <ion-item>\n              <ion-label stacked>{{ "label.loginPage.username" | translate }}</ion-label>\n              <ion-input\n                autocapitalize="none"\n                type="text"\n                [placeholder]="\'label.loginPage.username\' | translate"\n                name="id"\n                [(ngModel)]="loginCredentials.username"\n                required\n              ></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-label stacked>{{ "label.loginPage.password" | translate }}</ion-label>\n              <ion-input\n                type="password"\n                [placeholder]="\'label.loginPage.password\' | translate"\n                name="password"\n                [(ngModel)]="loginCredentials.password"\n                required\n              ></ion-input>\n            </ion-item>\n\n          </ion-list>\n        </ion-col>\n      </ion-row>\n\n      <!-- buttons -->\n      <ion-row padding-horizontal>\n          <button ion-button class="loginButtons" type="submit">\n            {{ "buttonLabel.login" | translate }}\n          </button>\n          <button ion-button class="loginButtons" type="reset" (click)="abort()">\n            {{ "buttonLabel.cancel" | translate }}\n          </button>\n      </ion-row>\n\n    </form>\n  </div>\n\n  <ion-row>\n    <ion-col>\n      <ion-card>\n        <ion-card-content class="reminder">\n          {{ "label.loginPage.loginInfoMessage" | translate }}\n          {{ "label.loginPage.loginInfoMessageMail" | translate }}\n        </ion-card-content>\n      </ion-card>\n    </ion-col>\n</ion-row>\n</ion-content>\n\n<ion-footer>\n  <ion-toolbar>\n    <ion-segment>\n      <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openImpressum()">\n        <ion-icon name="book"></ion-icon>\n        {{ "pageHeader.impressumPage" | translate }}\n      </button>\n      <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openSettings()">\n        <ion-icon name="settings"></ion-icon>\n        {{ "pageHeader.settingsPage" | translate }}\n      </button>\n    </ion-segment>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["LoadingController"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_5__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_8__providers_login_provider_login__["a" /* UPLoginProvider */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["MenuController"]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeedbackPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_interfaces__ = __webpack_require__(130);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var FeedbackPage = (function () {
    function FeedbackPage(navCtrl, navParams, storage, http, connection, alertCtrl, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.http = http;
        this.connection = connection;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        // used for template switching
        this.submitted = false;
    }
    /**
     * asyncSendFeedback
     *
     * sends feedbackText to webservice if text is not empty
     */
    FeedbackPage.prototype.asyncSendFeedback = function (feedbackText) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var config_1, session, httpHeaders_1, httpParams_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!feedbackText) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.storage.get("config")];
                    case 1:
                        config_1 = _a.sent();
                        return [4 /*yield*/, this.storage.get("session")];
                    case 2:
                        session = _a.sent();
                        httpHeaders_1 = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpHeaders */]()
                            .append("Authorization", config_1.authorization.credentials.accessToken);
                        httpParams_1 = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["d" /* HttpParams */]({ encoder: new __WEBPACK_IMPORTED_MODULE_6__lib_interfaces__["b" /* WebHttpUrlEncodingCodec */] })
                            .append("wstoken", session.token)
                            .append("wsfunction", "local_reflect_post_feedback")
                            .append("moodlewsrestformat", config_1.authorization.credentials.moodlewsrestformat)
                            .append("feedback", feedbackText)
                            .append("courseID", config_1.courseID);
                        this.connection.checkOnline().subscribe(function (online) {
                            if (online) {
                                // need to use proxy defined in ionic.config.json
                                var feedback_url = config_1.moodleServiceEndpoint;
                                _this.http.get(feedback_url, {
                                    params: httpParams_1,
                                    headers: httpHeaders_1
                                }).subscribe(function (response) {
                                    if (response.result) {
                                        // success, set submitted to true to switch templates
                                        _this.submitted = true;
                                        console.log("feedback submitted");
                                    }
                                    else {
                                        // probably authentication error
                                        _this.showAlert("statusMessage.error.unknown");
                                        // user does not need to see the message
                                        console.log(response);
                                    }
                                }, function (error) {
                                    // httpError
                                    _this.showAlert("statusMessage.error.http" + error.status);
                                    console.log(error);
                                });
                            }
                            else {
                                // no internet connection
                                _this.showAlert("statusMessage.error.network");
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        // no input
                        this.showAlert("statusMessage.login.noInput");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * goHome
     *
     * sends the user to the HomePage (defaults to HomePage), back to where he belongs
     */
    FeedbackPage.prototype.goHome = function () {
        this.navCtrl.popToRoot();
    };
    /**
     * showAlert
     *
     * shows alert with given text and translates the text
     *
     * => this method appears in multiple pages, should be outsourced and
     *    generalized!
     */
    FeedbackPage.prototype.showAlert = function (alertTextKey) {
        var alert = this.alertCtrl.create({
            title: this.translate.instant("statusMessage.error.title"),
            subTitle: this.translate.instant(alertTextKey),
            buttons: [
                this.translate.instant("buttonLabel.ok")
            ]
        });
        alert.present();
    };
    FeedbackPage.prototype.resize = function () {
        var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
        element.style.overflow = 'hidden';
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
        this.myInput['_elementRef'].nativeElement.style.height = (element.scrollHeight + 16) + 'px';
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myInput'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], FeedbackPage.prototype, "myInput", void 0);
    FeedbackPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-feedback',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/feedback/feedback.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.headerFeedback" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <div *ngIf="submitted; then submittedTemplate; else notSubmittedTemplate">\n  </div>\n\n  <!-- displayed after feedback has been submitted -->\n  <ng-template #submittedTemplate>\n      <ion-row>\n        <ion-col>\n          <ion-card>\n            <ion-card-content class="reminder">\n              {{ "label.feedbackPage.feedbackSend" | translate }}\n            </ion-card-content>\n          </ion-card>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col>\n          <button ion-button full (click)="goHome()">\n            {{ "buttonLabel.finish" | translate }}\n          </button>\n        </ion-col>\n      </ion-row>\n  </ng-template>\n\n  <!-- displayed when no feedback has been submitted -->\n  <ng-template #notSubmittedTemplate>\n    <form (ngSubmit)="asyncSendFeedback(feedbackText)" #registerForm="ngForm">\n      <ion-row>\n        <ion-col>\n          <ion-card>\n            <ion-card-content class="reminder">\n                {{ "label.feedbackPage.infoMessage_1" | translate }}\n                <br>\n                <br>\n                {{ "label.feedbackPage.infoMessage_2" | translate }}\n            </ion-card-content>\n          </ion-card>\n        </ion-col>\n      </ion-row>\n\n      <ion-row padding-right>\n        <ion-col>\n          <ion-item>\n            <ion-textarea #myInput id="myInput" (ionChange)="resize()"\n              type="text"\n              [placeholder]="\'label.feedbackPage.textPlaceholder\' | translate"\n              name="feedbackText"\n              [(ngModel)]="feedbackText"\n              required\n            >\n            </ion-textarea>\n          </ion-item>\n        </ion-col>\n      </ion-row>\n\n      <ion-row padding horizontal>\n        <ion-col>\n          <button ion-button icon-start class="submit-btn" full type="submit">\n            <ion-icon name="checkmark" ></ion-icon>\n            {{ "buttonLabel.submit" | translate }}\n          </button>\n        </ion-col>\n      </ion-row>\n    </form>\n  </ng-template>\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/feedback/feedback.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_4__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], FeedbackPage);
    return FeedbackPage;
}());

//# sourceMappingURL=feedback.js.map

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return WebHttpUrlEncodingCodec; });
/* harmony export (immutable) */ __webpack_exports__["a"] = HttpLoaderFactory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngx_translate_http_loader__ = __webpack_require__(448);

var WebHttpUrlEncodingCodec = (function () {
    function WebHttpUrlEncodingCodec() {
    }
    WebHttpUrlEncodingCodec.prototype.encodeKey = function (k) { return encodeURIComponent(k); };
    WebHttpUrlEncodingCodec.prototype.encodeValue = function (v) { return encodeURIComponent(v); };
    WebHttpUrlEncodingCodec.prototype.decodeKey = function (k) { return decodeURIComponent(k); };
    WebHttpUrlEncodingCodec.prototype.decodeValue = function (v) { return decodeURIComponent(v); };
    return WebHttpUrlEncodingCodec;
}());

function HttpLoaderFactory(http) {
    return new __WEBPACK_IMPORTED_MODULE_0__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, "./assets/i18n/", ".json");
}
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(8);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InfoPage = (function () {
    function InfoPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.showTOS = false;
    }
    InfoPage.prototype.toggleTOS = function () {
        this.showTOS = !this.showTOS;
    };
    InfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-info',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/info/info.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.infoPage" | translate }}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-card> \n    <ion-card-content class="reminder">\n      {{ "label.infoPage.infoMessage_1" | translate }}\n      {{ "label.infoPage.infoMessage_2" | translate }}\n    </ion-card-content>\n  </ion-card>\n  <ion-card tappable (click)="toggleTOS()">\n    <ion-item text-wrap>\n      <ion-icon *ngIf="!showTOS" item-left name="arrow-dropright"></ion-icon>\n      <ion-icon *ngIf="showTOS" item-left name="arrow-dropdown"></ion-icon>\n      {{ "statusMessage.tos.title" | translate }}\n    </ion-item>\n    <ion-card-content *ngIf="showTOS" class="reminder">\n      {{ "statusMessage.tos.message" | translate }}\n    </ion-card-content>\n  </ion-card>\n</ion-content>'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/info/info.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], InfoPage);
    return InfoPage;
}());

//# sourceMappingURL=info.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_push_provider_push_provider__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * LogoutPage
 *
 * contains form for Logout and logout logic
 */
var LogoutPage = (function () {
    function LogoutPage(navCtrl, navParams, storage, pushProv, platform) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.pushProv = pushProv;
        this.platform = platform;
    }
    /**
     * performLogout
     *
     * unsets current session, thus logging the user out
     */
    LogoutPage.prototype.performLogout = function () {
        var _this = this;
        this.storage.set("session", null);
        this.storage.set("config", null);
        this.storage.set("pushRegistered", "no");
        if (this.platform.is("ios") || this.platform.is("android")) {
            // use actual courseID in the future
            this.storage.get("config").then(function (config) {
                if (config) {
                    _this.pushProv.unsubscribeToPush(config);
                }
            });
        }
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_1__select_module_select_module__["a" /* SelectModulePage */]);
    };
    /**
     * goHome
     *
     * sends the user to HomePage (defaults to HomePage)
     */
    LogoutPage.prototype.goHome = function () {
        this.navCtrl.popToRoot();
    };
    LogoutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'page-logout',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/logout/logout.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.logoutPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div align="center">\n    <ion-row>\n      <ion-col>\n        <ion-card>\n          <ion-card-content class="reminder">\n            {{ "label.logoutPage.questionLogout" | translate }}\n          </ion-card-content>\n        </ion-card>\n      </ion-col>\n    </ion-row>\n    <button id="logoutButtons" ion-button (click)="performLogout()">\n      {{ "buttonLabel.yes" | translate }}\n    </button>\n    <button id="logoutButtons" ion-button (click)="goHome()">\n      {{ "buttonLabel.no" | translate }}\n    </button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/logout/logout.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_0__providers_push_provider_push_provider__["a" /* PushProvider */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Platform"]])
    ], LogoutPage);
    return LogoutPage;
}());

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppointmentsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_event_provider_event_provider__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_push__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var AppointmentsPage = (function () {
    function AppointmentsPage(appointm, translate, alertCtrl, storage, connection, push, platform) {
        this.appointm = appointm;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.connection = connection;
        this.push = push;
        this.platform = platform;
        this.optionsRange = {
            pickMode: 'range',
            monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
        };
        this.optionsBasic = {
            monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
        };
        this.tmpEventList = []; // backup list
        this.eventList = []; // where all the event object are stored
        this.hiddenEvent = []; // whether event with event.id is hidden (hiddenEvent[event.id] == true)
        this.scheduledEvent = []; // whether event with event.id has scheduled notification (scheduledEvent[event.id] == true)
        this.eventToday = [];
        this.eventTomorrow = [];
        this.eventThisWeek = [];
        this.eventLater = [];
        this.showBasicCalendar = false;
        this.showRangeCalendar = false;
        this.showAll = true;
        this.rangeCalendarMode = false;
        this.basicCalendarMode = false;
        this.isEventToday = false;
        this.isEventTomorrow = false;
        this.isEventThisWeek = false;
        this.isEventLater = false;
        this.showEventToday = true;
        this.showEventTomorrow = true;
        this.showEventThisWeek = true;
        this.showEventLater = true;
        if (this.translate.currentLang == 'en') {
            this.optionsRange.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            this.optionsBasic.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        }
    }
    AppointmentsPage.prototype.ngOnInit = function () {
        var _this = this;
        if (this.platform.is("cordova")) {
            this.push.hasPermission().then(function (res) {
                if (res.isEnabled) {
                    _this.isPushAllowed = true;
                }
                else {
                    _this.isPushAllowed = false;
                }
            });
        }
        this.initEvents();
    };
    AppointmentsPage.prototype.initEvents = function () {
        var _this = this;
        this.connection.checkOnline().subscribe(function (online) {
            if (online) {
                _this.isLoaded = false;
                _this.appointm.loadParams();
                _this.appointm.readyObservable.subscribe(function (ready) {
                    if (ready) {
                        _this.appointm.getAppointments().subscribe(function (appointConf) {
                            if (appointConf.events) {
                                _this.storage.get("hiddenCards").then(function (array) {
                                    if (array) {
                                        var _loop_1 = function (event_1) {
                                            if (event_1.modulename != "feedback") {
                                                foundID = array.find(function (element) { return element == event_1.id.toString(); });
                                                if (foundID != undefined) {
                                                    _this.hiddenEvent[event_1.id] = true;
                                                }
                                                else {
                                                    _this.hiddenEvent[event_1.id] = false;
                                                }
                                                _this.eventList.push(event_1);
                                            }
                                        };
                                        var foundID;
                                        for (var _i = 0, _a = appointConf.events; _i < _a.length; _i++) {
                                            var event_1 = _a[_i];
                                            _loop_1(event_1);
                                        }
                                    }
                                    else {
                                        for (var _b = 0, _c = appointConf.events; _b < _c.length; _b++) {
                                            var event_2 = _c[_b];
                                            if (event_2.modulename != "feedback") {
                                                _this.hiddenEvent[event_2.id] = false;
                                                _this.eventList.push(event_2);
                                            }
                                        }
                                    }
                                    if (_this.eventList.length < 1) {
                                        _this.noAppointments = true;
                                    }
                                    _this.tmpEventList = _this.eventList;
                                    _this.checkEventDates();
                                });
                                _this.storage.get("scheduledEvents").then(function (array) {
                                    var notificationID;
                                    if (array) {
                                        for (var _i = 0, _a = appointConf.events; _i < _a.length; _i++) {
                                            var event_3 = _a[_i];
                                            if (event_3.modulename != "feedback") {
                                                notificationID = event_3.id * 10;
                                                var foundID = array.find(function (element) { return element == notificationID.toString(); });
                                                if (foundID != undefined) {
                                                    _this.scheduledEvent[event_3.id] = true;
                                                }
                                                else {
                                                    _this.scheduledEvent[event_3.id] = false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        for (var _b = 0, _c = appointConf.events; _b < _c.length; _b++) {
                                            var event_4 = _c[_b];
                                            if (event_4.modulename != "feedback") {
                                                _this.scheduledEvent[event_4.id] = false;
                                            }
                                        }
                                    }
                                    _this.isLoaded = true;
                                });
                            }
                            else {
                                _this.noAppointments = true;
                                _this.isLoaded = true;
                            }
                        });
                    }
                });
            }
            else {
                // there is no network connection
                _this.showAlert("statusMessage.error.network");
            }
        });
    };
    AppointmentsPage.prototype.checkEventDates = function () {
        var currentDate = __WEBPACK_IMPORTED_MODULE_7_moment__();
        var i;
        for (i = 0; i < this.tmpEventList.length; i++) {
            var beginDate = __WEBPACK_IMPORTED_MODULE_7_moment__(this.tmpEventList[i].timestart * 1000);
            var endDate = __WEBPACK_IMPORTED_MODULE_7_moment__((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
            if ((__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSameOrBefore(currentDate, 'day')) && (__WEBPACK_IMPORTED_MODULE_7_moment__(endDate).isSameOrAfter(currentDate, 'day'))) {
                // today
                this.eventToday[this.tmpEventList[i].id] = true;
                this.isEventToday = true;
            }
            else if ((__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSameOrBefore(currentDate.add(1, 'day'), 'day')) && (__WEBPACK_IMPORTED_MODULE_7_moment__(endDate).isSameOrAfter(currentDate.add(1, 'day'), 'day'))) {
                // tomorrow
                this.eventTomorrow[this.tmpEventList[i].id] = true;
                this.isEventTomorrow = true;
            }
            else if ((__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSameOrBefore(currentDate, 'week')) && (__WEBPACK_IMPORTED_MODULE_7_moment__(endDate).isSameOrAfter(currentDate, 'week'))) {
                // this week
                this.eventThisWeek[this.tmpEventList[i].id] = true;
                this.isEventThisWeek = true;
            }
            else {
                // later 
                this.eventLater[this.tmpEventList[i].id] = true;
                this.isEventLater = true;
            }
        }
    };
    AppointmentsPage.prototype.showAlert = function (alertTextKey) {
        var alert = this.alertCtrl.create({
            title: this.translate.instant("statusMessage.error.title"),
            subTitle: this.translate.instant(alertTextKey),
            buttons: [
                this.translate.instant("alertButton.ok")
            ]
        });
        alert.present();
    };
    AppointmentsPage.prototype.pickDate = function ($event) {
        // let delay = setTimeout(() => {
        //   this.showBasicCalendar = false;
        // }, 250);
        // console.log(delay);
        this.noAppointments = false;
        var i;
        this.eventList = [];
        for (i = 0; i < this.tmpEventList.length; i++) {
            var beginDate = __WEBPACK_IMPORTED_MODULE_7_moment__(this.tmpEventList[i].timestart * 1000);
            var endDate = __WEBPACK_IMPORTED_MODULE_7_moment__((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
            if (__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSame($event, 'day') || (__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isBefore($event) && __WEBPACK_IMPORTED_MODULE_7_moment__(endDate).isSameOrAfter($event))) {
                this.eventList.push(this.tmpEventList[i]);
            }
        }
        if (this.eventList.length < 1) {
            this.noAppointments = true;
        }
    };
    AppointmentsPage.prototype.pickRange = function ($event) {
        // let delay = setTimeout(() => {
        //   this.showRangeCalendar = false;
        // }, 250);
        // console.log(delay);
        this.noAppointments = false;
        var i;
        this.eventList = [];
        for (i = 0; i < this.tmpEventList.length; i++) {
            var beginDate = __WEBPACK_IMPORTED_MODULE_7_moment__(this.tmpEventList[i].timestart * 1000);
            var endDate = __WEBPACK_IMPORTED_MODULE_7_moment__((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
            if ((__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSame($event.from, 'day')) || (__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isBefore($event.from) && __WEBPACK_IMPORTED_MODULE_7_moment__(endDate).isSameOrAfter($event.from)) || (__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isAfter($event.from) && (__WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSameOrBefore($event.to) || __WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).isSame($event.to, 'day')))) {
                this.eventList.push(this.tmpEventList[i]);
            }
        }
        if (this.eventList.length < 1) {
            this.noAppointments = true;
        }
    };
    AppointmentsPage.prototype.resetCalendar = function () {
        this.showAll = true;
        this.noAppointments = false;
        this.basicCalendarMode = false;
        this.rangeCalendarMode = false;
        this.showBasicCalendar = false;
        this.showRangeCalendar = false;
        this.date = "";
        this.dateRange = { from: "", to: "" };
        this.eventList = this.tmpEventList;
        if (this.eventList.length < 1) {
            this.noAppointments = true;
        }
    };
    AppointmentsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'page-appointments',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/appointments/appointments.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.appointmentsPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <div align="center">\n    <ion-col>\n      <button ion-button [ngClass]="showAll ? \'activeCalendarButton\' : \'calendarButton\'" (click)="resetCalendar()">{{ "buttonLabel.showAll" | translate}}</button>\n      <button ion-button [ngClass]="basicCalendarMode ? \'activeCalendarButton\' : \'calendarButton\'" (click)="basicCalendarMode = true; rangeCalendarMode = false; showBasicCalendar = !showBasicCalendar; showRangeCalendar = false; showAll = false;">{{ "buttonLabel.pickDate" | translate}}</button>\n      <button ion-button [ngClass]="rangeCalendarMode ? \'activeCalendarButton\' : \'calendarButton\'" (click)="rangeCalendarMode = true; basicCalendarMode = false; showRangeCalendar = !showRangeCalendar; showBasicCalendar = false; showAll = false;">{{ "buttonLabel.pickDateRange" | translate}}</button>\n    </ion-col>\n  </div>\n\n  <ion-calendar *ngIf="showBasicCalendar" [(ngModel)]="date"\n    (onChange)="pickDate($event)"\n    [options]="optionsBasic"\n    [type]="type"\n    [format]="\'YYYY-MM-DD\'">\n  </ion-calendar>\n\n  <ion-calendar *ngIf="showRangeCalendar" [(ngModel)]="dateRange"\n    (onChange)="pickRange($event)"\n    [options]="optionsRange"\n    [type]="type"\n    [format]="\'YYYY-MM-DD\'">\n  </ion-calendar>\n\n  <div align="center" *ngIf="!isLoaded" padding>\n    <ion-spinner></ion-spinner>\n  </div>\n  \n  <div *ngIf="isLoaded && !showAll">\n    <event *ngFor="let ev of eventList; let i = index"\n      [event]="ev"\n      [hiddenEvent]="hiddenEvent[ev.id]" \n      [scheduledEvent]="scheduledEvent[ev.id]"\n      [index]="i"\n      [isPushAllowed]="isPushAllowed" ></event>\n  </div>\n\n  <div *ngIf="isLoaded && showAll">\n    <button no-lines ion-item [disabled]="!isEventToday" (click)="showEventToday = !showEventToday">\n      <div *ngIf="!isEventToday">{{ "label.appointmentsPage.today" | translate }} ({{ "label.appointmentsPage.noAppointmentsAvailable" | translate }})</div>\n      <div *ngIf="isEventToday">{{ "label.appointmentsPage.today" | translate }}</div>\n      <ion-icon *ngIf="showEventToday && isEventToday" item-left name="arrow-dropdown"></ion-icon>\n      <ion-icon *ngIf="!showEventToday || !isEventToday" item-left name="arrow-dropright"></ion-icon>\n    </button>\n    <div *ngFor="let ev of eventList; let i = index">\n      <event *ngIf="eventToday[ev.id] && showEventToday"\n      [event]="ev"\n      [hiddenEvent]="hiddenEvent[ev.id]" \n      [scheduledEvent]="scheduledEvent[ev.id]"\n      [index]="i"\n      [isPushAllowed]="isPushAllowed" ></event>\n    </div>\n    <button no-lines ion-item [disabled]="!isEventTomorrow" (click)="showEventTomorrow = !showEventTomorrow">\n      <div *ngIf="!isEventTomorrow">{{ "label.appointmentsPage.tomorrow" | translate }} ({{ "label.appointmentsPage.noAppointmentsAvailable" | translate }})</div>\n      <div *ngIf="isEventTomorrow">{{ "label.appointmentsPage.tomorrow" | translate }}</div>\n      <ion-icon *ngIf="showEventTomorrow && isEventTomorrow" item-left name="arrow-dropdown"></ion-icon>\n      <ion-icon *ngIf="!showEventTomorrow || !isEventTomorrow" item-left name="arrow-dropright"></ion-icon>\n    </button>\n    <div *ngFor="let ev of eventList; let i = index">\n      <event *ngIf="eventTomorrow[ev.id] && showEventTomorrow"\n      [event]="ev"\n      [hiddenEvent]="hiddenEvent[ev.id]" \n      [scheduledEvent]="scheduledEvent[ev.id]"\n      [index]="i"\n      [isPushAllowed]="isPushAllowed" ></event>\n    </div>\n    <button no-lines ion-item [disabled]="!isEventThisWeek" (click)="showEventThisWeek = !showEventThisWeek">\n      <div *ngIf="!isEventThisWeek">{{ "label.appointmentsPage.thisWeek" | translate }} ({{ "label.appointmentsPage.noAppointmentsAvailable" | translate }})</div>\n      <div *ngIf="isEventThisWeek">{{ "label.appointmentsPage.thisWeek" | translate }}</div>\n      <ion-icon *ngIf="showEventThisWeek && isEventThisWeek" item-left name="arrow-dropdown"></ion-icon>\n      <ion-icon *ngIf="!showEventThisWeek || !isEventThisWeek" item-left name="arrow-dropright"></ion-icon>\n    </button>\n    <div *ngFor="let ev of eventList; let i = index">\n      <event *ngIf="eventThisWeek[ev.id] && showEventThisWeek"\n      [event]="ev"\n      [hiddenEvent]="hiddenEvent[ev.id]" \n      [scheduledEvent]="scheduledEvent[ev.id]"\n      [index]="i"\n      [isPushAllowed]="isPushAllowed" ></event>\n    </div>\n    <button no-lines ion-item [disabled]="!isEventLater" (click)="showEventLater = !showEventLater">\n      <div *ngIf="!isEventLater">{{ "label.appointmentsPage.later" | translate }} ({{ "label.appointmentsPage.noAppointmentsAvailable" | translate }})</div>\n      <div *ngIf="isEventLater">{{ "label.appointmentsPage.later" | translate }}</div>\n      <ion-icon *ngIf="showEventLater && isEventLater" item-left name="arrow-dropdown"></ion-icon>\n      <ion-icon *ngIf="!showEventLater || !isEventLater" item-left name="arrow-dropright"></ion-icon>\n    </button>\n    <div *ngFor="let ev of eventList; let i = index">\n      <event *ngIf="eventLater[ev.id] && showEventLater"\n      [event]="ev"\n      [hiddenEvent]="hiddenEvent[ev.id]" \n      [scheduledEvent]="scheduledEvent[ev.id]"\n      [index]="i"\n      [isPushAllowed]="isPushAllowed" ></event>\n    </div>\n  </div>\n\n  \n  <ion-row *ngIf="noAppointments">\n      <ion-col>\n        <ion-card>\n          <ion-card-content class="reminder">\n           {{ "label.appointmentsPage.noAppointmentsAvailable" | translate }}\n          </ion-card-content>\n        </ion-card>\n      </ion-col>\n  </ion-row>\n\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/appointments/appointments.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__providers_event_provider_event_provider__["a" /* EventProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_1__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_push__["a" /* Push */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Platform"]])
    ], AppointmentsPage);
    return AppointmentsPage;
}());

//# sourceMappingURL=appointments.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questions_questions__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_question_provider_question_provider__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jquery__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_underscore__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_underscore__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var QuestionDetailPage = (function () {
    function QuestionDetailPage(navCtrl, navParams, translate, questionprov) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.translate = translate;
        this.questionprov = questionprov;
        this.answersSubmitted = false;
        this.isFirstQuestion = true;
        this.checkBoxValue = [];
        this.radioBtnValue = [];
        this.textBoxValue = [];
        this.answerSelected = [];
        this.choicesList = [];
        this.isCheckbox = [];
        this.isPageActive = [false];
        this.previousPage = [];
        this.latestPage = 0;
        this.questionNavIndex = 1;
        this.feedbackID = navParams.get('id');
        this.questionList = navParams.get('questions');
        this.feedbackMessage = this.htmlDecode(navParams.get('message'));
        this.isCompleted = navParams.get('isCompleted');
        this.isPageActive[0] = true;
        this.prepareChoices();
        this.initArrays();
        if (this.isCompleted) {
            this.answerList = navParams.get('answers');
            this.prepareCompletedAnswers();
        }
    }
    QuestionDetailPage.prototype.prepareCompletedAnswers = function () {
        var i, j, k;
        for (i = 0; i < this.questionList.length; i++) {
            for (j = 0; j < this.answerList.length; j++) {
                if (this.questionList[i].id == this.answerList[j].item) {
                    if (this.questionList[i].type == "textarea") {
                        // fill in text value
                        this.textBoxValue[i] = this.answerList[j].value;
                    }
                    else if (this.isCheckbox[i] && (this.questionList[i].type == "multichoice")) {
                        // fill checkboxes
                        var answerArray = this.answerList[j].value.split("|");
                        for (k = 0; k < answerArray.length; k++) {
                            this.checkBoxValue[i][Number(answerArray[k]) - 1] = true;
                        }
                    }
                    else if (this.questionList[i].type == "multichoice") {
                        // fill radiobuttons
                        var answer = Number(this.answerList[j].value);
                        this.radioBtnValue[i][answer - 1] = true;
                    }
                }
            }
        }
    };
    QuestionDetailPage.prototype.initArrays = function () {
        var i, j;
        for (i = 0; i < this.choicesList.length; i++) {
            this.checkBoxValue[i] = [];
            this.radioBtnValue[i] = [];
            this.textBoxValue[i] = "";
            this.answerSelected[i] = true;
            if (this.questionList[i].type == "multichoice") {
                for (j = 0; j < this.choicesList[i].length; j++) {
                    if (this.isCheckbox[i]) {
                        this.checkBoxValue[i][j] = false;
                    }
                    else {
                        this.radioBtnValue[i][j] = false;
                    }
                }
            }
        }
        this.previousPage[0] = 0;
        for (i = 1; i < this.questionList.length; i++) {
            this.previousPage[i] = i - 1;
        }
    };
    QuestionDetailPage.prototype.handleRadios = function (i, j, answer) {
        var k;
        if (this.questionList[i].type == "multichoice") {
            for (k = 0; k < this.choicesList[i].length; k++) {
                this.radioBtnValue[i][k] = false;
            }
            this.radioBtnValue[i][j] = true;
        }
        this.openURL(answer);
    };
    QuestionDetailPage.prototype.openURL = function (answer) {
        var urlCheck = new RegExp(/(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi);
        if (urlCheck.test(answer)) {
            urlCheck.lastIndex = 0; // reset RegExp to start from the beginning
            var url = urlCheck.exec(answer)[0];
            if (!/^http[s]?:\/\//.test(url)) {
                var newUrl = "http://" + url;
                window.open(newUrl, '_blank');
            }
            else {
                window.open(url, '_blank');
            }
        }
    };
    QuestionDetailPage.prototype.prepareChoices = function () {
        var i;
        for (i = 0; i < this.questionList.length; i++) {
            if (this.questionList[i].type == "textarea") {
                this.isCheckbox[i] = false;
                this.choicesList[i] = [];
            }
            else if (this.questionList[i].type == "multichoice") {
                var boxType = this.questionList[i].choices.split('>>>>>');
                var choiceArray = boxType[1].split('|');
                if (boxType[0] == "c") {
                    this.isCheckbox[i] = true;
                }
                else {
                    this.isCheckbox[i] = false;
                }
                this.choicesList[i] = choiceArray;
            }
        }
    };
    QuestionDetailPage.prototype.processMoodleContents = function (stringToAnalize, shorterURL) {
        //checking for multi language tags
        stringToAnalize = this.urlify(stringToAnalize, shorterURL);
        var domObj = __WEBPACK_IMPORTED_MODULE_6_jquery__(__WEBPACK_IMPORTED_MODULE_6_jquery__["parseHTML"](stringToAnalize));
        var result = stringToAnalize;
        var language = this.translate.currentLang;
        if (domObj.length > 1) {
            __WEBPACK_IMPORTED_MODULE_7_underscore__["each"](domObj, function (element) {
                if (__WEBPACK_IMPORTED_MODULE_6_jquery__(element)[0].lang == language) {
                    result = __WEBPACK_IMPORTED_MODULE_6_jquery__(element).html();
                }
            });
            // since there are some strings without spanish translation
            // use englisch as a fallback
            if (result == stringToAnalize) {
                __WEBPACK_IMPORTED_MODULE_7_underscore__["each"](domObj, function (element) {
                    if (__WEBPACK_IMPORTED_MODULE_6_jquery__(element)[0].lang == "en") {
                        result = __WEBPACK_IMPORTED_MODULE_6_jquery__(element).html();
                    }
                });
            }
        }
        return result;
    };
    QuestionDetailPage.prototype.goBack = function (i) {
        if (this.questionList[i].dependitem != "0") {
            if (this.questionList[i].type == "textarea") {
                this.textBoxValue[i] = "";
            }
            else if (this.questionList[i].type == "multichoice") {
                var k;
                for (k = 0; k < this.choicesList[i].length; k++) {
                    if (this.isCheckbox[i]) {
                        this.checkBoxValue[i][k] = false;
                    }
                    else {
                        this.radioBtnValue[i][k] = false;
                    }
                }
            }
        }
        if (i > 0) {
            this.questionNavIndex -= 1;
            this.isPageActive[i] = false;
            this.isPageActive[this.previousPage[i]] = true;
            if (this.previousPage[i] == 0) {
                this.isFirstQuestion = true;
            }
        }
    };
    QuestionDetailPage.prototype.goBackLast = function () {
        this.questionNavIndex -= 1;
        this.answersSubmitted = false;
        this.isPageActive[this.latestPage] = true;
    };
    QuestionDetailPage.prototype.goForward = function (i) {
        this.isAnswerSelected(i);
        if (this.answerSelected[i] || this.isCompleted) {
            this.isPageActive[i] = false;
            this.questionNavIndex += 1;
            this.checkDependency(i + 1, i);
        }
    };
    QuestionDetailPage.prototype.checkDependency = function (i, p) {
        var j, k;
        if (i < this.questionList.length) {
            this.isFirstQuestion = false;
            if (this.questionList[i].dependitem == "0") {
                // next question is NOT a conditional question
                this.previousPage[i] = p;
                this.isPageActive[i] = true;
            }
            else {
                // next question is a conditional question
                for (j = 0; j < this.questionList.length; j++) {
                    if (this.questionList[j].id.toString() == this.questionList[i].dependitem) {
                        // next question depends on answer from question j
                        if (this.isCheckbox[j]) {
                            // checkbox
                            for (k = 0; k < this.choicesList[j].length; k++) {
                                if (this.processMoodleContents(this.choicesList[j][k].trim()) == this.processMoodleContents(this.questionList[i].dependvalue)) {
                                    if (this.checkBoxValue[j][k]) {
                                        // condition fullfilled
                                        this.previousPage[i] = p;
                                        this.isPageActive[i] = true;
                                    }
                                    else {
                                        // condition NOT fullfilled
                                        this.checkDependency(i + 1, p);
                                    }
                                }
                            }
                        }
                        else {
                            // radio
                            for (k = 0; k < this.choicesList[j].length; k++) {
                                if (this.processMoodleContents(this.choicesList[j][k].trim()) == this.processMoodleContents(this.questionList[i].dependvalue)) {
                                    if (this.radioBtnValue[j][k]) {
                                        console.log(this.radioBtnValue[j][k]);
                                        // condition fullfilled
                                        this.previousPage[i] = p;
                                        this.isPageActive[i] = true;
                                    }
                                    else {
                                        // condition NOT fullfilled
                                        this.checkDependency(i + 1, p);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            this.latestPage = p;
            for (i = 0; i < this.isPageActive.length; i++) {
                this.isPageActive[i] = false;
            }
            this.answersSubmitted = true;
        }
    };
    QuestionDetailPage.prototype.sendAnswers = function () {
        // Submitten der Antworten im richtigen Format
        var resultArray = [];
        var k, l;
        for (k = 0; k < this.questionList.length; k++) {
            resultArray[k] = [];
            resultArray[k][0] = this.questionList[k].id.toString();
            if (this.questionList[k].type == "textarea") {
                resultArray[k][1] = this.textBoxValue[k];
            }
            else if (this.isCheckbox[k]) {
                var checkBoxString = "";
                for (l = 0; l < this.checkBoxValue[k].length; l++) {
                    if (this.checkBoxValue[k][l]) {
                        if (checkBoxString == "") {
                            checkBoxString = checkBoxString.concat((l + 1));
                        }
                        else {
                            checkBoxString = checkBoxString.concat("|" + (l + 1));
                        }
                    }
                }
                resultArray[k][1] = checkBoxString;
            }
            else {
                var radioString = "";
                for (l = 0; l < this.radioBtnValue[k].length; l++) {
                    if (this.radioBtnValue[k][l]) {
                        radioString = (l + 1).toString();
                    }
                }
                resultArray[k][1] = radioString;
            }
        }
        this.questionprov.sendAnswers(this.feedbackID, resultArray);
    };
    QuestionDetailPage.prototype.isAnswerSelected = function (i) {
        var k;
        if (this.questionList[i].type == "textarea") {
            if (this.textBoxValue[i] == "") {
                this.answerSelected[i] = false;
            }
            else {
                this.answerSelected[i] = true;
            }
        }
        else if (this.isCheckbox[i] && (this.questionList[i].type == "multichoice")) {
            this.answerSelected[i] = false;
            for (k = 0; k < this.choicesList[i].length; k++) {
                if (this.checkBoxValue[i][k]) {
                    this.answerSelected[i] = true;
                }
            }
        }
        else if (this.questionList[i].type == "multichoice") {
            this.answerSelected[i] = false;
            for (k = 0; k < this.choicesList[i].length; k++) {
                if (this.radioBtnValue[i][k]) {
                    this.answerSelected[i] = true;
                }
            }
        }
    };
    QuestionDetailPage.prototype.backToRoot = function () {
        this.sendAnswers();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */], { fromSideMenu: true });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__questions_questions__["a" /* QuestionsPage */]);
    };
    QuestionDetailPage.prototype.htmlDecode = function (value) {
        var tmp = __WEBPACK_IMPORTED_MODULE_6_jquery__("<textarea/>").html(value).text();
        if (!__WEBPACK_IMPORTED_MODULE_6_jquery__(tmp).find('span')[1]) {
            return tmp;
        }
        else {
            var language = this.translate.currentLang;
            if (language == "de") {
                return "<p>" + __WEBPACK_IMPORTED_MODULE_6_jquery__(tmp).find('span').html() + "</p>";
            }
            else {
                return "<p>" + __WEBPACK_IMPORTED_MODULE_6_jquery__(tmp).find('span').eq(1).html() + "</p>";
            }
        }
    };
    // adds http:// to URLs like www.uni.de or uni.de
    QuestionDetailPage.prototype.urlify = function (text, shorterURL) {
        var urlRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
        // shortens the URL to just show the main-domain if shorterURL == true
        if (shorterURL) {
            return text.replace(urlRegex, function (url) {
                var regShortURL = new RegExp(urlRegex);
                regShortURL.lastIndex = 0;
                var tmpUrl = regShortURL.exec(url)[3];
                tmpUrl = "(Website: " + tmpUrl.replace('www.', '') + ")";
                console.log(tmpUrl);
                return tmpUrl;
            });
        }
        else {
            return text.replace(urlRegex, function (url) {
                if (!/^http[s]?:\/\//.test(url)) {
                    url = "http://" + url.replace('www.', '');
                }
                return url;
                // return '<a href="' + url + '">' + url + '</a>';
            });
        }
    };
    QuestionDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Component"])({
            selector: 'page-question-detail',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/question-detail/question-detail.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title *ngIf="answersSubmitted">{{ "pageHeader.headerFinish" | translate }}</ion-title>\n    <ion-title *ngIf="!answersSubmitted">{{ "pageHeader.headerQuestionCount" | translate }} {{ questionNavIndex }}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div *ngFor="let quest of questionList; let i = index">\n\n    <div *ngIf="isPageActive[i]">\n\n      <ion-list-header class="header" no-lines tappable (click)="openURL(processMoodleContents(quest.questionText))" no-padding>\n        <h6 tappable [innerHTML]="processMoodleContents(quest.questionText, true)" text-wrap></h6>\n      </ion-list-header>\n      <p *ngIf="!answerSelected[i] && !isCompleted" style="color:red;">{{ "label.feedbackPage.questionNotAnswered" | translate }}</p>\n      <div *ngIf="quest.type === \'multichoice\'; then multichoice else textarea"></div>\n\n      <ng-template #multichoice>\n        <div>\n          <ion-list radio-group>\n            <ion-item *ngFor="let answers of choicesList[i]; let j = index">\n              <ion-label [innerHTML]="processMoodleContents(answers, true)" text-wrap></ion-label>\n              <ion-checkbox *ngIf="isCheckbox[i]" ngDefaultControl [(ngModel)]="checkBoxValue[i][j]" (click)="openURL(processMoodleContents(answers))" name="checkBoxValue" [disabled]="isCompleted"></ion-checkbox>\n              <ion-radio *ngIf="!isCheckbox[i]" [checked]="radioBtnValue[i][j]" (ionSelect)="handleRadios(i,j, processMoodleContents(answers))" item-left [disabled]="isCompleted"></ion-radio>\n            </ion-item>\n          </ion-list>\n        </div>\n      </ng-template>\n\n      <ng-template #textarea>\n        <ion-list>\n          <textarea id="inputText" placeholder="Text..." rows="8" ngDefaultControl [(ngModel)]="textBoxValue[i]" name="textBoxValue" [disabled]="isCompleted"></textarea>\n        </ion-list>\n      </ng-template>\n\n      <div align="center">\n        <button id="navButtons" (click)="goBack(i)" [disabled]="isFirstQuestion" ion-button color="light">\n          <ion-icon name="arrow-back" padding-right></ion-icon>\n          {{ "buttonLabel.back" | translate }}\n        </button>\n        <button id="navButtons" (click)="goForward(i)" ion-button color="light">\n          <div>{{ "buttonLabel.next" | translate }}</div>\n          <ion-icon name="arrow-forward" padding-left></ion-icon>\n        </button>\n      </div>\n\n    </div>\n\n  </div>\n\n  <div *ngIf="answersSubmitted">\n    <ion-card>\n      <ion-card-content class="reminder">\n      <ion-item text-wrap>\n        <h2>{{ "label.questionsPage.feedbackCompleted" | translate}}</h2>\n      </ion-item>\n      <ion-item *ngIf="feedbackMessage">\n        <div class="description" [innerHTML]="processMoodleContents(feedbackMessage)" text-wrap></div>\n      </ion-item>\n    </ion-card-content>\n    </ion-card>\n    <div align="center">\n      <button id="navButtons" (click)="goBackLast()" ion-button color="light">\n        <ion-icon name="arrow-back" padding-right></ion-icon>\n        {{ "buttonLabel.back" | translate }}\n      </button>\n      <button id="navButtons" (click)="backToRoot()" ion-button [disabled]="isCompleted">\n        <div >{{ "buttonLabel.finish" | translate }}</div>\n      </button>\n    </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/question-detail/question-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_question_provider_question_provider__["a" /* QuestionProvider */]])
    ], QuestionDetailPage);
    return QuestionDetailPage;
}());

//# sourceMappingURL=question-detail.js.map

/***/ }),

/***/ 149:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 149;

/***/ }),

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/appointments/appointments.module": [
		488,
		13
	],
	"../pages/contacts/contacts.module": [
		476,
		12
	],
	"../pages/disagree-tos/disagree-tos.module": [
		477,
		11
	],
	"../pages/feedback/feedback.module": [
		478,
		10
	],
	"../pages/impressum/impressum.module": [
		479,
		9
	],
	"../pages/info/info.module": [
		480,
		8
	],
	"../pages/login/login.module": [
		482,
		7
	],
	"../pages/logout/logout.module": [
		481,
		6
	],
	"../pages/popover/popover.module": [
		483,
		5
	],
	"../pages/push-messages/push-messages.module": [
		484,
		4
	],
	"../pages/question-detail/question-detail.module": [
		489,
		3
	],
	"../pages/questions/questions.module": [
		485,
		2
	],
	"../pages/select-module/select-module.module": [
		486,
		1
	],
	"../pages/settings/settings.module": [
		487,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 191;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectionProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * ConnectionProvider
 *
 * used to check whether a connection to the internet exists before making a
 * http call
 */
var ConnectionProvider = (function () {
    function ConnectionProvider(network, platform) {
        this.network = network;
        this.platform = platform;
    }
    /**
     * checkOnline
     *
     * checks whether the device is connected to the internet. Returns Observable
     * containing either true or false, corresponding to whether an internet
     * connection is available or not
     *
     * @return Observable<boolean>
     */
    ConnectionProvider.prototype.checkOnlinePromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.platform.is("cordova")) {
                switch (_this.network.type) {
                    case "unknown":
                        {
                            // there obviously is 'some' network, so I guess it's okay
                            resolve(true);
                            break;
                        }
                        ;
                    case "none":
                        {
                            // there is no network
                            resolve(false);
                            break;
                        }
                        ;
                    default: {
                        // there is some defined type of network
                        resolve(true);
                        break;
                    }
                }
            }
            else {
                resolve(true);
            }
        });
    };
    /**
     * checkOnline
     *
     * checks whether the device is connected to the internet. Returns Observable
     * containing either true or false, corresponding to whether an internet
     * connection is available or not
     *
     * @return Observable<boolean>
     */
    ConnectionProvider.prototype.checkOnline = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
            if (_this.platform.is("cordova")) {
                switch (_this.network.type) {
                    case "unknown":
                        {
                            // there obviously is 'some' network, so I guess it's okay
                            observer.next(true);
                            break;
                        }
                        ;
                    case "none":
                        {
                            // there is no network
                            observer.next(false);
                            break;
                        }
                        ;
                    default: {
                        // there is some defined type of network
                        observer.next(true);
                        break;
                    }
                }
            }
            else {
                observer.next(true);
            }
        });
    };
    ConnectionProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Platform"]])
    ], ConnectionProvider);
    return ConnectionProvider;
}());

//# sourceMappingURL=connection-provider.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectModulePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings_settings__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__impressum_impressum__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__popover_popover__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__disagree_tos_disagree_tos__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__login_login__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_connection_provider_connection_provider__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
 * SelectModulePage
 *
 * makes the User select a module
 */
var SelectModulePage = (function () {
    function SelectModulePage(navCtrl, navParams, http, connection, storage, alertCtrl, menu, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.connection = connection;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.menu = menu;
        this.popoverCtrl = popoverCtrl;
        this.moduleConfigList = [];
        this.logoPath = "assets/imgs/logos/";
        this.jsonPath = 'assets/json/config.json';
        this.configStorageKey = "config";
        this.config_url = "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";
        this.searchTerm = '';
        this.menu.enable(false, "sideMenu");
    }
    SelectModulePage.prototype.ngOnInit = function () {
        this.getDescriptions();
        this.presentTOS();
    };
    SelectModulePage.prototype.presentTOS = function () {
        var _this = this;
        this.storage.get("ToS").then(function (ToS) {
            if (ToS != "agree") {
                var alert_1 = _this.alertCtrl.create({
                    title: 'Bestimmungen und Informationen zum Datenschutz',
                    message: 'Die Nutzung dieses Services erfolgt freiwillig. Die im Rahmen der Nutzung erhobenen Daten werden ausschließlich zur Bereitstellung des Services verwendet und nicht an Dritte weitergegeben. Die Verwendung der Daten erfolgt nach den Bestimmungen des brandenburgischen Datenschutzgesetzes.\nDiese Smartphone-App ist nur in Verbindung mit einer separaten, abgeschlossenen Kursumgebung der Lehr- und Lernplattform „Moodle“ nutzbar. Die innerhalb dieses Kurses angebotenen Features werden den Nutzern / Nutzerinnen mithilfe eines Web-Services in der App angezeigt und zur Bearbeitung freigegeben bzw. über einen Push-Service mitgeteilt. Sämtliche Datenübertragungen sind SSL (OpenSSL/1.0.1q) verschlüsselt. Jeder Zugriff und jede Bearbeitung von Daten wird ausschließlich innerhalb der Moodle-Kursumgebung ausgeführt. Weder in der App selbst, noch auf dem verwendeten Smartphone werden Daten gespeichert. Eine Anmeldung in der Moodle-Kursumgebung ohne Verwendung der App ist nicht möglich. Die Kursumgebung und die entsprechenden Features werden ausschließlich von den zuständigen Kursbetreuenden und Administratoren gestaltet und bedient.\nMithilfe der auf dem Push-Service-Provider gespeicherten Teilnehmergeräte-IDs können die Kursbetreuer(innen) Mitteilungen an den gesamten Kreis der Nutzer/innen senden. Diese Push-Mitteilungen beinhalten i.d.R. wichtige Ereignisse, Anregungen zur Reflexion und Hinweise.\nDer verwendete Webserver, der Uniqush-Push-Server und die Moodle-Umgebung sind Bestandteile der IT-Systemlandschaft des eLiS-Projekts an der Universität Potsdam. Sie werden gemäß den dort geltenden technischen und rechtlichen Standards sowie gemäß den geltenden Nutzungsbedingungen betrieben.\nDie vorab erhaltenen Informationen zum Forschungsprojekt, sowie die hier beschriebenen Informationen zur Nutzung und zum Datenschutz habe ich gelesen und erkläre mich damit einverstanden.',
                    buttons: [
                        {
                            text: "Ablehnen",
                            role: 'disagree',
                            handler: function () {
                                _this.storage.set("ToS", "disagree");
                                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__disagree_tos_disagree_tos__["a" /* DisagreeTosPage */]);
                            }
                        },
                        {
                            text: "Zustimmen",
                            role: 'agree',
                            handler: function () {
                                _this.storage.set("ToS", "agree");
                            }
                        }
                    ],
                    enableBackdropDismiss: false,
                });
                alert_1.present();
            }
        });
    };
    /**
     * getDescriptions
     *
     * fetches module config descriptions from ModuleProvider
     */
    SelectModulePage.prototype.getDescriptions = function () {
        var _this = this;
        this.connection.checkOnline().subscribe(function (online) {
            if (online) {
                _this.http.get(_this.config_url).subscribe(function (configList) {
                    for (var _i = 0, configList_1 = configList; _i < configList_1.length; _i++) {
                        var config = configList_1[_i];
                        _this.moduleConfigList.push({
                            id: config.id,
                            title: config.title,
                            institution: config.institution,
                            description: config.description,
                            uniLogo: config.uniLogo,
                            courseID: config.courseID
                        });
                    }
                    if (_this.navParams.data.searchTerm) {
                        _this.searchTerm = _this.navParams.data.searchTerm;
                        _this.setFilteredItems();
                    }
                    else {
                        _this.setFilteredItems();
                    }
                });
            }
            else {
                _this.http.get(_this.jsonPath).subscribe(function (localConfigList) {
                    for (var _i = 0, localConfigList_1 = localConfigList; _i < localConfigList_1.length; _i++) {
                        var config = localConfigList_1[_i];
                        _this.moduleConfigList.push({
                            id: config.id,
                            title: config.title,
                            institution: config.institution,
                            description: config.description,
                            uniLogo: config.uniLogo,
                            courseID: config.courseID
                        });
                    }
                    if (_this.navParams.data.searchTerm) {
                        _this.searchTerm = _this.navParams.data.searchTerm;
                        _this.setFilteredItems();
                    }
                    else {
                        _this.setFilteredItems();
                    }
                });
            }
        });
    };
    /**
     * selectConfig
     *
     * selects a chosen module and forwards the user to the LoginPage
     * @param index
     */
    SelectModulePage.prototype.selectConfig = function (index) {
        var _this = this;
        this.connection.checkOnline().subscribe(function (online) {
            if (online) {
                _this.http.get(_this.config_url).subscribe(function (configList) {
                    for (var _i = 0, configList_2 = configList; _i < configList_2.length; _i++) {
                        var config = configList_2[_i];
                        if (config.id == index) {
                            // store found config in storage
                            _this.storage.set(_this.configStorageKey, config);
                            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__login_login__["a" /* LoginPage */]);
                            break;
                        }
                    }
                });
            }
            else {
                _this.http.get(_this.jsonPath).subscribe(function (localConfigList) {
                    for (var _i = 0, localConfigList_2 = localConfigList; _i < localConfigList_2.length; _i++) {
                        var config = localConfigList_2[_i];
                        if (config.id == index) {
                            // store found config in storage
                            _this.storage.set(_this.configStorageKey, config);
                            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__login_login__["a" /* LoginPage */]);
                            break;
                        }
                    }
                });
            }
        });
    };
    SelectModulePage.prototype.setFilteredItems = function () {
        var tmpString = this.searchTerm.replace(/-/g, '');
        this.searchItems = this.filterItems(tmpString);
    };
    SelectModulePage.prototype.filterItems = function (searchTerm) {
        return this.moduleConfigList.filter(function (item) {
            return (item.title.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
                (item.institution.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
                (item.description.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
                (item.courseID.toLowerCase().slice(4, 6).concat('/').concat(item.courseID.slice(6, 8)).indexOf(searchTerm.toLowerCase()) > -1);
        });
    };
    SelectModulePage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_2__popover_popover__["a" /* PopoverPage */], this.moduleConfigList);
        popover.present({
            ev: myEvent
        });
    };
    SelectModulePage.prototype.openImpressum = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__impressum_impressum__["a" /* ImpressumPage */]);
    };
    SelectModulePage.prototype.openSettings = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__settings_settings__["a" /* SettingsPage */], { hideTabBar: true });
    };
    SelectModulePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Component"])({
            selector: 'page-select-module',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/select-module/select-module.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.selectModulePage" | translate }}</ion-title>\n  </ion-navbar>\n  <ion-toolbar>\n    <ion-segment>\n      <ion-searchbar\n      [(ngModel)]="searchTerm"\n      (ionInput)="setFilteredItems()"\n      [debounce]="500"\n      [placeholder]="\'label.selectModulePage.placeholderSearch\' | translate"></ion-searchbar>\n      <button class="filter-modules" ion-button icon-start (click)="presentPopover($event)"><ion-icon name="funnel"></ion-icon>{{ "buttonLabel.filter" | translate }}\n\n\n      </button>\n    </ion-segment>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content text-wrap>\n  <div padding-top padding-left>\n    <em>{{ "label.selectModulePage.selectModuleMessage" | translate }}</em>\n  </div>\n  \n  <ion-card\n    *ngFor="let moduleConfig of searchItems; let i = index"\n    [attr.data-index]="i" tappable (click)="selectConfig(i)">\n    <ion-item>\n      <ion-avatar item-start>\n        <img\n          src="{{logoPath + moduleConfig.uniLogo}}"\n          alt="{{moduleConfig.uniLogo}}" />\n      </ion-avatar>\n      <h2>{{moduleConfig.title}}</h2>\n      <p>{{moduleConfig.institution}}</p>\n    </ion-item>\n    <ion-card-content>\n      <p>{{moduleConfig.description}}</p>\n    </ion-card-content>\n\n  </ion-card>\n</ion-content>\n\n<ion-footer>\n  <ion-toolbar>\n    <ion-segment>\n      <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openImpressum()">\n        <ion-icon name="book"></ion-icon>\n        {{ "pageHeader.impressumPage" | translate }}\n      </button>\n      <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openSettings()">\n        <ion-icon name="settings"></ion-icon>\n        {{ "pageHeader.settingsPage" | translate }}\n      </button>\n    </ion-segment>\n  </ion-toolbar>\n</ion-footer>'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/select-module/select-module.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_9__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["MenuController"],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["PopoverController"]])
    ], SelectModulePage);
    return SelectModulePage;
}());

//# sourceMappingURL=select-module.js.map

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ELoginErrors; });
/** Errors that will be used by LoginProvider */
var ELoginErrors;
(function (ELoginErrors) {
    ELoginErrors[ELoginErrors["AUTHENTICATION"] = 0] = "AUTHENTICATION";
    ELoginErrors[ELoginErrors["TECHNICAL"] = 1] = "TECHNICAL";
    ELoginErrors[ELoginErrors["NETWORK"] = 2] = "NETWORK";
    ELoginErrors[ELoginErrors["UNKNOWN_METHOD"] = 3] = "UNKNOWN_METHOD";
    ELoginErrors[ELoginErrors["UNKNOWN_ERROR"] = 4] = "UNKNOWN_ERROR";
})(ELoginErrors || (ELoginErrors = {}));
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export debug */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UPLoginProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_browser__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib__ = __webpack_require__(447);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* External dependencies */





/* Imports from this module (in same directory) */


// set to true to see output
var debugMode = true;
/**
 * Prints text only if global debug variable has been set
 * @param text
 */
function debug(text) {
    if (debugMode) {
        console.log("[LoginProvider]:" + text);
    }
}
/**
 * LoginProvider
 *
 * only the login(credentials, authConfig) method can be called from the outside.
 * The 'authConfig' parameter should contain a member named 'method' having one
 * of the following values
 *
 *  - "sso" (for executing Single Sign On)
 *  - "oidc" (for executing OpenID connect)
 *  - "credentials" (for executing normal username/password login)
 *
 * the LoginProvider will execute the right method internally and return the
 * created session (or an error).
 */
var UPLoginProvider = (function () {
    function UPLoginProvider(http, inAppBrowser) {
        var _this = this;
        this.http = http;
        this.inAppBrowser = inAppBrowser;
        // events that can occur in InAppBrowser during SSO login
        this.ssoBrowserEvents = {
            loadStart: "loadstart",
            loadStop: "loadstop",
            loadError: "loaderror",
            exit: "exit"
        };
        // predefined actions that will be used
        this.ssoActions = [
            {
                // obtains token from URL
                event: this.ssoBrowserEvents.loadStart,
                condition: function (event, loginRequest) {
                    return Object(__WEBPACK_IMPORTED_MODULE_6__lib__["c" /* isSubset */])(event.url, loginRequest.ssoConfig.ssoUrls.tokenUrl) ||
                        Object(__WEBPACK_IMPORTED_MODULE_6__lib__["c" /* isSubset */])(event.url, ("http://" + loginRequest.ssoConfig.ssoUrls.tokenUrl));
                },
                action: function (event, loginRequest, observer) {
                    if (Object(__WEBPACK_IMPORTED_MODULE_6__lib__["c" /* isSubset */])(event.url, loginRequest.ssoConfig.ssoUrls.tokenUrl) ||
                        Object(__WEBPACK_IMPORTED_MODULE_6__lib__["c" /* isSubset */])(event.url, ("http://" + loginRequest.ssoConfig.ssoUrls.tokenUrl))) {
                        var token = event.url;
                        token = token.replace("http://", "");
                        token = token.replace(loginRequest.ssoConfig.ssoUrls.tokenUrl, "");
                        debug("[ssoLogin] token " + token);
                        try {
                            token = atob(token);
                            // Skip the passport validation, just trust the token
                            token = token.split(":::")[1];
                            debug("[ssoLogin] Moodle token found: " + token);
                            var session = {
                                credentials: loginRequest.credentials,
                                token: token
                            };
                            debug("[ssoLogin] Session created");
                            observer.next(session);
                            observer.complete();
                        }
                        catch (error) {
                            // TODO: check what caused the error
                            observer.error({ reason: __WEBPACK_IMPORTED_MODULE_5__interfaces__["a" /* ELoginErrors */].TECHNICAL, error: error });
                        }
                    }
                }
            },
            {
                // checks whether a login form is present and then injects code for login
                event: this.ssoBrowserEvents.loadStop,
                condition: function (event, loginRequest) {
                    return Object(__WEBPACK_IMPORTED_MODULE_6__lib__["c" /* isSubset */])(event.url, loginRequest.ssoConfig.ssoUrls.idpBaseUrl) &&
                        !loginRequest.loginAttemptStarted;
                },
                action: function (event, loginRequest, subject) { return __awaiter(_this, void 0, void 0, function () {
                    var testForLoginForm, length, enterCredentials;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                debug("[ssoLogin] Testing for login form");
                                testForLoginForm = '$("form#login").length;';
                                return [4 /*yield*/, loginRequest.ssoConfig.browser.executeScript({ code: testForLoginForm })];
                            case 1:
                                length = _a.sent();
                                if (length[0] >= 1) {
                                    debug("[ssoLogin] Login form present");
                                    enterCredentials = "$(\"form#login #username\").val('" + loginRequest.credentials.username + "');\n             $(\"form#login #password\").val('" + loginRequest.credentials.password + "');\n             $(\"form#login .loginbutton\").click();";
                                    loginRequest.loginAttemptStarted = true;
                                    debug("[ssoLogin] Injecting login code now");
                                    loginRequest.ssoConfig.browser.executeScript({ code: enterCredentials });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }
            },
            {
                //
                event: this.ssoBrowserEvents.loadError,
                condition: function (event, loginRequest) { return true; },
                action: function (event, loginRequest, observer) {
                    // TODO: something should be done here, I guess
                }
            },
            {
                // happens when user closes browser
                event: this.ssoBrowserEvents.exit,
                condition: function () { return true; },
                action: function (event, loginRequest, observer) {
                    observer.error({
                        reason: __WEBPACK_IMPORTED_MODULE_5__interfaces__["a" /* ELoginErrors */].TECHNICAL,
                        description: "User closed browser"
                    });
                }
            }
        ];
    }
    ;
    /**
     * Handles ssoBrowserEvents by executing defined actions if event type matches
     * and condition function of action returns true
     *
     * @param {InAppBrowserEvent} event
     * @param {ILoginRequest} loginRequest
     * @param {Observer<ISession>} observer
     */
    UPLoginProvider.prototype.handleSsoEvent = function (event, loginRequest, observer) {
        // test all defined ssoActions
        for (var _i = 0, _a = this.ssoActions; _i < _a.length; _i++) {
            var ssoAction = _a[_i];
            // execute action if event type matches and condition functions returns true
            if (ssoAction.event == event.type && ssoAction.condition(event, loginRequest)) {
                ssoAction.action(event, loginRequest, observer);
            }
        }
    };
    /**
     * Performs a SSO login by creating an InAppBrowser object and attaching
     * listeners to it. When SSO login has been performed the given observer is
     * used to return the created ISession (happens in ssoAction)
     *
     * @param {ILoginRequest} loginRequest
     * @param {Observer<ISession>} observer
     */
    UPLoginProvider.prototype.ssoLogin = function (credentials, loginConfig) {
        var _this = this;
        debug("[ssoLogin] Doing ssoLogin");
        var loginRequest = {
            credentials: credentials,
            ssoConfig: loginConfig,
            loginAttemptStarted: false
        };
        if (!loginRequest.ssoConfig.browser) {
            debug("[ssoLogin] Browser is undefined, will create one");
            // If no browser is given create browser object by loading URL
            loginRequest.ssoConfig.browser = this.inAppBrowser.create(Object(__WEBPACK_IMPORTED_MODULE_6__lib__["b" /* constructPluginUrl */])(loginRequest.ssoConfig.ssoUrls.pluginUrl, loginRequest.ssoConfig.ssoUrls.pluginUrlParams), "_blank", { clearcache: "yes", clearsessioncache: "yes" });
        }
        var rs = new __WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject__["ReplaySubject"]();
        __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].create(function (observer) {
            for (var event_1 in _this.ssoBrowserEvents) {
                loginRequest.ssoConfig.browser.on(_this.ssoBrowserEvents[event_1]).subscribe(function (event) {
                    _this.handleSsoEvent(event, loginRequest, observer);
                });
            }
        }).subscribe(function (session) {
            debug("[ssoLogin] Success, closing browser now");
            loginRequest.ssoConfig.browser.close();
            setTimeout(function () {
                rs.next(session);
            }, 2000);
        }, function (error) {
            debug("[ssoLogin] Failed, closing browser now");
            loginRequest.ssoConfig.browser.close();
            setTimeout(function () {
                rs.error(error);
            }, 2000);
        });
        return rs;
    };
    /**
     * Performs login with provided loginRequest. Returns created session or error
     * with provided observer object.
     *
     * @param {ILoginRequest} loginRequest
     * @param {Observer<ISession>} observer
     */
    UPLoginProvider.prototype.credentialsLogin = function (credentials, loginConfig) {
        debug("[credentialsLogin] Doing credentialsLogin");
        var url = loginConfig.moodleLoginEndpoint;
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", loginConfig.accessToken);
        var params = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["d" /* HttpParams */]({ encoder: new __WEBPACK_IMPORTED_MODULE_6__lib__["a" /* WebHttpUrlEncodingCodec */]() })
            .append("username", credentials.username)
            .append("password", credentials.password)
            .append("service", loginConfig.service)
            .append("moodlewsrestformat", loginConfig.moodlewsrestformat);
        var rs = new __WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject__["ReplaySubject"]();
        this.http.get(url, { headers: headers, params: params }).subscribe(function (response) {
            if (response.token) {
                rs.next({
                    credentials: credentials,
                    token: response.token
                });
                rs.complete();
            }
            else {
                rs.error({ reason: __WEBPACK_IMPORTED_MODULE_5__interfaces__["a" /* ELoginErrors */].AUTHENTICATION });
            }
        }, function (error) {
            // some other error
            rs.error({ reason: __WEBPACK_IMPORTED_MODULE_5__interfaces__["a" /* ELoginErrors */].UNKNOWN_ERROR, error: error });
        });
        return rs;
    };
    /**
     * executes OIDC login
     * @param {ILoginRequest} loginRequest
     * @param {Observer<ISession>} observer
     */
    UPLoginProvider.prototype.oidcLogin = function (credentials, loginConfig) {
        debug("[oidcLogin] Doing oidcLogin");
        var tokenUrl = loginConfig.tokenUrl;
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", loginConfig.accessToken)
            .append("Content-Type", loginConfig.contentType);
        var params = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["d" /* HttpParams */]({ encoder: new __WEBPACK_IMPORTED_MODULE_6__lib__["a" /* WebHttpUrlEncodingCodec */]() })
            .append("grant_type", loginConfig.grantType)
            .append("username", credentials.username)
            .append("password", credentials.password)
            .append("scope", loginConfig.scope);
        var rs = new __WEBPACK_IMPORTED_MODULE_4_rxjs_ReplaySubject__["ReplaySubject"]();
        this.http.post(tokenUrl, params, { headers: headers }).subscribe(function (response) {
            // create session object with access_token as token, but also attach
            // the whole response in case it's needed
            rs.next({
                credentials: credentials,
                token: response.access_token,
                oidcTokenObject: response
            });
            rs.complete();
        }, function (error) {
            // Authentication error
            // TODO: Add typing for errors?
            if (error.status = 401) {
                rs.error({ reason: __WEBPACK_IMPORTED_MODULE_5__interfaces__["a" /* ELoginErrors */].AUTHENTICATION });
            }
        });
        return rs;
    };
    /**
     * Allows adding custom sso actions from outside
     * @param {IAction} ssoAction
     */
    UPLoginProvider.prototype.addSSOaction = function (ssoAction) {
        this.ssoActions.push(ssoAction);
    };
    UPLoginProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], UPLoginProvider);
    return UPLoginProvider;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(371);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(387);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_components_module__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_local_notifications__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_event_provider_event_provider__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_push__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__providers_login_provider_login__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__providers_question_provider_question_provider__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_in_app_browser__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_push_provider_push_provider__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_keyboard__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__lib_interfaces__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ion2_calendar__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ion2_calendar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_ion2_calendar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__app_component__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_home_home__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_settings_settings__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_login_login__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_logout_logout__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_questions_questions__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_appointments_appointments__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_contacts_contacts__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_feedback_feedback__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_impressum_impressum__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_disagree_tos_disagree_tos__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_popover_popover__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_push_messages_push_messages__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_info_info__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_question_detail_question_detail__ = __webpack_require__(134);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















/* ~~~ Pages ~~~ */
















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_21__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_22__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_questions_questions__["a" /* QuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_appointments_appointments__["a" /* AppointmentsPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_contacts_contacts__["a" /* ContactsPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_feedback_feedback__["a" /* FeedbackPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_select_module_select_module__["a" /* SelectModulePage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_question_detail_question_detail__["a" /* QuestionDetailPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_impressum_impressum__["a" /* ImpressumPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_disagree_tos_disagree_tos__["a" /* DisagreeTosPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_popover_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_push_messages_push_messages__["a" /* PushMessagesPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_0__components_components_module__["a" /* ComponentsModule */],
                __WEBPACK_IMPORTED_MODULE_20_ion2_calendar__["CalendarModule"],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["IonicModule"].forRoot(__WEBPACK_IMPORTED_MODULE_21__app_component__["a" /* MyApp */], {
                    backButtonText: ' ',
                }, {
                    links: [
                        { loadChildren: '../pages/contacts/contacts.module#ContactsPageModule', name: 'ContactsPage', segment: 'contacts', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/disagree-tos/disagree-tos.module#DisagreeTosPageModule', name: 'DisagreeTosPage', segment: 'disagree-tos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/feedback/feedback.module#FeedbackPageModule', name: 'FeedbackPage', segment: 'feedback', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/impressum/impressum.module#ImpressumPageModule', name: 'ImpressumPage', segment: 'impressum', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/info/info.module#InfoPageModule', name: 'InfoPage', segment: 'info', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/logout/logout.module#LogoutPageModule', name: 'LogoutPage', segment: 'logout', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/popover/popover.module#PopoverPageModule', name: 'PopoverPage', segment: 'popover', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/push-messages/push-messages.module#PushMessagesPageModule', name: 'PushMessagesPage', segment: 'push-messages', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/questions/questions.module#QuestionsPageModule', name: 'QuestionsPage', segment: 'questions', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/select-module/select-module.module#SelectModulePageModule', name: 'SelectModulePage', segment: 'select-module', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/settings/settings.module#SettingsPageModule', name: 'SettingsPage', segment: 'settings', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/appointments/appointments.module#AppointmentsPageModule', name: 'AppointmentsPage', segment: 'appointments', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/question-detail/question-detail.module#QuestionDetailPageModule', name: 'QuestionDetailPage', segment: 'question-detail', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: (__WEBPACK_IMPORTED_MODULE_19__lib_interfaces__["a" /* HttpLoaderFactory */]),
                        deps: [__WEBPACK_IMPORTED_MODULE_5__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["IonicApp"]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_21__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_22__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_questions_questions__["a" /* QuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_appointments_appointments__["a" /* AppointmentsPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_contacts_contacts__["a" /* ContactsPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_feedback_feedback__["a" /* FeedbackPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_select_module_select_module__["a" /* SelectModulePage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_question_detail_question_detail__["a" /* QuestionDetailPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_impressum_impressum__["a" /* ImpressumPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_disagree_tos_disagree_tos__["a" /* DisagreeTosPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_popover_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_push_messages_push_messages__["a" /* PushMessagesPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_9__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
                { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["IonicErrorHandler"] },
                __WEBPACK_IMPORTED_MODULE_9__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
                __WEBPACK_IMPORTED_MODULE_12__providers_event_provider_event_provider__["a" /* EventProvider */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_14__providers_login_provider_login__["a" /* UPLoginProvider */],
                __WEBPACK_IMPORTED_MODULE_15__providers_question_provider_question_provider__["a" /* QuestionProvider */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_push__["a" /* Push */],
                __WEBPACK_IMPORTED_MODULE_17__providers_push_provider_push_provider__["a" /* PushProvider */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_keyboard__["a" /* Keyboard */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contact_contact__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__event_event__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__question_question__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tab_bar_tab_bar__ = __webpack_require__(470);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__event_event__["a" /* EventComponent */],
                __WEBPACK_IMPORTED_MODULE_3__contact_contact__["a" /* ContactComponent */],
                __WEBPACK_IMPORTED_MODULE_6__question_question__["a" /* QuestionComponent */],
                __WEBPACK_IMPORTED_MODULE_7__tab_bar_tab_bar__["a" /* TabBarComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["IonicModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["b" /* TranslateModule */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_4__event_event__["a" /* EventComponent */],
                __WEBPACK_IMPORTED_MODULE_3__contact_contact__["a" /* ContactComponent */],
                __WEBPACK_IMPORTED_MODULE_6__question_question__["a" /* QuestionComponent */],
                __WEBPACK_IMPORTED_MODULE_7__tab_bar_tab_bar__["a" /* TabBarComponent */]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 436:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 197,
	"./af.js": 197,
	"./ar": 198,
	"./ar-dz": 199,
	"./ar-dz.js": 199,
	"./ar-kw": 200,
	"./ar-kw.js": 200,
	"./ar-ly": 201,
	"./ar-ly.js": 201,
	"./ar-ma": 202,
	"./ar-ma.js": 202,
	"./ar-sa": 203,
	"./ar-sa.js": 203,
	"./ar-tn": 204,
	"./ar-tn.js": 204,
	"./ar.js": 198,
	"./az": 205,
	"./az.js": 205,
	"./be": 206,
	"./be.js": 206,
	"./bg": 207,
	"./bg.js": 207,
	"./bm": 208,
	"./bm.js": 208,
	"./bn": 209,
	"./bn.js": 209,
	"./bo": 210,
	"./bo.js": 210,
	"./br": 211,
	"./br.js": 211,
	"./bs": 212,
	"./bs.js": 212,
	"./ca": 213,
	"./ca.js": 213,
	"./cs": 214,
	"./cs.js": 214,
	"./cv": 215,
	"./cv.js": 215,
	"./cy": 216,
	"./cy.js": 216,
	"./da": 217,
	"./da.js": 217,
	"./de": 218,
	"./de-at": 219,
	"./de-at.js": 219,
	"./de-ch": 220,
	"./de-ch.js": 220,
	"./de.js": 218,
	"./dv": 221,
	"./dv.js": 221,
	"./el": 222,
	"./el.js": 222,
	"./en-au": 223,
	"./en-au.js": 223,
	"./en-ca": 224,
	"./en-ca.js": 224,
	"./en-gb": 225,
	"./en-gb.js": 225,
	"./en-ie": 226,
	"./en-ie.js": 226,
	"./en-il": 227,
	"./en-il.js": 227,
	"./en-nz": 228,
	"./en-nz.js": 228,
	"./eo": 229,
	"./eo.js": 229,
	"./es": 230,
	"./es-do": 231,
	"./es-do.js": 231,
	"./es-us": 232,
	"./es-us.js": 232,
	"./es.js": 230,
	"./et": 233,
	"./et.js": 233,
	"./eu": 234,
	"./eu.js": 234,
	"./fa": 235,
	"./fa.js": 235,
	"./fi": 236,
	"./fi.js": 236,
	"./fo": 237,
	"./fo.js": 237,
	"./fr": 238,
	"./fr-ca": 239,
	"./fr-ca.js": 239,
	"./fr-ch": 240,
	"./fr-ch.js": 240,
	"./fr.js": 238,
	"./fy": 241,
	"./fy.js": 241,
	"./gd": 242,
	"./gd.js": 242,
	"./gl": 243,
	"./gl.js": 243,
	"./gom-latn": 244,
	"./gom-latn.js": 244,
	"./gu": 245,
	"./gu.js": 245,
	"./he": 246,
	"./he.js": 246,
	"./hi": 247,
	"./hi.js": 247,
	"./hr": 248,
	"./hr.js": 248,
	"./hu": 249,
	"./hu.js": 249,
	"./hy-am": 250,
	"./hy-am.js": 250,
	"./id": 251,
	"./id.js": 251,
	"./is": 252,
	"./is.js": 252,
	"./it": 253,
	"./it.js": 253,
	"./ja": 254,
	"./ja.js": 254,
	"./jv": 255,
	"./jv.js": 255,
	"./ka": 256,
	"./ka.js": 256,
	"./kk": 257,
	"./kk.js": 257,
	"./km": 258,
	"./km.js": 258,
	"./kn": 259,
	"./kn.js": 259,
	"./ko": 260,
	"./ko.js": 260,
	"./ky": 261,
	"./ky.js": 261,
	"./lb": 262,
	"./lb.js": 262,
	"./lo": 263,
	"./lo.js": 263,
	"./lt": 264,
	"./lt.js": 264,
	"./lv": 265,
	"./lv.js": 265,
	"./me": 266,
	"./me.js": 266,
	"./mi": 267,
	"./mi.js": 267,
	"./mk": 268,
	"./mk.js": 268,
	"./ml": 269,
	"./ml.js": 269,
	"./mn": 270,
	"./mn.js": 270,
	"./mr": 271,
	"./mr.js": 271,
	"./ms": 272,
	"./ms-my": 273,
	"./ms-my.js": 273,
	"./ms.js": 272,
	"./mt": 274,
	"./mt.js": 274,
	"./my": 275,
	"./my.js": 275,
	"./nb": 276,
	"./nb.js": 276,
	"./ne": 277,
	"./ne.js": 277,
	"./nl": 278,
	"./nl-be": 279,
	"./nl-be.js": 279,
	"./nl.js": 278,
	"./nn": 280,
	"./nn.js": 280,
	"./pa-in": 281,
	"./pa-in.js": 281,
	"./pl": 282,
	"./pl.js": 282,
	"./pt": 283,
	"./pt-br": 284,
	"./pt-br.js": 284,
	"./pt.js": 283,
	"./ro": 285,
	"./ro.js": 285,
	"./ru": 286,
	"./ru.js": 286,
	"./sd": 287,
	"./sd.js": 287,
	"./se": 288,
	"./se.js": 288,
	"./si": 289,
	"./si.js": 289,
	"./sk": 290,
	"./sk.js": 290,
	"./sl": 291,
	"./sl.js": 291,
	"./sq": 292,
	"./sq.js": 292,
	"./sr": 293,
	"./sr-cyrl": 294,
	"./sr-cyrl.js": 294,
	"./sr.js": 293,
	"./ss": 295,
	"./ss.js": 295,
	"./sv": 296,
	"./sv.js": 296,
	"./sw": 297,
	"./sw.js": 297,
	"./ta": 298,
	"./ta.js": 298,
	"./te": 299,
	"./te.js": 299,
	"./tet": 300,
	"./tet.js": 300,
	"./tg": 301,
	"./tg.js": 301,
	"./th": 302,
	"./th.js": 302,
	"./tl-ph": 303,
	"./tl-ph.js": 303,
	"./tlh": 304,
	"./tlh.js": 304,
	"./tr": 305,
	"./tr.js": 305,
	"./tzl": 306,
	"./tzl.js": 306,
	"./tzm": 307,
	"./tzm-latn": 308,
	"./tzm-latn.js": 308,
	"./tzm.js": 307,
	"./ug-cn": 309,
	"./ug-cn.js": 309,
	"./uk": 310,
	"./uk.js": 310,
	"./ur": 311,
	"./ur.js": 311,
	"./uz": 312,
	"./uz-latn": 313,
	"./uz-latn.js": 313,
	"./uz.js": 312,
	"./vi": 314,
	"./vi.js": 314,
	"./x-pseudo": 315,
	"./x-pseudo.js": 315,
	"./yo": 316,
	"./yo.js": 316,
	"./zh-cn": 317,
	"./zh-cn.js": 317,
	"./zh-hk": 318,
	"./zh-hk.js": 318,
	"./zh-tw": 319,
	"./zh-tw.js": 319
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 436;

/***/ }),

/***/ 447:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export cleanCredentials */
/* harmony export (immutable) */ __webpack_exports__["c"] = isSubset;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WebHttpUrlEncodingCodec; });
/* harmony export (immutable) */ __webpack_exports__["b"] = constructPluginUrl;
/**
 * cleans provided username. Puts it to lowercase and removes optional mail suffix.
 * It is expected that credentials given to a LoginProvider have been cleaned by
 * this method.
 * @param {ICredentials} credentials
 * @return {ICredentials} cleaned credentials
 */
function cleanCredentials(credentials) {
    var atChar = "@";
    // only username needs cleaning, actually
    var cleanedUsername = credentials.username.toLowerCase().substring(0, credentials.username.includes(atChar)
        ? credentials.username.lastIndexOf(atChar)
        : credentials.username.length);
    return {
        username: cleanedUsername,
        password: credentials.password
    };
}
/**
 * returns whether 'subset' is a subst of 'string'. Actually just a shorter way
 * for calling '.indexOf(...) != -1'
 * @param {string} string
 * @param {string} subset
 * @returns {boolean}
 */
function isSubset(string, subset) {
    return string.indexOf(subset) != -1;
}
/**
 * A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
 * serialize and parse URL parameter keys and values.
 *
 * see https://github.com/angular/angular/issues/11058
 */
var WebHttpUrlEncodingCodec = (function () {
    function WebHttpUrlEncodingCodec() {
    }
    WebHttpUrlEncodingCodec.prototype.encodeKey = function (k) { return encodeURIComponent(k); };
    WebHttpUrlEncodingCodec.prototype.encodeValue = function (v) { return encodeURIComponent(v); };
    WebHttpUrlEncodingCodec.prototype.decodeKey = function (k) { return decodeURIComponent(k); };
    WebHttpUrlEncodingCodec.prototype.decodeValue = function (v) { return decodeURIComponent(v); };
    return WebHttpUrlEncodingCodec;
}());

/**
 * constructs and returns an URL by adding base and parameters together
 * @param pluginUrlBase
 * @param params
 * @returns {string}
 */
function constructPluginUrl(pluginUrlBase, params) {
    var parameters = [];
    for (var key in params) {
        parameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
    var pluginUrl = "" + pluginUrlBase + (pluginUrlBase.slice(-1) == "?" ? "" : "?") + parameters.join('&');
    console.log("[LoginProvider]: Created pluginUrl: " + pluginUrl);
    return pluginUrl;
}
//# sourceMappingURL=lib.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContactComponent = (function () {
    function ContactComponent() {
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "name", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "location", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "tel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "alt_tel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "mail", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "consultation", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ContactComponent.prototype, "consultation_url", void 0);
    ContactComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'contact',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/components/contact/contact.html"*/'<div text-wrap>\n  <b *ngIf="name">{{ name }}</b><br *ngIf="name">\n  <p *ngIf="location && location.length > 3" text>{{ location }}</p>\n  <p *ngIf="tel">{{"label.contactsPage.phone" | translate }} <a *ngIf="tel" href="tel:{{ tel }}">{{ tel }}</a></p>\n  <p *ngIf="mail">{{"label.contactsPage.email" | translate }} <a *ngIf="mail" href="mailto:{{ mail }}">{{ mail }}</a></p>\n  <p *ngIf="consultation" text>{{"label.contactsPage.consultingTime" | translate }} {{ consultation }}</p>\n  <p *ngIf="consultation_url" text style="display:inline">{{ "label.contactsPage.website" | translate}} </p>\n  <a *ngIf="consultation_url" href="{{ consultation_url }}">{{ "label.university" | translate}}</a>\n</div>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/components/contact/contact.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], ContactComponent);
    return ContactComponent;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_local_notifications__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var EventComponent = (function () {
    function EventComponent(translate, storage, localNotifications, navCtrl, alertCtrl, platform) {
        this.translate = translate;
        this.storage = storage;
        this.localNotifications = localNotifications;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        // Output-Events that can be listened to by the Page
        this.visibilityChanged = new __WEBPACK_IMPORTED_MODULE_2__angular_core__["EventEmitter"]();
        this.notificationStatusChanged = new __WEBPACK_IMPORTED_MODULE_2__angular_core__["EventEmitter"]();
    }
    /**
     * sets flags onInit and launches initEvent()
     */
    EventComponent.prototype.ngOnInit = function () {
        if (this.navCtrl.getActive().name == "HomePage") {
            this.isHomePage = true;
            this.showLongDescription = false;
        }
        else {
            this.isHomePage = false;
            this.showLongDescription = true;
        }
        if (this.platform.is("ios") || this.platform.is("android")) {
            this.isCordovaApp = true;
        }
        else {
            this.isCordovaApp = false;
        }
        if (this.scheduledEvent) {
            this.isNotificationScheduled = true;
        }
        else {
            this.isNotificationScheduled = false;
        }
        if (this.hiddenEvent) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }
        this.initEvent();
    };
    EventComponent.prototype.ngAfterViewInit = function () {
        if (this.isHomePage) {
            this.getDescriptionHeight();
        }
    };
    /**
     * initEvent
     *
     * handles and formats eventStart, eventBegin, eventFullDay, hasAlreadyBegun
     */
    EventComponent.prototype.initEvent = function () {
        var language = this.translate.currentLang;
        __WEBPACK_IMPORTED_MODULE_7_moment__["locale"](language);
        if (this.translate.currentLang == "de") {
            this.eventStart = __WEBPACK_IMPORTED_MODULE_7_moment__(this.event.timestart * 1000).format('DD. MMM, LT');
            this.eventEnd = __WEBPACK_IMPORTED_MODULE_7_moment__((this.event.timestart + this.event.timeduration) * 1000).format('DD. MMM, LT');
        }
        else {
            this.eventStart = __WEBPACK_IMPORTED_MODULE_7_moment__(this.event.timestart * 1000).format('MMM Do, LT');
            this.eventEnd = __WEBPACK_IMPORTED_MODULE_7_moment__((this.event.timestart + this.event.timeduration) * 1000).format('MMM Do, LT');
        }
        if (this.eventStart == this.eventEnd) {
            this.isFullDayEvent = true;
            this.eventFullDay = __WEBPACK_IMPORTED_MODULE_7_moment__(this.event.timestart * 1000).format('L');
        }
        else {
            this.isFullDayEvent = false;
        }
        var currentTime = __WEBPACK_IMPORTED_MODULE_7_moment__();
        if (currentTime.isAfter(__WEBPACK_IMPORTED_MODULE_7_moment__(this.event.timestart * 1000))) {
            this.hasAlreadyBegun = true;
        }
        else {
            this.hasAlreadyBegun = false;
        }
    };
    /**
     * processes multi language tags from moodle and returns
     * string that matches app language
     *
     * @param stringToAnalize - string that could containt multi-language tags
     */
    EventComponent.prototype.processMoodleContents = function (stringToAnalize) {
        var domObj = __WEBPACK_IMPORTED_MODULE_4_jquery__(__WEBPACK_IMPORTED_MODULE_4_jquery__["parseHTML"](stringToAnalize));
        var result = stringToAnalize;
        var language = this.translate.currentLang;
        if (domObj.length > 1) {
            __WEBPACK_IMPORTED_MODULE_5_underscore__["each"](domObj, function (element) {
                if (__WEBPACK_IMPORTED_MODULE_4_jquery__(element)[0].lang == language) {
                    result = __WEBPACK_IMPORTED_MODULE_4_jquery__(element).html();
                }
            });
            // use englisch as a fallback
            if (result == stringToAnalize) {
                __WEBPACK_IMPORTED_MODULE_5_underscore__["each"](domObj, function (element) {
                    if (__WEBPACK_IMPORTED_MODULE_4_jquery__(element)[0].lang == "en") {
                        result = __WEBPACK_IMPORTED_MODULE_4_jquery__(element).html();
                    }
                });
            }
        }
        return result;
    };
    /**
     * changes card visibility and adds / removes
     * card from hiddenCards-array that gets saved to the storage
     */
    EventComponent.prototype.toggleCardVisibility = function () {
        var _this = this;
        this.isVisible = !this.isVisible;
        this.storage.get("hiddenCards").then(function (array) {
            var tmpArray;
            // if card is now hidden, push it's eventID to new hiddenCards-array
            if (!_this.isVisible) {
                if (array && (array.length > 0)) {
                    tmpArray = array;
                    tmpArray.push(_this.event.id.toString());
                }
                else {
                    tmpArray = [];
                    tmpArray.push(_this.event.id.toString());
                }
            }
            else {
                // if card was hidden before, don't push eventID to new hiddenCards-array
                tmpArray = [];
                var i;
                if (array) {
                    for (i = 0; i < array.length; i++) {
                        if (array[i] != _this.event.id.toString()) {
                            tmpArray.push(array[i]);
                        }
                    }
                }
            }
            // save new hiddenCards-array to storage
            _this.storage.set("hiddenCards", tmpArray).then(function (data) {
                if (_this.isHomePage) {
                    _this.visibilityChanged.emit();
                }
            });
        });
    };
    EventComponent.prototype.getCardClass = function () {
        if (this.isVisible) {
            return "visibleCard";
        }
        else {
            return "hiddenCard";
        }
    };
    /**
     * on HomePage: only max 3 lines of description should be visible
     * gets divDescriptions client-height and hides "showMore"-button
     * if description is shorter than 3 lines
     */
    EventComponent.prototype.getDescriptionHeight = function () {
        var element = document.getElementsByClassName('divDescription');
        var height = element[this.index].clientHeight;
        var btnDiv = document.getElementById(this.index.toString());
        if (height < 63) {
            btnDiv.setAttribute("style", "display:none;");
        }
    };
    EventComponent.prototype.getDescriptionClass = function () {
        if (!this.showLongDescription) {
            return "hideLongDescription";
        }
        else {
            return "longDescription";
        }
    };
    EventComponent.prototype.toggleLongDescription = function () {
        this.showLongDescription = !this.showLongDescription;
    };
    EventComponent.prototype.scheduleNotification = function () {
        // unique notification id
        var notificationID = this.event.id * 10;
        if (!this.isNotificationScheduled) {
            var beginDate = __WEBPACK_IMPORTED_MODULE_7_moment__(this.event.timestart * 1000);
            var currentTime = __WEBPACK_IMPORTED_MODULE_7_moment__();
            var hoursToBegin = __WEBPACK_IMPORTED_MODULE_7_moment__["duration"](beginDate.diff(currentTime)).asHours();
            var oneWeekBefore = __WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).subtract(1, "weeks");
            var oneDayBefore = __WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).subtract(1, "days");
            var threeHoursBefore = __WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).subtract(3, "hours");
            var oneHourBefore = __WEBPACK_IMPORTED_MODULE_7_moment__(beginDate).subtract(1, "hours");
            var messageWeek;
            var messageTomorrow;
            var messageHour;
            // constructs notification messages
            this.translate.get("statusMessage.notification.pushMessage_1_0").subscribe(function (value) { messageWeek = value; });
            messageWeek = messageWeek.concat(beginDate.format('ll').toLocaleString());
            this.translate.get("statusMessage.notification.pushMessage_1_1").subscribe(function (value) { messageWeek = messageWeek.concat(value); });
            messageWeek = messageWeek.concat(beginDate.format('LT').toLocaleString());
            this.translate.get("statusMessage.notification.pushMessage_3_2").subscribe(function (value) { messageWeek = messageWeek.concat(value); });
            this.translate.get("statusMessage.notification.pushMessage_2").subscribe(function (value) { messageTomorrow = value; });
            this.translate.get("statusMessage.notification.pushMessage_1_1").subscribe(function (value) { messageTomorrow = messageTomorrow.concat(value); });
            messageTomorrow = messageTomorrow.concat(beginDate.format('LT').toLocaleString());
            this.translate.get("statusMessage.notification.pushMessage_3_2").subscribe(function (value) { messageTomorrow = messageTomorrow.concat(value); });
            this.translate.get("statusMessage.notification.pushMessage_3_0").subscribe(function (value) { messageHour = value; });
            this.translate.get("statusMessage.notification.pushMessage_1_1").subscribe(function (value) { messageHour = messageHour.concat(value); });
            messageHour = messageHour.concat(beginDate.format('LT').toLocaleString());
            this.translate.get("statusMessage.notification.pushMessage_3_1").subscribe(function (value) { messageHour = messageHour.concat(value); });
            if (hoursToBegin > 168) {
                // case 1: more than 7 days => the user gets a notification one week before and the day before
                this.localNotifications.schedule([{
                        id: notificationID,
                        text: messageWeek,
                        title: this.processMoodleContents(this.event.name),
                        trigger: { at: new Date(oneWeekBefore.toDate()) },
                        led: 'FF0000',
                        sound: null
                    }, {
                        id: notificationID + 1,
                        text: messageTomorrow,
                        title: this.processMoodleContents(this.event.name),
                        trigger: { at: new Date(oneDayBefore.toDate()) },
                        led: 'FF0000',
                        sound: null
                    }]);
            }
            else if (hoursToBegin > 24) {
                // case 2: more than 1 day but less than 7 days => the user gets a notification 24 hours before the appointment
                this.localNotifications.schedule({
                    id: notificationID,
                    text: messageTomorrow,
                    title: this.processMoodleContents(this.event.name),
                    trigger: { at: new Date(oneDayBefore.toDate()) },
                    led: 'FF0000',
                    sound: null
                });
            }
            else if (hoursToBegin > 3) {
                // case 3: less than 24 hours but more than 3 hours => the user gets a notification three hours before the appointment
                this.localNotifications.schedule({
                    id: notificationID,
                    text: messageHour,
                    title: this.processMoodleContents(this.event.name),
                    trigger: { at: new Date(threeHoursBefore.toDate()) },
                    led: 'FF0000',
                    sound: null
                });
            }
            else {
                // case 4: less than 3 hours => the user gets a notification one houre before the appointment
                this.localNotifications.schedule({
                    id: notificationID,
                    text: messageHour,
                    title: this.processMoodleContents(this.event.name),
                    trigger: { at: new Date(oneHourBefore.toDate()) },
                    led: 'FF0000',
                    sound: null
                });
            }
            this.isNotificationScheduled = true;
            this.saveScheduledEvent();
            this.isScheduledAlert();
        }
        else {
            this.isCanceledAlert();
        }
    };
    /**
     * adds eventID to scheduledEvent-array that gets saved to storage
     */
    EventComponent.prototype.saveScheduledEvent = function () {
        var _this = this;
        if (this.isPushAllowed) {
            var notificationID = this.event.id * 10;
            this.storage.get("scheduledEvents").then(function (array) {
                var tmpArray;
                if (array && (array.length > 0)) {
                    tmpArray = array;
                    tmpArray.push(notificationID.toString());
                }
                else {
                    tmpArray = [];
                    tmpArray.push(notificationID.toString());
                }
                _this.storage.set("scheduledEvents", tmpArray).then(function (data) {
                    if (_this.isHomePage) {
                        _this.notificationStatusChanged.emit();
                    }
                });
            });
        }
    };
    /**
     * alert for the user
     * confirms that the notification has been scheduled
     */
    EventComponent.prototype.isScheduledAlert = function () {
        if (this.isPushAllowed) {
            var notificationMessage, okMessage;
            this.translate.get("statusMessage.notification.scheduled").subscribe(function (value) { notificationMessage = value; });
            this.translate.get("buttonLabel.ok").subscribe(function (value) { okMessage = value; });
            var alert_1 = this.alertCtrl.create({
                message: notificationMessage,
                buttons: [okMessage]
            });
            alert_1.present();
        }
    };
    EventComponent.prototype.cancelNotifications = function () {
        var _this = this;
        var notificationID = this.event.id * 10;
        this.localNotifications.cancel(notificationID);
        this.localNotifications.cancel(notificationID + 1);
        this.storage.get("scheduledEvents").then(function (array) {
            var tmpArray = [];
            var i;
            if (array) {
                for (i = 0; i < array.length; i++) {
                    if (array[i] != notificationID.toString()) {
                        tmpArray.push(array[i]);
                    }
                }
            }
            _this.storage.set("scheduledEvents", tmpArray).then(function (data) {
                if (_this.isHomePage) {
                    _this.notificationStatusChanged.emit();
                }
            });
        });
        this.isNotificationScheduled = false;
    };
    /**
     * alert for the user
     * confirms that the notification has been cancelled
     */
    EventComponent.prototype.isCanceledAlert = function () {
        var _this = this;
        var notificationMessage, yesMessage, noMessage;
        this.translate.get("statusMessage.notification.cancel").subscribe(function (value) { notificationMessage = value; });
        this.translate.get("buttonLabel.yes").subscribe(function (value) { yesMessage = value; });
        this.translate.get("buttonLabel.no").subscribe(function (value) { noMessage = value; });
        var alert = this.alertCtrl.create({
            message: notificationMessage,
            buttons: [
                {
                    text: noMessage,
                    role: 'cancel'
                },
                {
                    text: yesMessage,
                    role: 'okay',
                    handler: function () {
                        _this.cancelNotifications();
                    }
                }
            ]
        });
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EventComponent.prototype, "event", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], EventComponent.prototype, "index", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EventComponent.prototype, "hiddenEvent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EventComponent.prototype, "scheduledEvent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EventComponent.prototype, "isPushAllowed", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], EventComponent.prototype, "visibilityChanged", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], EventComponent.prototype, "notificationStatusChanged", void 0);
    EventComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'event',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/components/event/event.html"*/'<div [class]="getCardClass()">\n  <ion-card>\n    <ion-card-header text-wrap>\n      <h2><div [innerHTML]="processMoodleContents(event.name)" text-wrap></div></h2>\n      <div class="date">\n        <p *ngIf="!isFullDayEvent" text-wrap>{{ eventStart }} {{ "label.appointmentsPage.time" | translate }} - {{ eventEnd }} {{ "label.appointmentsPage.time" | translate }}</p>\n        <p  *ngIf="isFullDayEvent" text-wrap>{{ eventFullDay }}, {{ "label.appointmentsPage.fullDayEvent" | translate }}</p>\n      </div>  \n    </ion-card-header>\n\n    <ion-card-content>\n      <div [class]="getDescriptionClass()">\n        <div class=\'divDescription\' [innerHTML]="processMoodleContents(event.description)" text-wrap></div>\n      </div>\n      <div *ngIf="isHomePage" [id]="index" align="right">\n        <button *ngIf="!showLongDescription" ion-button clear small (click)="toggleLongDescription()">\n          {{ "buttonLabel.showMore" | translate }}\n        </button>\n        <button *ngIf="showLongDescription" ion-button clear small (click)="toggleLongDescription()">\n          {{ "buttonLabel.showLess" | translate }}\n        </button>\n      </div>\n      <ion-row class="btn-group-appointment">\n        <ion-col *ngIf="isPushAllowed && isCordovaApp && !hasAlreadyBegun">\n          <div class="reminder">\n            <button (click)="scheduleNotification()" ion-button icon-left clear small>\n              <ion-icon name="alarm"></ion-icon>\n              <div *ngIf="!isNotificationScheduled">{{ "buttonLabel.notify" | translate}}</div>\n              <div *ngIf="isNotificationScheduled">{{ "buttonLabel.cancel" | translate }}</div>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col>\n          <div align="right">\n          <button (click)="toggleCardVisibility()" ion-button icon-left clear small>\n            <ng-container *ngIf="isVisible;else hidden">\n              <ion-icon name="eye-off"></ion-icon>\n                <div>{{ "buttonLabel.hide" | translate }}</div>\n            </ng-container>\n            <ng-template #hidden>\n              <ion-icon name="eye"></ion-icon>\n              <div>{{ "buttonLabel.show_2" | translate }}</div>\n            </ng-template>\n          </button>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-card-content>\n  </ion-card>\n</div>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/components/event/event.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_local_notifications__["a" /* LocalNotifications */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["Platform"]])
    ], EventComponent);
    return EventComponent;
}());

//# sourceMappingURL=event.js.map

/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_question_detail_question_detail__ = __webpack_require__(134);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var QuestionComponent = (function () {
    function QuestionComponent(translate, navCtrl) {
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.isCompleted = false;
    }
    QuestionComponent.prototype.ngOnInit = function () {
        if (this.questions.answers != undefined) {
            this.isCompleted = true;
        }
    };
    QuestionComponent.prototype.goToDetailPage = function () {
        if (this.isCompleted) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__pages_question_detail_question_detail__["a" /* QuestionDetailPage */], {
                'id': this.questions.id,
                'questions': this.questions.questions,
                'message': this.questions.feedbackMessage,
                'answers': this.questions.answers,
                'isCompleted': this.isCompleted,
            });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__pages_question_detail_question_detail__["a" /* QuestionDetailPage */], {
                'id': this.questions.id,
                'questions': this.questions.questions,
                'message': this.questions.feedbackMessage,
                'isCompleted': this.isCompleted,
            });
        }
    };
    QuestionComponent.prototype.processMoodleContents = function (stringToAnalize) {
        //checking for multi language tags
        var domObj = __WEBPACK_IMPORTED_MODULE_3_jquery__(__WEBPACK_IMPORTED_MODULE_3_jquery__["parseHTML"](stringToAnalize));
        var result = stringToAnalize;
        var language = this.translate.currentLang;
        if (domObj.length > 1) {
            __WEBPACK_IMPORTED_MODULE_4_underscore__["each"](domObj, function (element) {
                if (__WEBPACK_IMPORTED_MODULE_3_jquery__(element)[0].lang == language) {
                    result = __WEBPACK_IMPORTED_MODULE_3_jquery__(element).html();
                }
            });
            // since there are some strings without spanish translation
            // use englisch as a fallback
            if (result == stringToAnalize) {
                __WEBPACK_IMPORTED_MODULE_4_underscore__["each"](domObj, function (element) {
                    if (__WEBPACK_IMPORTED_MODULE_3_jquery__(element)[0].lang == "en") {
                        result = __WEBPACK_IMPORTED_MODULE_3_jquery__(element).html();
                    }
                });
            }
        }
        return result;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], QuestionComponent.prototype, "questions", void 0);
    QuestionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'question',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/components/question/question.html"*/'<div *ngIf="!isCompleted" padding-horizontal padding-top>\n  <ion-item no-lines class="question" tappable (click)="goToDetailPage()">\n    <ion-icon name="arrow-dropright" item-end></ion-icon>\n    <div [innerHTML]="processMoodleContents(questions.name)" text-wrap></div>\n  </ion-item>\n</div>\n<div *ngIf="isCompleted" padding-horizontal padding-top>\n  <ion-item no-lines class="completedQuestion" tappable (click)="goToDetailPage()">\n    <div [innerHTML]="processMoodleContents(questions.name)" text-wrap></div>\n    <ion-icon name="arrow-dropright" item-end></ion-icon>\n  </ion-item>\n</div>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/components/question/question.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["NavController"]])
    ], QuestionComponent);
    return QuestionComponent;
}());

//# sourceMappingURL=question.js.map

/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_home_home__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pages_info_info__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_impressum_impressum__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TabBarComponent = (function () {
    function TabBarComponent(navCtrl) {
        this.navCtrl = navCtrl;
    }
    TabBarComponent.prototype.openPage = function (pageID) {
        switch (pageID) {
            case 0: {
                if (this.navCtrl.getActive().name != "HomePage") {
                    this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__pages_home_home__["a" /* HomePage */], { fromSideMenu: true });
                }
                break;
            }
            case 1: {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__pages_info_info__["a" /* InfoPage */]);
                break;
            }
            case 2: {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__pages_impressum_impressum__["a" /* ImpressumPage */]);
                break;
            }
        }
    };
    TabBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Component"])({
            selector: 'tab-bar',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/components/tab-bar/tab-bar.html"*/'<ion-toolbar>\n    <ion-segment>\n    <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openPage(0)">\n        <ion-icon name="home"></ion-icon>\n        {{ "pageHeader.homePage_alt" | translate }}\n    </button>\n    <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openPage(1)">\n        <ion-icon name="information-circle"></ion-icon>\n        {{ "pageHeader.infoPage" | translate }}\n    </button>\n    <button class="tabButtons" ion-button color="primary" clear icon-left (click)="openPage(2)">\n        <ion-icon name="book"></ion-icon>\n        {{ "pageHeader.impressumPage" | translate }}\n    </button>\n    </ion-segment>\n</ion-toolbar>'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/components/tab-bar/tab-bar.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["NavController"]])
    ], TabBarComponent);
    return TabBarComponent;
}());

//# sourceMappingURL=tab-bar.js.map

/***/ }),

/***/ 475:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_keyboard__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_push_provider_push_provider__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_home_home__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_contacts_contacts__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_appointments_appointments__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_feedback_feedback__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_questions_questions__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_logout_logout__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_push_messages_push_messages__ = __webpack_require__(72);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};










/* ~~~ Pages ~~~ */









var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, translate, http, connection, storage, pushProv, keyboard) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.translate = translate;
        this.http = http;
        this.connection = connection;
        this.storage = storage;
        this.pushProv = pushProv;
        this.keyboard = keyboard;
        this.initApp();
    }
    /**
     * initApp
     *
     * initializes the app
     */
    MyApp.prototype.initApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initConfig()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initTranslate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.initMenu()];
                    case 3:
                        _a.sent();
                        this.platform.ready().then(function () {
                            if (_this.platform.is("cordova")) {
                                _this.splashScreen.hide();
                                _this.statusBar.styleDefault();
                                _this.keyboard.disableScroll(true);
                                _this.storage.set("hiddenCards", []);
                                _this.storage.set("scheduledEvents", []);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * initConfig
     *
     * fetches config from server if there's an internet connection
     * sets root page accordingly
     */
    MyApp.prototype.initConfig = function () {
        var _this = this;
        var config_url = "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";
        this.storage.get("config").then(function (localConfig) {
            if (localConfig) {
                _this.connection.checkOnline().subscribe(function (online) {
                    if (online) {
                        _this.http.get(config_url).subscribe(function (configList) {
                            for (var _i = 0, configList_1 = configList; _i < configList_1.length; _i++) {
                                var config = configList_1[_i];
                                if (localConfig.id == config.id) {
                                    // store up-to-date config in storage
                                    _this.storage.set("config", config);
                                    _this.initPush(config);
                                    break;
                                }
                            }
                        });
                    }
                    else {
                        _this.initPush(localConfig);
                    }
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */];
                });
            }
            else {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_17__pages_select_module_select_module__["a" /* SelectModulePage */];
            }
        });
    };
    /**
     * initPush
     *
     * registers push service to ensure push notifications work
     * even after app has been closed
     * @param config
     */
    MyApp.prototype.initPush = function (config) {
        if (this.platform.is("ios") || this.platform.is("android")) {
            this.pushProv.registerPushService(config);
        }
    };
    /**
     * initMenu
     *
     * sets up menu entries and icons
     */
    MyApp.prototype.initMenu = function () {
        // only show push-notifications page when on mobile device
        if (this.platform.is("ios") || this.platform.is("android")) {
            this.pagesInMenu = [
                { title: "pageHeader.homePage_alt", pageName: __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */], icon: "home" },
                { title: "pageHeader.appointmentsPage_2", pageName: __WEBPACK_IMPORTED_MODULE_12__pages_appointments_appointments__["a" /* AppointmentsPage */], icon: "alarm" },
                { title: "pageHeader.questionsPage", pageName: __WEBPACK_IMPORTED_MODULE_14__pages_questions_questions__["a" /* QuestionsPage */], icon: "create" },
                { title: "pageHeader.contactsPage", pageName: __WEBPACK_IMPORTED_MODULE_11__pages_contacts_contacts__["a" /* ContactsPage */], icon: "contacts" },
                { title: "pageHeader.feedbackPage", pageName: __WEBPACK_IMPORTED_MODULE_13__pages_feedback_feedback__["a" /* FeedbackPage */], icon: "chatboxes" },
                { title: "pageHeader.pushMessagesPage", pageName: __WEBPACK_IMPORTED_MODULE_18__pages_push_messages_push_messages__["a" /* PushMessagesPage */], icon: "chatbubbles" },
                { title: "pageHeader.settingsPage", pageName: __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__["a" /* SettingsPage */], icon: "settings" },
                { title: "pageHeader.logoutPage", pageName: __WEBPACK_IMPORTED_MODULE_16__pages_logout_logout__["a" /* LogoutPage */], icon: "log-out" }
            ];
        }
        else {
            this.pagesInMenu = [
                { title: "pageHeader.homePage_alt", pageName: __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */], icon: "home" },
                { title: "pageHeader.appointmentsPage_2", pageName: __WEBPACK_IMPORTED_MODULE_12__pages_appointments_appointments__["a" /* AppointmentsPage */], icon: "alarm" },
                { title: "pageHeader.questionsPage", pageName: __WEBPACK_IMPORTED_MODULE_14__pages_questions_questions__["a" /* QuestionsPage */], icon: "create" },
                { title: "pageHeader.contactsPage", pageName: __WEBPACK_IMPORTED_MODULE_11__pages_contacts_contacts__["a" /* ContactsPage */], icon: "contacts" },
                { title: "pageHeader.feedbackPage", pageName: __WEBPACK_IMPORTED_MODULE_13__pages_feedback_feedback__["a" /* FeedbackPage */], icon: "chatboxes" },
                { title: "pageHeader.settingsPage", pageName: __WEBPACK_IMPORTED_MODULE_15__pages_settings_settings__["a" /* SettingsPage */], icon: "settings" },
                { title: "pageHeader.logoutPage", pageName: __WEBPACK_IMPORTED_MODULE_16__pages_logout_logout__["a" /* LogoutPage */], icon: "log-out" }
            ];
        }
    };
    /**
     * initTranslate
     *
     * sets up translation
     */
    MyApp.prototype.initTranslate = function () {
        var _this = this;
        // set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('de');
        // check if language preference has been saved to storage
        this.storage.get("appLanguage").then(function (value) {
            if (value != null) {
                _this.translate.use(value);
            }
            else {
                _this.translate.use("de");
                _this.storage.set("appLanguage", "de");
            }
        });
    };
    /**
     * openPage
     *
     * opens the selected page
     * @param page
     */
    MyApp.prototype.openPage = function (page) {
        // pushes selected page (except if its the HomePage, then it sets a new root)
        if ((page.pageName == __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */]) && (this.nav.getActive().component != __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */])) {
            this.nav.setRoot(page.pageName, { fromSideMenu: true });
        }
        else {
            if (this.nav.getActive().component != page.pageName) {
                this.nav.popToRoot();
                this.nav.push(page.pageName);
            }
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Nav"]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Nav"])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/app/app.html"*/'<ion-menu id="sideMenu" class="sideMenu" [content]="content" side="right" type="overlay" persistent="true">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>{{ "label.menu" | translate }}</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n    <div *ngFor="let page of pagesInMenu">\n      <button menuClose ion-item (click)="openPage(page)">\n        <ion-icon [name]="page.icon"></ion-icon> {{ page.title | translate }}\n      </button>\n    </div>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Platform"],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_7__node_modules_angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_8__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_1__providers_push_provider_push_provider__["a" /* PushProvider */],
            __WEBPACK_IMPORTED_MODULE_0__ionic_native_keyboard__["a" /* Keyboard */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__select_module_select_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__questions_questions__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_question_provider_question_provider__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_event_provider_event_provider__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_push_provider_push_provider__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_push__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












/**
 * HomePage
 */
var HomePage = (function () {
    function HomePage(navCtrl, storage, appointm, connection, alertCtrl, translate, questions, pushProv, platform, menu, http, navParams, push) {
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.appointm = appointm;
        this.connection = connection;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.questions = questions;
        this.pushProv = pushProv;
        this.platform = platform;
        this.menu = menu;
        this.http = http;
        this.navParams = navParams;
        this.push = push;
        this.selectedModule = null;
        this.token = "";
        this.eventList = [];
        this.openQuestions = false;
        this.hiddenCardsLastCheck = ["0"];
        this.scheduledEventsLastCheck = ["0"];
        this.fromSideMenu = false;
        this.hiddenEvent = [];
        this.scheduledEvent = [];
        this.isPushAllowed = true;
        this.menu.enable(true, "sideMenu");
    }
    HomePage.prototype.ngOnInit = function () {
        this.fromSideMenu = this.navParams.get("fromSideMenu");
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.initHome();
    };
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (this.platform.is("cordova")) {
            var timeout = setTimeout(function () {
                _this.push.hasPermission().then(function (res) {
                    if (res.isEnabled) {
                        _this.isPushAllowed = true;
                    }
                    else {
                        _this.isPushAllowed = false;
                    }
                });
            }, 5000);
            console.log(timeout);
        }
    };
    HomePage.prototype.initHome = function () {
        var _this = this;
        var lastView = this.navCtrl.last().name;
        this.storage.get("session").then(function (session) {
            if (!session) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_1__select_module_select_module__["a" /* SelectModulePage */]);
            }
            else {
                _this.connection.checkOnline().subscribe(function (online) {
                    if (online) {
                        _this.storage.get("config").then(function (config) {
                            if (config) {
                                if (lastView == "HomePage" || _this.fromSideMenu || lastView == "SettingsPage") {
                                    _this.isLoaded = false;
                                    _this.isLoaded2 = false;
                                    _this.fromSideMenu = false;
                                    _this.enrollSelf(config, session.token);
                                    _this.appointm.loadParams();
                                    _this.questions.loadParams();
                                    _this.checkUpdatedCards("HomePage");
                                    _this.loadQuestions();
                                    if (_this.platform.is("ios") || _this.platform.is("android")) {
                                        _this.storage.get("pushRegistered").then(function (push) {
                                            if (push != "yes") {
                                                _this.pushProv.registerPushService(config);
                                            }
                                        });
                                    }
                                }
                                else if (lastView == "AppointmentsPage") {
                                    _this.appointm.loadParams();
                                    _this.checkUpdatedCards(lastView);
                                }
                                else if (lastView == "QuestionsPage") {
                                    _this.isLoaded2 = false;
                                    _this.questions.loadParams();
                                    _this.loadQuestions();
                                }
                            }
                        });
                    }
                    else {
                        _this.showAlert("statusMessage.error.network");
                    }
                });
            }
        });
    };
    HomePage.prototype.enrollSelf = function (config, token) {
        var moodleAccessPoint = config.moodleServiceEndpoint;
        var accessToken = config.authorization.credentials.accessToken;
        var courseID = config.courseID;
        var wstoken = token;
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["d" /* HttpParams */]()
            .append("wstoken", wstoken)
            .append("wsfunction", "local_reflect_enrol_self")
            .append("moodlewsrestformat", "json")
            .append("courseID", courseID);
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", accessToken);
        this.http.get(moodleAccessPoint, { headers: headers, params: params }).subscribe(function (data) {
            // console.log("local enrol self");
        });
    };
    HomePage.prototype.checkUpdatedCards = function (lastView) {
        var _this = this;
        this.storage.get("hiddenCards").then(function (hiddenArray) {
            if (lastView != "HomePage") {
                _this.storage.get("scheduledEvents").then(function (scheduledArray) {
                    if (hiddenArray) {
                        if (!(hiddenArray.length == _this.hiddenCardsLastCheck.length && hiddenArray.every(function (value, index) { return value == _this.hiddenCardsLastCheck[index]; }))) {
                            _this.loadAppointments(hiddenArray, lastView);
                        }
                        else if (scheduledArray) {
                            if (!(scheduledArray.length == _this.scheduledEventsLastCheck.length && scheduledArray.every(function (value, index) { return value == _this.scheduledEventsLastCheck[index]; }))) {
                                _this.loadAppointments(hiddenArray, lastView);
                            }
                        }
                    }
                    else if (scheduledArray) {
                        if (!(scheduledArray.length == _this.scheduledEventsLastCheck.length && scheduledArray.every(function (value, index) { return value == _this.scheduledEventsLastCheck[index]; }))) {
                            _this.loadAppointments(hiddenArray, lastView);
                        }
                    }
                    else {
                        _this.loadAppointments(hiddenArray, lastView);
                    }
                });
            }
            else {
                _this.loadAppointments(hiddenArray, lastView);
            }
        });
    };
    HomePage.prototype.loadAppointments = function (hiddenCardArray, lastView) {
        var _this = this;
        this.hiddenCardsLastCheck = hiddenCardArray;
        if (lastView != "HomePage") {
            this.isLoaded = false;
        }
        this.appointm.readyObservable.subscribe(function (ready) {
            if (ready) {
                _this.appointm.getAppointments().subscribe(function (appointConf) {
                    if (appointConf.events) {
                        _this.eventList = [];
                        var j = 0;
                        if (hiddenCardArray) {
                            var _loop_1 = function (event_1) {
                                if (event_1.modulename != "feedback") {
                                    foundID = hiddenCardArray.find(function (element) { return element == event_1.id.toString(); });
                                    if (foundID != undefined) {
                                        _this.hiddenEvent[event_1.id] = true;
                                    }
                                    else if (j > 2) {
                                        _this.hiddenEvent[event_1.id] = true;
                                    }
                                    else {
                                        _this.hiddenEvent[event_1.id] = false;
                                        j = j + 1;
                                    }
                                    _this.eventList.push(event_1);
                                }
                            };
                            var foundID;
                            for (var _i = 0, _a = appointConf.events; _i < _a.length; _i++) {
                                var event_1 = _a[_i];
                                _loop_1(event_1);
                            }
                        }
                        else {
                            for (var _b = 0, _c = appointConf.events; _b < _c.length; _b++) {
                                var event_2 = _c[_b];
                                if (event_2.modulename != "feedback") {
                                    if (j > 2) {
                                        _this.hiddenEvent[event_2.id] = true;
                                    }
                                    else {
                                        _this.hiddenEvent[event_2.id] = false;
                                        j = j + 1;
                                    }
                                    _this.eventList.push(event_2);
                                }
                            }
                        }
                        _this.storage.get("scheduledEvents").then(function (array) {
                            _this.scheduledEventsLastCheck = array;
                            var notificationID;
                            if (array) {
                                for (var _i = 0, _a = appointConf.events; _i < _a.length; _i++) {
                                    var event_3 = _a[_i];
                                    if (event_3.modulename != "feedback") {
                                        notificationID = event_3.id * 10;
                                        var foundID = array.find(function (element) { return element == notificationID.toString(); });
                                        if (foundID != undefined) {
                                            _this.scheduledEvent[event_3.id] = true;
                                        }
                                        else {
                                            _this.scheduledEvent[event_3.id] = false;
                                        }
                                    }
                                }
                            }
                            else {
                                for (var _b = 0, _c = appointConf.events; _b < _c.length; _b++) {
                                    var event_4 = _c[_b];
                                    if (event_4.modulename != "feedback") {
                                        _this.scheduledEvent[event_4.id] = false;
                                    }
                                }
                            }
                            _this.isLoaded = true;
                        });
                    }
                    else {
                        _this.isLoaded = true;
                    }
                });
            }
            else {
                _this.isLoaded = true;
            }
        });
    };
    HomePage.prototype.loadQuestions = function () {
        var _this = this;
        this.questions.readyObservable.subscribe(function (ready) {
            if (ready) {
                _this.questions.getQuestions().subscribe(function (questionJson) {
                    if (questionJson.feedbacks) {
                        if (questionJson.feedbacks.length > 0) {
                            _this.openQuestions = true;
                        }
                        else {
                            _this.openQuestions = false;
                        }
                    }
                    else {
                        _this.openQuestions = false;
                        console.log("error fetching feedbacks from server.");
                    }
                    _this.isLoaded2 = true;
                });
            }
        });
    };
    HomePage.prototype.notificationStatusChanged = function () {
        var _this = this;
        this.storage.get("scheduledEvents").then(function (array) {
            _this.scheduledEventsLastCheck = array;
        });
    };
    HomePage.prototype.showAlert = function (alertTextKey) {
        var alert = this.alertCtrl.create({
            title: this.translate.instant("statusMessage.error.title"),
            subTitle: this.translate.instant(alertTextKey),
            buttons: [
                this.translate.instant("buttonLabel.ok")
            ]
        });
        alert.present();
    };
    HomePage.prototype.goToQuestions = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__questions_questions__["a" /* QuestionsPage */]);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.homePage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <div align="center" *ngIf="!isLoaded2" padding>\n    <ion-spinner></ion-spinner>\n  </div>\n\n  <div>\n    <ion-card *ngIf="isLoaded2">\n      <ion-card-content class="reminder">\n        <div *ngIf="openQuestions" text-wrap>{{ "label.questionsPage.hintUnansweredQuestions" | translate }}</div>\n        <div *ngIf="!openQuestions" text-wrap>{{ "label.questionsPage.hintNewQuestionsSoon" | translate }}</div>\n        <br *ngIf="openQuestions">\n        <div align="right">\n          <button *ngIf="openQuestions" ion-button small (click)="goToQuestions()" text-wrap>\n              {{ "buttonLabel.goToQuestions" | translate }}\n          </button>\n        </div>\n      </ion-card-content>\n    </ion-card>\n    <div *ngIf="isLoaded2 && openQuestions" style="position: relative">\n      <ion-fab mini left bottom edge>\n        <div ion-fab color="darkerSecondary">\n          <ion-icon name="ios-chatbubbles"></ion-icon>\n        </div>\n      </ion-fab>\n    </div>\n  </div>\n\n  <div align="center" *ngIf="!isLoaded && isLoaded2" padding>\n      <ion-spinner></ion-spinner>\n  </div>\n\n  <div *ngIf="isLoaded">\n    <event *ngFor="let ev of eventList; let i = index"\n    [event]="ev"\n    [hiddenEvent]="hiddenEvent[ev.id]" \n    [scheduledEvent]="scheduledEvent[ev.id]"\n    [index]="i"\n    [isPushAllowed]="isPushAllowed"\n    (visibilityChanged)="checkUpdatedCards(\'HomePage\')"\n    (notificationStatusChanged)="notificationStatusChanged()"></event>\n  </div>\n\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_8__providers_event_provider_event_provider__["a" /* EventProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_9__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_3__providers_question_provider_question_provider__["a" /* QuestionProvider */],
            __WEBPACK_IMPORTED_MODULE_10__providers_push_provider_push_provider__["a" /* PushProvider */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["Platform"],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["MenuController"],
            __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_push__["a" /* Push */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SettingsPage = (function () {
    function SettingsPage(navCtrl, navParams, translate, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.translate = translate;
        this.storage = storage;
        this.hideTabBar = false;
        this.language = translate.currentLang;
        if (this.navParams.data.hideTabBar) {
            this.hideTabBar = this.navParams.data.hideTabBar;
        }
        this.langForm = new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormGroup"]({
            "langs": new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]({ value: this.translate.currentLang, disabled: false })
        });
    }
    SettingsPage.prototype.onChange = function (lang) {
        this.language = lang;
        this.translate.use(this.language);
        this.storage.set("appLanguage", this.language);
    };
    SettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'page-settings',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/settings/settings.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.settingsPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-card>\n    <ion-card-content class="reminder">\n      {{ "label.settingsPage.changeLanguage" | translate }}\n    </ion-card-content>\n  </ion-card>\n\n  <!-- <ion-item padding>\n    <ion-label>{{ "label.settingsPage.language" | translate }}</ion-label>\n    <ion-select [(ngModel)]="language" (ionChange)="onChange()" okText="{{ \'buttonLabel.ok\' | translate }}" cancelText="{{ \'buttonLabel.cancel\' | translate }}">\n      <ion-option value="en">English</ion-option>\n      <ion-option value="de">Deutsch</ion-option>\n    </ion-select>\n  </ion-item> -->\n\n  <form [formGroup]="langForm">\n    <ion-list radio-group formControlName="langs">  \n      <ion-item tappable>\n        <ion-label>English</ion-label>\n        <ion-radio value="en" (ionSelect)="onChange(\'en\')"></ion-radio>\n        <ion-avatar item-start>\n          <img src="assets/imgs/flags/us.png">\n        </ion-avatar>\n      </ion-item>\n      <ion-item tappable>\n        <ion-label>Deutsch</ion-label>\n        <ion-radio value="de" (ionSelect)="onChange(\'de\')"></ion-radio>\n        <ion-avatar item-start>\n          <img src="assets/imgs/flags/de.png">\n        </ion-avatar>\n      </ion-item>\n    </ion-list>\n  </form>\n\n\n</ion-content>\n\n<ion-footer *ngIf="!hideTabBar">\n    <tab-bar></tab-bar>\n</ion-footer>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/settings/settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */]])
    ], SettingsPage);
    return SettingsPage;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImpressumPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ImpressumPage = (function () {
    function ImpressumPage(navCtrl, navParams, storage, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.translate = translate;
        this.configStorageKey = "config";
        this.impressum = "\n\n            <em style=\"font-family: Helvetica, Arial, sans-serif;font-size: 1em;font-weight:normal; text-align:left;\">Herausgeber</em>\n            <p>\n            Universität Potsdam<br />\n            Am Neuen Palais 10<br />\n            14469 Potsdam<br /><br />\n            <b>Tel.:</b> 0331 977-0<br />\n            <b>Fax:</b> 0331 97 21 63<br />\n            <b>Web:</b> www.uni-potsdam.de<br />\n            </p>\n\n            <em>Verantwortlich für den App Store Account des Service Mobile.UP der Universität Potsdam</em>\n            <p>\n            Ulrike Lucke, CIO der Universität Potsdam<br />\n            14469 Potsdam<br />\n            <b>E-Mail:</b> <a href=\"mailto:mobileup-service@uni-potsdam.de\">mobileup-service@uni-potsdam.de</a>\n            </p>\n\n            <em>Rechtsform und gesetzliche Vertretung</em>\n            <p>\n            Die Universität Potsdam ist eine Körperschaft des Öffentlichen Rechts. Sie wird gesetzlich vertreten durch Prof. Oliver Günther, Ph.D., Präsident der Universität Potsdam, Am Neuen Palais 10, 14469 Potsdam.\n            </p>\n\n            <em>Zuständige Aufsichtsbehörde</em>\n            <p>Ministerium für Wissenschaft, Forschung und Kultur des Landes Brandenburg, Dortustr. 36, 14467 Potsdam</p>\n\n            <em>Umsatzsteueridentifikationsnummer und inhaltliche Verantwortlichkeit</em>\n            <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE138408327</p>\n            <p>Die inhaltliche Verantwortlichkeit i. S. v. § 5 TMG und § 55 Abs. 2 RStV übernimmt der ASTA (Allgemeiner Studierendenausschuss) der Universität Potsdam.</p>\n\n            <em>Haftung</em>\n            <p>Für die Punkte Haftung, Urheberrecht und Datenschutz gilt die <a\n            href=\"(http://www.zeik.uni-potsdam.de/fileadmin/projects/zeik/assets/benutzerordnung_zeik.pdf\">Nutzungsordnung der ZEIK</a>. Die Haftung erfolgt ausschließlich für die Erstinstallation und weiteren Updates aus dem App Store oder anderen offiziellen Quellen. Applikationen Dritter können ein einigen Stellen in Reflect.UP verlinkt werden. Diese werden jedoch separat installiert und beinhalten eigene Nutzungsrichtlinien. Für die Inhalte solcher Apps zeichnet sich die Universität Potsdam nicht verantwortlich.<br /><br />Der Zugriff ist technisch abgesichert und die Daten werden nicht zwischengespeichert. Die Verwendung dieses Dienstes erfolgt durch den Nutzer freiwillig.</p>\n\n                </p>\n\n            <h1>Ansprechpartner</h1>\n            <p>\n            <b>Alexander Knoth</b><br /> Universität Potsdam<br /> Wirtschafts- und Sozialwissenschaftliche Fakultät<br /> August-Bebel-Str. 89<br /> 14482 Potsdam<br />\n            Haus 1 | 1.54<br />\n            <br /> <b>Telefon:</b> +49-331-977-3564 <br style=\"clear: left;\">\n\n            </p>\n            </div>\n\n            <div>\n            <h1>Mitmachen</h1>\n            <p>\n            Es gibt die Möglichkeit als studentische Mitarbeiter innerhalb von\n            Lehrprojekten, Aufträgen oder Anstellung an der App-Entwicklung im\n            Rahmen des eLiS-Projekts mitzuwirken.<br />Die App ist als Open\n            Source Projekt veröffentlicht.<br />\n            <br />Wenn Sie sich für eine Mitarbeit an der App interessieren,\n            können Sie gern das Entwicklerteam unter <a href=\"mailto:elis-dev@lists.cs.uni-potsdam.de\">elis-dev@lists.cs.uni-potsdam.de</a>\n            kontaktieren.\n            </p>\n            </div>";
        this.showTOS = false;
    }
    ImpressumPage.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.get(this.configStorageKey).then(function (config) {
            if (config) {
                _this.impressum = config.impressumTemplate;
            }
        });
    };
    ImpressumPage.prototype.processMoodleContents = function (stringToAnalize) {
        //checking for multi language tags
        var domObj = __WEBPACK_IMPORTED_MODULE_3_jquery__(__WEBPACK_IMPORTED_MODULE_3_jquery__["parseHTML"](stringToAnalize));
        var result = stringToAnalize;
        var language = this.translate.currentLang;
        if (domObj.length > 1) {
            __WEBPACK_IMPORTED_MODULE_4_underscore__["each"](domObj, function (element) {
                if (__WEBPACK_IMPORTED_MODULE_3_jquery__(element)[0].lang == language) {
                    result = __WEBPACK_IMPORTED_MODULE_3_jquery__(element).html();
                }
            });
            // since there are some strings without spanish translation
            // use englisch as a fallback
            if (result == stringToAnalize) {
                __WEBPACK_IMPORTED_MODULE_4_underscore__["each"](domObj, function (element) {
                    if (__WEBPACK_IMPORTED_MODULE_3_jquery__(element)[0].lang == "en") {
                        result = __WEBPACK_IMPORTED_MODULE_3_jquery__(element).html();
                    }
                });
            }
        }
        return result;
    };
    ImpressumPage.prototype.toggleTOS = function () {
        this.showTOS = !this.showTOS;
    };
    ImpressumPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'page-impressum',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/impressum/impressum.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{ "pageHeader.impressumPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div [innerHTML]="processMoodleContents(impressum)" padding></div>\n  <ion-card tappable (click)="toggleTOS()">\n    <ion-item text-wrap>\n      <ion-icon *ngIf="!showTOS" item-left name="arrow-dropright"></ion-icon>\n      <ion-icon *ngIf="showTOS" item-left name="arrow-dropdown"></ion-icon>\n      {{ "statusMessage.tos.title" | translate }}\n    </ion-item>\n    <ion-card-content *ngIf="showTOS" class="reminder">\n      {{ "statusMessage.tos.message" | translate }}\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/impressum/impressum.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], ImpressumPage);
    return ImpressumPage;
}());

//# sourceMappingURL=impressum.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_question_provider_question_provider__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_connection_provider_connection_provider__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(8);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var QuestionsPage = (function () {
    function QuestionsPage(navCtrl, navParams, connection, translate, alertCtrl, questions) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.connection = connection;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.questions = questions;
        this.isLoaded = false;
        this.completedQuestionList = [];
        this.noQuestions = false;
        this.noCompletedQuestions = true;
        this.showCompletedQuestions = false;
        this.isLoaded = false;
    }
    QuestionsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.connection.checkOnline().subscribe(function (online) {
            if (online) {
                _this.isLoaded = false;
                _this.questions.loadParams();
                _this.questions.readyObservable.subscribe(function (ready) {
                    if (ready) {
                        _this.questions.getQuestions().subscribe(function (questionJson) {
                            if (questionJson.feedbacks) {
                                _this.questionList = questionJson.feedbacks;
                                if (_this.questionList.length < 1) {
                                    _this.noQuestions = true;
                                }
                            }
                            else {
                                _this.noQuestions = true;
                                console.log("error fetching feedbacks from server.");
                            }
                        });
                        _this.questions.getAnsweredQuestions().subscribe(function (questionJson) {
                            if (questionJson.feedbacks) {
                                for (var _i = 0, _a = questionJson.feedbacks; _i < _a.length; _i++) {
                                    var feedback = _a[_i];
                                    if (feedback.answers.length > 0) {
                                        _this.completedQuestionList.push(feedback);
                                    }
                                }
                                if (_this.completedQuestionList.length > 0) {
                                    _this.noCompletedQuestions = false;
                                }
                            }
                            else {
                                console.log("error fetching completed feedbacks from server.");
                            }
                            _this.isLoaded = true;
                        });
                    }
                });
            }
            else {
                // there is no network connection
                _this.showAlert("statusMessage.error.network");
            }
        });
    };
    QuestionsPage.prototype.showAlert = function (alertTextKey) {
        var alert = this.alertCtrl.create({
            title: this.translate.instant("statusMessage.error.title"),
            subTitle: this.translate.instant(alertTextKey),
            buttons: [
                this.translate.instant("buttonLabel.ok")
            ]
        });
        alert.present();
    };
    QuestionsPage.prototype.toggleCompleted = function () {
        this.showCompletedQuestions = !this.showCompletedQuestions;
    };
    QuestionsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Component"])({
            selector: 'page-questions',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/questions/questions.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.questionsPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding-top>\n    <div align="center" *ngIf="!isLoaded" padding>\n        <ion-spinner></ion-spinner>\n    </div>\n\n    <ion-row *ngIf="isLoaded && noQuestions">\n      <ion-col>\n        <ion-card>\n          <ion-card-content class="reminder">\n            {{ "label.questionsPage.hintNewQuestionsSoon" | translate }}\n          </ion-card-content>\n        </ion-card>\n      </ion-col>\n    </ion-row>\n\n    <div *ngIf="isLoaded">\n      <question *ngFor="let quest of questionList; let i = index" [questions]="quest"></question>\n    </div>\n\n    <div *ngIf="isLoaded && !noCompletedQuestions" padding-top padding-horizontal>\n      <button ion-button icon-left color="secondary" full (click)="toggleCompleted()" text-wrap>\n        <ion-icon item-left *ngIf="!showCompletedQuestions" name="arrow-dropright"></ion-icon>\n        <ion-icon item-left *ngIf="showCompletedQuestions" name="arrow-dropdown"></ion-icon>\n        <div align="center">{{ "buttonLabel.showCompletedQuestions" | translate }}</div>\n      </button>\n    </div>\n\n    <div *ngIf="showCompletedQuestions">\n      <div *ngFor="let quest of completedQuestionList; let i = index">\n        <question [questions]="quest"></question>\n      </div>\n    </div>\n\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/questions/questions.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_2__providers_connection_provider_connection_provider__["a" /* ConnectionProvider */],
            __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_0__providers_question_provider_question_provider__["a" /* QuestionProvider */]])
    ], QuestionsPage);
    return QuestionsPage;
}());

//# sourceMappingURL=questions.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var QuestionProvider = (function () {
    function QuestionProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        this.configStorageKey = "config";
        this.checkIfReady();
        this.loadParams();
    }
    QuestionProvider.prototype.checkIfReady = function () {
        var _this = this;
        this.readyObservable = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].create(function (observer) {
            _this.storage.get("questionParameterLoaded").then(function (loaded) {
                if (loaded) {
                    observer.next(true);
                }
                else {
                    observer.next(false);
                }
            });
        });
    };
    QuestionProvider.prototype.loadParams = function () {
        var _this = this;
        this.storage.get(this.configStorageKey).then(function (config) {
            if (config) {
                _this.url = config.moodleServiceEndpoint;
                _this.course_id = config.courseID;
                _this.accessToken = config.authorization.credentials.accessToken;
                _this.storage.set("questionParameterLoaded", true);
            }
        });
        this.storage.get("session").then(function (token) {
            if (token) {
                _this.wstoken = token.token;
            }
        });
    };
    QuestionProvider.prototype.getQuestions = function () {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["d" /* HttpParams */]()
            .append("wstoken", this.wstoken)
            .append("wsfunction", "local_reflect_get_feedbacks")
            .append("moodlewsrestformat", "json")
            .append("courseID", this.course_id);
        // .append("courseID",              "UPR-1718-T"); // Test-Kurs
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", this.accessToken);
        return this.http.get(this.url, { headers: headers, params: params });
    };
    QuestionProvider.prototype.getAnsweredQuestions = function () {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["d" /* HttpParams */]()
            .append("wstoken", this.wstoken)
            .append("wsfunction", "local_reflect_get_completed_feedbacks")
            .append("moodlewsrestformat", "json")
            .append("courseID", this.course_id);
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", this.accessToken);
        return this.http.get(this.url, { headers: headers, params: params });
    };
    // resultID = ID der Feedback Kategorie
    // resultAnswerArray = Array mit jeweils Question-ID und Question-Antwort
    QuestionProvider.prototype.sendAnswers = function (resultID, resultAnswersArray) {
        var i;
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]()
            .append("Authorization", this.accessToken);
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["d" /* HttpParams */]()
            .append("wstoken", this.wstoken)
            .append("wsfunction", "local_reflect_submit_feedbacks")
            .append("moodlewsrestformat", "json")
            .append("id", resultID.toString());
        for (i = 0; i < resultAnswersArray.length; i++) {
            var answerIDstring, answerString;
            answerIDstring = "answers[" + i + "][id]";
            answerString = "answers[" + i + "][answer]";
            params = params.append(answerIDstring, resultAnswersArray[i][0]); // 0 = frage-id
            params = params.append(answerString, resultAnswersArray[i][1]); // 1 = answer
        }
        // params = params.append("courseID",             "UPR-1718-T");
        params = params.append("courseID", this.course_id);
        this.http.get(this.url, { headers: headers, params: params }).subscribe(function (data) {
            console.log(data);
        });
    };
    QuestionProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], QuestionProvider);
    return QuestionProvider;
}());

//# sourceMappingURL=question-provider.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PushProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_push__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_push_messages_push_messages__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PushProvider = (function () {
    function PushProvider(http, platform, push, alertCtrl, translate, storage, app) {
        this.http = http;
        this.platform = platform;
        this.push = push;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.storage = storage;
        this.app = app;
        this.newCount = 0;
        this.global_registrationID = "";
    }
    PushProvider.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.get("notificationCount").then(function (data) {
            if (data != undefined) {
                _this.newCount = Number(data);
            }
        });
    };
    PushProvider.prototype.createPushOptions = function (deviceID) {
        var tokenPayload = {
            device: null,
            token: null,
            channel: "default"
        };
        if (this.platform.is('ios')) {
            tokenPayload.device = "ios";
            tokenPayload.token = deviceID;
        }
        else {
            tokenPayload.device = "android";
            tokenPayload.token = deviceID;
        }
        return tokenPayload;
    };
    PushProvider.prototype.subscribeToPush = function (registrationID, config) {
        var _this = this;
        // subscribe to the AirNotifier push service
        var url_subscribe = config.pushDetails.uniqushUrl.concat("tokens/");
        // console.log("registering push via " + url_subscribe);
        var myData = JSON.stringify(this.createPushOptions(registrationID));
        // console.log("with payload " + myData);
        var headerAppName = "reflectup";
        headerAppName = headerAppName.concat(config.courseID.replace(/-/g, '').toLowerCase());
        var headerAppKey = config.pushDetails.XAnAppKey;
        var myHeaders = {
            headers: new __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpHeaders */]({
                "Authorization": "Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8",
                "Accept": "application/json",
                "X-An-App-Name": headerAppName,
                "X-An-App-Key": headerAppKey
            })
        };
        // doesn't work with livereload
        this.http.post(url_subscribe, myData, myHeaders).subscribe(function (res) {
            // console.log("(subscribe): successfully contacted the push server.");
            _this.storage.set("pushRegistered", "yes");
        }, function (err) {
            if (err.status == 200) {
                // console.log("(subscribe): successfully contacted the push server.");
                _this.storage.set("pushRegistered", "yes");
            }
            else {
                console.log("(subscribe): error while contacting the push server: " + err.message);
            }
        });
    };
    PushProvider.prototype.unsubscribeToPush = function (config) {
        // unsubscribe from the AirNotifier push service
        var url_unsubscribe = config.pushDetails.uniqushUrl.concat("tokens/") + this.global_registrationID;
        var headerAppName = "reflectup";
        headerAppName = headerAppName.concat(config.courseID.replace(/-/g, '').toLowerCase());
        var headerAppKey = config.pushDetails.XAnAppKey;
        var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpHeaders */]()
            .append("Accept", "application/json")
            .append("X-An-App-Name", headerAppName)
            .append("X-An-App-Key", headerAppKey)
            .append("Authorization", "Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8");
        this.http.delete(url_unsubscribe, { headers: headers }).subscribe(function (res) {
            // console.log("(unsubscribe): successfully contacted the push server.");
        }, function (err) {
            console.log("(unsubscribe): error while contacting the push server." + err.message);
        });
    };
    PushProvider.prototype.registerPushService = function (config) {
        var _this = this;
        // registration to the push service
        this.push.hasPermission().then(function (res) {
            if (res.isEnabled) {
                // console.log('We have permission to send push notifications');
            }
            else {
                console.log('We do NOT have permission to send push notifications');
                return;
            }
        });
        // notification channel for Android O and above
        this.push.createChannel({
            id: "Reflect.UP",
            description: "Channel for Reflect.UP notifications",
            importance: 3
        }).then(function () { return console.log("Channel created."); }).catch(function () {
            console.log("Error creating the Channel.");
        });
        var options = {
            android: {
                senderID: config.pushDetails.senderID
            },
            browser: {
                pushServiceURL: config.pushDetails.uniqushUrl
            },
            ios: {
                alert: true,
                badge: true,
                sound: true,
                clearBadge: true
            },
            windows: {}
        };
        var pushObject = this.push.init(options);
        pushObject.on("notification").subscribe(function (data) {
            var title;
            // set default title if there is no title in push notification
            if (data.title) {
                title = data.title;
            }
            else {
                title = "Reflect.UP";
            }
            ;
            _this.storage.get("notificationCount").then(function (oldCount) {
                // set notification counter
                if (oldCount) {
                    _this.newCount = Number(oldCount) + 1;
                }
                else {
                    _this.newCount = 1;
                }
                _this.storage.set("notificationCount", _this.newCount);
                // console.log("notificationCount: " + this.newCount);
                var currentTime = __WEBPACK_IMPORTED_MODULE_7_moment__();
                var pushDetails = {
                    pushMessage: data.message,
                    pushTitle: title,
                    pushCount: _this.newCount,
                    pushTime: currentTime
                };
                _this.storage.get("savedNotifications").then(function (oldArray) {
                    var notArray;
                    var lastIndex;
                    if (oldArray) {
                        lastIndex = oldArray.length;
                        notArray = new Array(oldArray.length + 1);
                        notArray = oldArray.slice(0, lastIndex);
                    }
                    else {
                        lastIndex = 0;
                        notArray = new Array(1);
                    }
                    notArray[lastIndex] = pushDetails;
                    // save notification to local storage
                    _this.storage.set("savedNotifications", notArray);
                });
            });
            // only schedule an alert when notification is received while app in foreground
            if (data.additionalData.foreground) {
                var alert_1 = _this.alertCtrl.create({
                    title: title,
                    message: data.message,
                    buttons: [
                        {
                            text: _this.translate.instant("buttonLabel.ok"),
                            role: 'dismiss',
                            handler: function () {
                                // console.log("Dialog dismissed");
                            }
                        },
                        {
                            text: _this.translate.instant("buttonLabel.show"),
                            role: 'show',
                            handler: function () {
                                var nav = _this.app.getRootNav();
                                nav.push(__WEBPACK_IMPORTED_MODULE_6__pages_push_messages_push_messages__["a" /* PushMessagesPage */]);
                            }
                        }
                    ],
                    enableBackdropDismiss: false,
                });
                alert_1.present();
            }
            else {
                // redirect user to messages page
                var nav = _this.app.getRootNav();
                nav.push(__WEBPACK_IMPORTED_MODULE_6__pages_push_messages_push_messages__["a" /* PushMessagesPage */]);
            }
            // calling pushObject.finish (necessary on iOS)
            pushObject.finish().then(function () {
                // console.log("Processing finished.")
            }).catch(function () {
                console.log("Error while processing background push.");
            });
        });
        pushObject.on("registration").subscribe(function (data) {
            if (data.registrationId.length == 0) {
                console.log("ERROR: Push registrationID is empty");
            }
            else {
                _this.global_registrationID = data.registrationId;
                _this.subscribeToPush(data.registrationId, config);
            }
        });
        pushObject.on("error").subscribe(function (data) {
            console.log("Push error happened: " + data.message);
        });
    };
    PushProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["Platform"],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_push__["a" /* Push */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["App"]])
    ], PushProvider);
    return PushProvider;
}());

//# sourceMappingURL=push-provider.js.map

/***/ }),

/***/ 72:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PushMessagesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PushMessagesPage = (function () {
    function PushMessagesPage(navCtrl, navParams, storage, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.translate = translate;
        this.noPushMessages = false;
        this.timeStampArray = [];
    }
    PushMessagesPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.storage.get("savedNotifications").then(function (savedArray) {
            _this.pushList = [];
            if (savedArray != undefined) {
                _this.pushList = savedArray.slice().reverse();
                var i;
                _this.timeStampArray = [];
                for (i = 0; i < _this.pushList.length; i++) {
                    __WEBPACK_IMPORTED_MODULE_3_moment__["locale"](_this.translate.currentLang);
                    var pushTime = __WEBPACK_IMPORTED_MODULE_3_moment__(_this.pushList[i].pushTime);
                    if (_this.translate.currentLang == "de") {
                        _this.timeStampArray.push(pushTime.format('DD. MMMM, LT'));
                    }
                    else {
                        _this.timeStampArray.push(pushTime.format('MMMM Do, LT'));
                    }
                }
            }
            else {
                _this.noPushMessages = true;
            }
            ;
        });
    };
    PushMessagesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'page-push-messages',template:/*ion-inline-start:"/Users/lewin/Git/reflectup/src/pages/push-messages/push-messages.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle right>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ "pageHeader.pushMessagesPage" | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-row *ngIf="noPushMessages">\n    <ion-col>\n      <ion-card>\n        <ion-card-content text-wrap class="reminder">\n          {{ "label.pushMessagesPage.noMessagesReceived" | translate }}\n        </ion-card-content>\n      </ion-card>\n    </ion-col>\n  </ion-row>\n\n  <div *ngFor="let mess of pushList; let i = index">\n    <ion-row *ngIf="!noPushMessages">\n      <ion-col>\n        <ion-card>\n          <ion-card-header text-wrap>\n            <div *ngIf="!mess.pushTime || timeStampArray[i] == \'Invalid date\'">{{ mess.pushTitle }}</div>\n            <div *ngIf="mess.pushTime && timeStampArray[i] != \'Invalid date\'">{{ mess.pushTitle }} – {{ timeStampArray[i] }} {{ "label.appointmentsPage.time" | translate }}</div>\n          </ion-card-header>\n          <ion-card-content text-wrap class="reminder">\n            {{ mess.pushMessage }}\n          </ion-card-content>\n        </ion-card>\n      </ion-col>\n    </ion-row>\n  </div>\n\n</ion-content>\n\n<ion-footer>\n    <tab-bar></tab-bar>\n</ion-footer>'/*ion-inline-end:"/Users/lewin/Git/reflectup/src/pages/push-messages/push-messages.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */]])
    ], PushMessagesPage);
    return PushMessagesPage;
}());

//# sourceMappingURL=push-messages.js.map

/***/ })

},[370]);
//# sourceMappingURL=main.js.map
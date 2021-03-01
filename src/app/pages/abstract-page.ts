import { Logger, LoggingService } from "ionic-logging-service";
import { Injector, Type } from "@angular/core";
import { Router } from "@angular/router";

// https://robferguson.org/blog/2018/09/28/ionic-3-component-inheritance/
export class StaticInjectorService {
  private static injector: Injector;

  static setInjector(injector: Injector) {
    StaticInjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return StaticInjectorService.injector;
  }
}

/**
 * @name AbstractPage
 * @classdesc An abstract implementation of a Page already implementing basic
 * features most Pages might use. To fire those features only this classes
 * constructor must be called with the desired options.
 *
 * https://robferguson.org/blog/2018/09/28/ionic-3-component-inheritance/
 */
export abstract class AbstractPage {
  logger: Logger;

  protected loggingService: LoggingService;
  protected router: Router;

  protected constructor() {
    const injector: Injector = StaticInjectorService.getInjector();
    this.router = injector.get<Router>(Router as Type<Router>);
    this.loggingService = injector.get<LoggingService>(
      LoggingService as Type<LoggingService>
    );
    this.logger = this.loggingService.getLogger("[" + this.router.url + "]");
  }
}

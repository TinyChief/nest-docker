import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './shared/shared.module'
import { ConfigurationService } from './shared/configuration/configuration.service'
import { Configuration } from './shared/configuration/configuration.enum'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { TodoModule } from './todo/todo.module'

@Module({
    imports: [SharedModule, MongooseModule.forRoot(ConfigurationService.connectionString), UserModule, TodoModule],
    providers: [AppService],
    controllers: [AppController]
})

export class AppModule {
  static host: string
  static port: number | string
  static isDev: boolean

  constructor (private readonly _configurationService: ConfigurationService) {
      AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT))
      AppModule.host = _configurationService.get(Configuration.HOST)
      AppModule.isDev = _configurationService.isDevelopment
  }

  private static normalizePort (param: number | string): number | string {
      const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param

      if (isNaN(portNumber)) return param
      else if (portNumber >= 0) return portNumber
  }
}

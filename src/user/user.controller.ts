import {
    Controller, Post, HttpStatus, Body, HttpException
} from '@nestjs/common'
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { User } from './models/user.model'
import { UserService } from './user/user.service'
import { ApiExcetion } from '../shared/api-exception.model'
import { GetOperationId } from '../shared/utilities/get-operation-id'
import { RegisterVm } from './models/view-models/register-vm.model'
import { UserVm } from './models/view-models/user-vm.model'
import { InstanceType } from 'typegoose'
import { LoginResponseVm } from './models/view-models/login-response-vm.model'
import { LoginVm } from './models/view-models/login-vm.model'

@Controller('users')
@ApiUseTags(User.modelName)
export class UserController {
    constructor (private readonly _userService: UserService) {}

    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(User.modelName, 'Register'))
    async register (@Body() registerVm: RegisterVm): Promise<UserVm> {
        const { username } = registerVm

        if (!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST)
        }

        let exist: false | InstanceType<User>
        try {
            exist = await this._userService.findOne({ username })
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        if (exist) {
            throw new HttpException(`${username} is already exists`, HttpStatus.BAD_REQUEST)
        }

        const newUser = await this._userService.register(registerVm)
        return newUser
    }

    @Post('login')
    @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(User.modelName, 'Login'))
    async login (@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
        const fields = Object.keys(loginVm)
        fields.forEach(field => {
            if (!loginVm[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST)
            }
        })

        return this._userService.login(loginVm)
    }
}

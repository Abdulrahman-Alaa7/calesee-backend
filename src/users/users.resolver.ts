import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse,
  UpdatePasswordResponse,
} from '../types/user.types';
import {
  ActivationDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  // @UseGuards(AuthGuard)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  // @UseGuards(AuthGuard)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.usersService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: { req: any; res: any },
  ): Promise<LoginResponse> {
    const result: any = await this.usersService.Login({ email, password });

    if (result.error) {
      return { user: null, error: result.error };
    }

    if (context.res) {
      context.res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      context.res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return {
      user: result.user,
    };
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Context() context: { req: any; res: any },
  ): Promise<LoginResponse> {
    const refreshToken = context.req.cookies['refresh_token'];

    if (!refreshToken) {
      return { user: null, error: { message: 'No refresh token provided' } };
    }

    const result: any = await this.usersService.refreshToken(refreshToken);

    if (result.error) {
      return { user: null, error: result.error };
    }

    if (context.res) {
      context.res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 60 * 1000,
      });

      context.res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
    }

    return {
      user: result.user,
    };
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(
    @Context() context: { req: any },
  ): Promise<LoginResponse> {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => LogoutResponse)
  async logOutUser(
    @Context() context: { req: any; res?: any },
  ): Promise<LogoutResponse> {
    const result = await this.usersService.Logout();

    if (context.res) {
      context.res.clearCookie('access_token');
      context.res.clearCookie('refresh_token');
    } else {
      console.warn('Response object is not available in context');
    }

    return result;
  }

  @Query(() => [User])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Mutation(() => UpdatePasswordResponse)
  @UseGuards(AuthGuard)
  async updatePassword(
    @Args('updatePasswordDto') updatePasswordDto: UpdatePasswordDto,
    @Context() context: { req: Request },
  ): Promise<UpdatePasswordResponse> {
    return await this.usersService.updatePassword(
      context.req,
      updatePasswordDto,
    );
  }
}

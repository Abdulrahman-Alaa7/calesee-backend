import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import {
  // ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  // RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { TokenSender } from '../utils/sendToken';
import { User } from '../../prisma/generated/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // async register(registerDto: RegisterDto, response: Response) {
  //   const { name, email, password, role } = registerDto;

  //   const isEmailExist = await this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (isEmailExist) {
  //     throw new BadRequestException('User already exist with this email!');
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const user: any = {
  //     name,
  //     email,
  //     password: hashedPassword,
  //     role,
  //   };

  //   const activationToken = await this.createActivationToken(user);

  //   const activationCode = activationToken.activationCode;

  //   const activation_token = activationToken.token;

  //   await this.emailService.sendMail({
  //     email,
  //     subject: 'Activate your account!',
  //     template: './activation-mail',
  //     name,
  //     activationCode,
  //   });

  //   return { activation_token, response };
  // }

  // async createActivationToken(user: User) {
  //   const activationCode = Math.floor(
  //     100000 + Math.random() * 900000,
  //   ).toString();

  //   const token = this.jwtService.sign(
  //     {
  //       user,
  //       activationCode,
  //     },
  //     {
  //       secret: this.configService.get<string>('ACTIVATION_SECRET'),
  //       expiresIn: '5m',
  //     },
  //   );
  //   return { token, activationCode };
  // }

  // async activateUser(activationDto: ActivationDto, response: Response) {
  //   const { activationToken, activationCode } = activationDto;

  //   const newUser: { user: User; activationCode: string } =
  //     this.jwtService.verify(activationToken, {
  //       secret: this.configService.get<string>('ACTIVATION_SECRET'),
  //     } as JwtVerifyOptions) as { user: User; activationCode: string };

  //   if (newUser.activationCode !== activationCode) {
  //     throw new BadRequestException('Invalid activation code');
  //   }

  //   const { name, email, password, role } = newUser.user;

  //   const existUser = await this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (existUser) {
  //     throw new BadRequestException('User already exist with this email!');
  //   }

  //   const user = await this.prisma.user.create({
  //     data: {
  //       name,
  //       email,
  //       password,
  //       role,
  //     },
  //   });

  //   return { user, response };
  // }

  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_DASHBOARD_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: `Your forgot password request succesful!` };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    let decoded;
    try {
      decoded = this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return { user };
  }

  async getLoggedInUser(req: any) {
    const user = req.user;
    return { user };
  }

  async Logout() {
    return { message: 'Logged out successfully!' };
  }

  async getUsers() {
    return await this.prisma.user.findMany({});
  }

  async updatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;
    const userId = req.user.id;
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Please enter old and new password!');
    }

    const userPass = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (userPass?.password === undefined) {
      throw new BadRequestException('Invalid user!');
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      userPass.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid current password!');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }
}

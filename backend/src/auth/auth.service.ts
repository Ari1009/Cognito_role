import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { email } = sendOtpDto;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        otp,
        otpExpiry,
        isVerified: false,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await this.userRepository.save(user);

    // Send OTP via email
    await this.emailService.sendOtpEmail(email, otp);

    return {
      message: 'OTP sent successfully to your email',
      email,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'OTP verified successfully',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

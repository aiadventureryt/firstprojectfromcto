import { Injectable } from '@nestjs/common';
import { LoginRequest, RegisterRequest, AuthResponse, AuthTokens, User } from '@workspace/shared';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginRequest): Promise<AuthResponse> {
    // Mock authentication - in real app, verify against database
    if (loginDto.email === 'user@example.com' && loginDto.password === 'password') {
      const user: User = {
        id: '1',
        email: loginDto.email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          notifications: true,
          newsletter: false,
          theme: 'light',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const tokens = await this.generateTokens(user);
      return { user, tokens };
    }

    throw new Error('Invalid credentials');
  }

  async register(registerDto: RegisterRequest): Promise<AuthResponse> {
    // Mock registration - in real app, create user in database
    const user: User = {
      id: Date.now().toString(),
      email: registerDto.email,
      name: registerDto.name,
      preferences: {
        notifications: true,
        newsletter: false,
        theme: 'light',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      const newTokens = await this.generateTokens({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      } as User);

      return newTokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'access-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
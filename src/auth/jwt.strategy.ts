import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // same secret you set in JwtModule
      secretOrKey: process.env.JWT_SECRET || 'super_secret_change_me',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // This becomes req.user
    return { userId: payload.sub, email: payload.email };
  }
}

import crypto from "crypto";

import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { PasswordResetRepository } from "../repositories/passwordReset.repository";

import { hashPassword, comparePassword } from "../utils/password.utils";

import { signAccessToken, signRefreshToken } from "../utils/jwt.utils";

import { generateOrganizationId } from "../utils/organization.utils";

import {
  ConflictError,
  UnauthorizedError,
  LockedError,
  NotFoundError,
} from "../common/errors";

import {
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION_MINUTES,
  DUMMY_BCRYPT_HASH,
} from "../constants/auth.constants";

//Class Skeleton
export class AuthService {
  constructor(
    private userRepository = new UserRepository(),
    private refreshTokenRepository = new RefreshTokenRepository(),
    private passwordResetRepository = new PasswordResetRepository(),
  ) {}

  //Method 1: generateTokenPair()
  private async generateTokenPair(user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  }) {
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  //Method 2: checkAccountLockout()
  // 5 failed attempts
  // lock account
  // return 423 Locked

  private checkAccountLockout(user: { lockUntil: Date | null }) {
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new LockedError("Account is temporarily locked");
    }
  }

  //Method 3: incrementFailedAttempts()
  private async incrementFailedAttempts(user: {
    id: string;
    loginAttempts: number;
  }) {
    const attempts = user.loginAttempts + 1;

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date();

      lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_DURATION_MINUTES);

      await this.userRepository.update(user.id, {
        loginAttempts: attempts,
        lockUntil,
      });

      return;
    }

    await this.userRepository.update(user.id, {
      loginAttempts: attempts,
    });
  }

  //Method 4: register()
  async register(data: { email: string; username: string; password: string }) {
    //debug logs do not use in production

    // console.log("REGISTER DATA:", data);
    // console.log("USER REPO:", this.userRepository);
    
    const existingEmail = await this.userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new ConflictError("Email already exists");
    }

    const existingUsername = await this.userRepository.findByUsername(
      data.username,
    );

    if (existingUsername) {
      throw new ConflictError("Username already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.userRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
      organizationId: generateOrganizationId(),
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  //Method 5: login()
  async login(data: { username: string; password: string }) {
    const user = await this.userRepository.findByUsername(data.username);

    if (!user) {
      await comparePassword(data.password, DUMMY_BCRYPT_HASH);

      throw new UnauthorizedError("Invalid credentials");
    }

    this.checkAccountLockout(user);

    const validPassword = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!validPassword) {
      await this.incrementFailedAttempts(user);

      throw new UnauthorizedError("Invalid credentials");
    }

    await this.userRepository.update(user.id, {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date(),
    });

    const tokens = await this.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    const refreshHash = await hashPassword(tokens.refreshToken);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}

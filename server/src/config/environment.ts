import { CookieConfig } from '../types';

// Environment configuration with validation
export class EnvironmentConfig {
  // Server configuration
  static readonly PORT = process.env.PORT || '3000';
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  static readonly BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  // Database configuration
  static readonly DATABASE_URL = process.env.DATABASE_URL;

  // JWT configuration
  static readonly JWT_SECRET = process.env.JWT_SECRET;
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

  // Cookie configuration
  static readonly COOKIE_SESSION_KEYS = [
    process.env.COOKIE_KEY_1 || 'fallback-key-1-change-in-production',
    process.env.COOKIE_KEY_2 || 'fallback-key-2-change-in-production'
  ];

  // OAuth configuration
  static readonly GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  static readonly GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  static readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  static readonly GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  // Frontend configuration
  static readonly FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Email configuration
  static readonly EMAIL_HOST = process.env.EMAIL_HOST;
  static readonly EMAIL_PORT = process.env.EMAIL_PORT;
  static readonly EMAIL_USER = process.env.EMAIL_USER;
  static readonly EMAIL_PASS = process.env.EMAIL_PASS;
  static readonly EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@linkmanager.com';

  // IP Info configuration
  static readonly IP_INFO_TOKEN = process.env.IP_INFO_TOKEN;

  // Validate required environment variables
  static validateConfig(): void {
    const requiredEnvVars = [
      { key: 'DATABASE_URL', value: this.DATABASE_URL },
      { key: 'JWT_SECRET', value: this.JWT_SECRET }
    ];

    const missingVars = requiredEnvVars.filter(envVar => !envVar.value);
    
    if (missingVars.length > 0) {
      const missingKeys = missingVars.map(v => v.key).join(', ');
      throw new Error(`Missing required environment variables: ${missingKeys}`);
    }

    // Warn about fallback values in production
    if (this.NODE_ENV === 'production') {
      if (this.COOKIE_SESSION_KEYS.includes('fallback-key-1-change-in-production')) {
        console.warn('WARNING: Using fallback cookie keys in production! Set COOKIE_KEY_1 and COOKIE_KEY_2');
      }
    }
  }

  // Get cookie configuration
  static getCookieConfig(name: string): CookieConfig {
    return {
      name,
      keys: this.COOKIE_SESSION_KEYS,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: this.NODE_ENV === 'production'
    };
  }
}

// Validate configuration on module load
EnvironmentConfig.validateConfig();

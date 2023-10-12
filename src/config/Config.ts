import * as dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

export class AppConfig {
    timeToUpdate: number
    pricePerMinute: number
    port: number

    constructor() {
        this.timeToUpdate = parseInt(process.env.TIME_TO_UPDATE || '10', 10)
        this.pricePerMinute = parseInt(process.env.PRICE_PER_MINUTE || '10', 10)
        this.port = parseInt(process.env.NODE_APP_PORT || "3000", 10)
    }
}

export class AuthConfig {
    jwtSecret: string;
    expiresIn: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-default-jwt-secret';
        this.expiresIn = process.env.EXPIRES_IN || '55s';
    }
}

export class EncryptConfig {
    salt: number;

    constructor() {
        this.salt = parseInt(process.env.SALT || '10', 10);
    }
}

export class Config {
    app: AppConfig;
    auth: AuthConfig;
    encrypt: EncryptConfig;

    constructor() {
        this.app = new AppConfig();
        this.auth = new AuthConfig();
        this.encrypt = new EncryptConfig();
    }
}

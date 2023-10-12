type ErrorType = "Application" | "Service";
type AppErrorType = {
    [key: string]: { message: string; status: number, type: ErrorType };
};
export class CustomError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message);
        this.name = "CustomError";
        this.status = status;
    }
}

export class AppError {
    static errors: AppErrorType = {
        userNotFound: { message: "User not found", status: 404, type: "Application" },
        emailOrPasswordAlreadyExists: { message: "Email or password already exists", status: 409, type: "Application" },
        emailOrPasswordNotFound: { message: "Email or password not found", status: 401, type: "Application" },
        planetNotFound: { message: "Planet not found", status: 404, type: "Application" },
        stationNotFound: { message: "Station not found", status: 404, type: "Application" },
        stationAlreadyExists: { message: "Station already exists", status: 409, type: "Application" },
        stationIsAlreadyCharging: { message: "Station is already charging, come back later", status: 409, type: "Application" },
        invalidEndTime: { message: "Invalid end time", status: 400, type: "Application" },
        conflictTimeWithReservedCharge: { message: "Conflict time with reserved charge", status: 409, type: "Application" },
        UserAlreadyChargingASpacecraft: { message: "User is already charging a spacecraft", status: 409, type: "Application" },
        rechargeNotFound: { message: "Recharge not found", status: 404, type: "Application" },
        internalError: { message: "Internal error", status: 500, type: "Application" },
        invalidPageParameter: { message: "Page should be greater or equal to 0", status: 400, type: "Application" },
        authenticationTokenRequired: { message: "Authentication token is required", status: 401, type: "Application" },
        tokenNotDefinedCorrectly: { message: "Token is not defined correctly", status: 401, type: "Application" },
        userNotLogged: { message: "User is not logged", status: 401, type: "Application" },
        invalidOrExpiredToken: { message: "Token JWT is invalid or expired", status: 401, type: "Application" },
        someServiceError: { message: "Some service error", status: 500, type: "Service" },
        anotherServiceError: { message: "Another service error", status: 500, type: "Service" },
    };

    static throw(errorCode: keyof typeof AppError.errors): never {
        const error = AppError.errors[errorCode];
        if (error) {
            throw new Error(`${errorCode}`);
        } else {
            throw new Error("Unknown error");
        }
    }
}

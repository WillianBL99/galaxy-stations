import { AppMessagesType } from "./Message"

export class AppError {
    static errors: AppMessagesType = {
        userNotFound: { message: "User not found", status: 404, type: "Application" },
        emailOrPasswordAlreadyExists: { message: "Email or password already exists", status: 409, type: "Application" },
        emailOrPasswordNotFound: { message: "Email or password not found", status: 401, type: "Application" },
        planetNotFound: { message: "Planet not found", status: 404, type: "Application" },
        stationNotFound: { message: "Station not found", status: 404, type: "Application" },
        stationAlreadyExists: { message: "Station already exists", status: 409, type: "Application" },
        stationIsAlreadyCharging: { message: "Station is already charging, come back later", status: 409, type: "Application" },
        invalidEndTime: { message: "Invalid end time", status: 400, type: "Application" },
        invalidTimeInterval: { message: "Invalid time interval", status: 400, type: "Application" },
        conflictTimeWithReservedCharge: { message: "Conflict time with reserved charge", status: 409, type: "Application" },
        UserAlreadyChargingASpacecraft: { message: "User is already charging a spacecraft", status: 409, type: "Application" },
        rechargeNotFound: { message: "Recharge not found", status: 404, type: "Application" },
        reservationAlreadyUsed: { message: "Reservation already used", status: 409, type: "Application" },
        reservationIsBeingUsed: { message: "Reservation is being used", status: 409, type: "Application" },
        reservationExpired: { message: "Reservation expired", status: 410, type: "Application" },
        scheduledChargingStartsAfterReservationTime: { message: "Charging is scheduled and can only start after the reservation start time", status: 412, type: "Application" },
        internalError: { message: "Internal error", status: 500, type: "Application" },
        invalidPageParameter: { message: "Page should be greater or equal to 0", status: 400, type: "Application" },
        authenticationTokenRequired: { message: "Authentication token is required", status: 401, type: "Application" },
        tokenNotDefinedCorrectly: { message: "Token is not defined correctly", status: 401, type: "Application" },
        userNotLogged: { message: "User is not logged", status: 401, type: "Application" },
        invalidOrExpiredToken: { message: "Token JWT is invalid or expired", status: 401, type: "Application" },
        someServiceError: { message: "Some service error", status: 500, type: "Service" },
        anotherServiceError: { message: "Another service error", status: 500, type: "Service" },
        invalidDateTime: { message: "Invalid date time", status: 400, type: "Application" },
        invalidRechargeRequest: { message: "Invalid recharge request", status: 400, type: "Application" },
    };

    static throw({ typeErr, error }: { typeErr: keyof typeof AppError.errors, error?: any }): never {
        const appErr = AppError.errors[typeErr];
        if (error) console.log(error);
        if (appErr) {
            throw new Error(`${typeErr}`);
        } else {
            throw new Error("Unknown error");
        }
    }
}

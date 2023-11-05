import { DateTime } from 'luxon';
import { AppError } from '../message/Errors';

export class HandleDate {
    static convertToUTC(originalDate: string, sourceTimeZone: string = 'UTC'): Date {
        const dateTime = DateTime.fromISO(originalDate, { zone: sourceTimeZone });
        if (!dateTime.isValid) {
            AppError.throw({ typeErr: "invalidDateTime" })
        }
        return dateTime.toJSDate();
    }
}
import { AppMessageType, AppMessagesType } from "./Message"

export class AppInfo {
    static message: AppMessagesType = {
        chargingInProgress: { message: "Charging in progress", status: 200, type: "Application" },
    };

    static get(message: keyof typeof AppInfo.message): AppMessageType {
        return AppInfo.message[message];
    }
}

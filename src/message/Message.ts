export type MessageType = "Application" | "Service";
export type AppMessageType = { message: string; status: number, type: MessageType }
export type AppMessagesType = {
    [key: string]: AppMessageType;
};
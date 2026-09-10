import { IsNotEmpty, IsOptional } from "class-validator";
import { Example } from "tsoa";
import { LogLevel, LogType } from "../enums/logs.enums";

export class CreateNewLogEntryDto {
    @IsNotEmpty({
        message: "Your full name is required",
    })
    @Example(LogType.message)
    type?: LogType;

    @IsOptional({
        message: "Your full name is required",
    })
    @Example(LogLevel.debug)
    level?: LogLevel;
}
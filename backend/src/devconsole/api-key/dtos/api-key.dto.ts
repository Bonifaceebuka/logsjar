import { IsNotEmpty } from "class-validator";
import { Example } from "tsoa";
import { API_KEY_ENVIRONMENTS } from "../enums/api-key.enums";

export class GenerateApiKeyDto {
    @IsNotEmpty({
        message: "API key name is required",
    })
    @Example("Production SDK")
    name!: string;

    @IsNotEmpty({
        message: "Your full name is required",
    })
    @Example(API_KEY_ENVIRONMENTS.PRODUCTION)
    environment!: API_KEY_ENVIRONMENTS;
}
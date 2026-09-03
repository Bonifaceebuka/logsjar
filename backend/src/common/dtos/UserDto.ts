import { Example } from 'tsoa';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({
        message: "Email is required",
    })
    @Example("boniface.dev@logsjar.com")

    @IsEmail({},{
        message: "Email is invalid!",
    })
    email!: string;

    @IsNotEmpty({
        message: "Your full name is required",
    })
    @Example("Boniface Agbo")
    full_name!: string;

    @IsNotEmpty({
        message: "Password is required",
    })
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: "Password should be a minimum of 8 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 special character" })
    @Example("logsjar.123@")
    password!: string;

    @IsBoolean({ message: "You must agree to the terms and conditions" })
    @Example(true)
    terms_and_conditions!: boolean;
}

export class LoginUserDto {
    @IsString({
        message: "Email is required",
    })
    @Example("boniface.dev@logsjar.com")
    @IsEmail()
    email!: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: "Password should be a minimum of 8 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 special character" })
    @Example("logsjar.123@")
    password!: string;

}

export class EmailVerificationDTO {
  @IsString({ message: "Verification token is required" })
  @Example("gdhjjgaklal;")
  verification_token?: string;

  @IsString({ message: "Verification hash is required" })
  @Example("8ada7a06-956f-488f-90c3-92ff6955393a")
  hash!: string;

  @IsString({ message: "Verification ref is required" })
  @Example("8ada7a06-956f-488f-90c3-92ff6955393a")
  ref!: string;
}

export class EmailOTPVerificationDTO {
    @IsString({ message: "Otp is required" })
    @Example("09996")
    otp!: string;
}

export class OnlyEmailDTO {
    @IsString({ message: "Email is required" })
    @Example("boniface.dev@Logsjar.com")
    email!: string;
}

export class SetNewPasswordRequestDTO {
  @IsString({ message: "Confirm password is required" })
  @Example("Logsjar.123@")
  confirm_password!: string;

  @IsString({ message: "New password is required" })
  @Example("Logsjar.123@")
  new_password!: string;
}

export class ValidatePasswordResetTokenDTO {
    @IsString({ message: "Password reset token is required" })
    @Example("gdhjjgaklal;")
    password_reset_token!: string;
}
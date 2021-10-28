import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsString, Length} from "class-validator";

@InputType('CreateUserInput')
export class CreateUserInput {
    @IsString()
    @IsEmail({}, {message: 'Incorrect email'})
    @Field()
    email: string

    @IsString()
    @Length(4, 20, {message: 'From 4 to 20'})
    @Field()
    password: string
}
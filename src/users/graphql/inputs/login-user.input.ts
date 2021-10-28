import { Field, InputType } from "@nestjs/graphql";

@InputType('LoginUserInput')
export class LoginUserInput {
    @Field()
    email: string

    @Field()
    password: string
}
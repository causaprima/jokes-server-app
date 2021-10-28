import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType('AuthType')
export class AuthType {
    @Field()
    accessToken: string

    @Field(() => String)
    tokenType = 'Bearer'

    @Field()
    expiresIn: number

    @Field()
    refreshToken?: string

    @Field({ nullable: true })
    idToken?: string

    constructor(partial?: Partial<AuthType>) {
        Object.assign(this, partial)
    }
}
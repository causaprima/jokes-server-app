import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType('UserType')
export class UserType {
    @Field()
    email: string
}
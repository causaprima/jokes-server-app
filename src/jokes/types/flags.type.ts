import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class Flags {
    @Field()
    nsfw: boolean

    @Field()
    religious: boolean

    @Field()
    political: boolean

    @Field()
    racist: boolean

    @Field()
    sexist: boolean

    @Field()
    explicit: boolean
}
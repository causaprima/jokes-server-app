import {Field, Int, ObjectType} from "@nestjs/graphql";
import {Flags} from "./flags.type";

@ObjectType()
export class Joke {
    @Field()
    error: boolean

    @Field()
    category: string

    @Field()
    type: string

    @Field()
    joke?: string

    @Field()
    setup?: string

    @Field()
    delivery?: string

    @Field()
    flags: Flags

    @Field(type => Int)
    id: number

    @Field()
    safe: boolean

    @Field()
    lang: string

}
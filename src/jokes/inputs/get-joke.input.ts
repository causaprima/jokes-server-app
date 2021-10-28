import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetJokeInput {
    @Field()
    category?: string = 'any'

    @Field()
    type: string
}

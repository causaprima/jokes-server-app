import {Args, Query, Resolver } from "@nestjs/graphql";
import {Joke} from "./types/joke.type";
import {JokesService} from "./jokes.service";
import {GetJokeInput} from "./inputs/get-joke.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Resolver()
export class JokesResolver {
    constructor(private jokesService: JokesService) {
    }

    @UseGuards(JwtAuthGuard)
    @Query(returns => Joke)
    joke(@Args('input') input: GetJokeInput): Promise<Joke> {
        return this.jokesService.getOneJoke(input)
    }
}
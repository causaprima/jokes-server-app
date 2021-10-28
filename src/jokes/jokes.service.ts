import { Injectable } from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {GetJokeInput} from "./inputs/get-joke.input";
import {Joke} from "./types/joke.type";

@Injectable()
export class JokesService {
    constructor(private httpService: HttpService) {
    }

    async getOneJoke(getJokeInput: GetJokeInput): Promise<Joke> {
        let jokeUrl = 'https://v2.jokeapi.dev/joke/'
        for (let key in getJokeInput) {
            if (key === 'category') {
                jokeUrl += getJokeInput.category
            }
            else {
                jokeUrl += `?${key}=${getJokeInput[key]}`
            }
        }
        return await this.httpService.get(jokeUrl).toPromise().then(response => response.data)
    }
}
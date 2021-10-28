import {Module} from "@nestjs/common";
import {JokesService} from "./jokes.service";
import {JokesResolver} from "./jokes.resolver";
import {HttpModule} from "@nestjs/axios";
import {AuthModule} from "../auth/auth.module";


@Module( {
    imports: [
        HttpModule,
        AuthModule
    ],
    providers: [
        JokesService,
        JokesResolver
    ]
})
export class JokesModule {}

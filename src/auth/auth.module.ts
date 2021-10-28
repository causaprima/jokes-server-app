import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthResolver} from "./auth.resolver";
import {UsersModule} from "../users/users.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshTokenEntity} from "./entities/refresh-token.entity";

@Module( {
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([
            RefreshTokenEntity
        ])
    ],
    providers: [
        AuthService,
        AuthResolver
    ],
    exports: [
        AuthService,
    ]
})
export class AuthModule {}


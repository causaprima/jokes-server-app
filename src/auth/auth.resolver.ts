import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthType } from "./types/auth.type";
import { UserType } from "../users/graphql/types/user.type";
import { CreateUserInput } from "../users/graphql/inputs/create-user.input";
import { LoginUserInput } from "../users/graphql/inputs/login-user.input";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => UserType)
    async signUp(@Args('input') input: CreateUserInput): Promise<UserType> {
        const response = await this.authService.signUp(input)

        return response
    }

    @Query(() => AuthType)
    async signIn(@Args('input') input: LoginUserInput) {
        const response = await this.authService.signIn(input)

        return response
    }

    @Mutation(() => AuthType)
    async refreshToken(
        @Args('refreshToken') refreshToken: string,
        @Args('accessToken') accessToken: string,
    ): Promise<AuthType> {
        return await this.authService.getAccessTokenFromRefreshToken(
            refreshToken,
            accessToken,
        )
    }
}
import {BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {AuthService} from "./auth.service";

export class RequestAuthorizationTokenHeader {
    'authorization': string
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const req: Request | any = ctx.getContext().req

        try {
            const {
                authorization: authorization,
            }: RequestAuthorizationTokenHeader = req.headers

            if (authorization == undefined) {
                throw new BadRequestException(
                    'GqlAuthorizationHeader: header authorization is empty',
                )
            }

            const verified = await this.authService.decodeToken(authorization)

            return !!verified
        } catch (e) {
            throw new Error(e)
            throw new UnauthorizedException({message: 'User is not authorized'})
        }

    }

}
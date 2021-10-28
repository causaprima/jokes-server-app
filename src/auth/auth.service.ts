import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserEntity} from "../users/enitites/user.entity";
import {UserDto} from "../users/dto/user.dto";
import {UsersService} from "../users/users.service";
import {genSalt, hash} from "bcryptjs"
import {AuthType} from "./types/auth.type";
import {InjectRepository} from "@nestjs/typeorm";
import {RefreshTokenEntity} from "./entities/refresh-token.entity";
import {JwtPayload} from "./interfaces/jwtpayload.interface";
import {RoleEnum} from "../users/graphql/enums/role.enum";
import {decode, sign, SignOptions, verify} from "jsonwebtoken";
import { v4 as Uuidv4 } from 'uuid'
import * as fs from "fs";
import { randomBytes } from "crypto";
import * as moment from 'moment'
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
    private readonly jwtOptions: SignOptions
    private readonly jwtPrivateKey
    private readonly jwtPublicKey
    private readonly tokenType: string
    private readonly expiresInSeconds: number
    private readonly refreshTokenTtl: number

    constructor(private readonly usersService: UsersService,
                @InjectRepository(RefreshTokenEntity)
                private readonly refreshTokenRepository: Repository<RefreshTokenEntity>)
    {
        this.jwtOptions = {
            expiresIn: this.expiresInSeconds,
            algorithm: 'RS256',
        }

        this.jwtPrivateKey = fs.readFileSync(
            `${process.cwd()}/assets/private.key`,
        )

        this.jwtPublicKey = fs.readFileSync(
            `${process.cwd()}/assets/public.key`,
        )

        this.tokenType = 'Bearer'

        this.expiresInSeconds = 600

        this.refreshTokenTtl = 1

    }

    async signUp(input: UserDto): Promise<UserEntity> {
        const candidate = await this.usersService.getUserByEmail(input.email)

        if (candidate) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        }

        const hashedPassword = await this.hashPassword(input.password)

        const user = await this.usersService.createUser({...input, password: hashedPassword})

        return user
    }

    async signIn(input: UserDto) {
        const user = await this.usersService.login(input)

        const { id } = user

        const payload: JwtPayload = {
            sub: id,
            role: RoleEnum.USER
        }

        const jwt = await this.createJWT(payload)

        return jwt
    }

    protected async hashPassword(password: string): Promise<string> {
        const ROUNDS = 12
        const salt = await genSalt(ROUNDS)

        return await hash(password, salt)
    }

    protected async createJWT(payload: JwtPayload): Promise<AuthType> {
        const jwt = await this.createAccessToken(payload)
        jwt.refreshToken = await this.createRefreshToken(payload.sub)

        return jwt
    }

    protected async createAccessToken(
        payload: JwtPayload,
        expires = this.expiresInSeconds): Promise<AuthType>
    {
        const options = this.jwtOptions
        options.expiresIn = expires
        options.jwtid = Uuidv4()

        const signedPayload = sign(payload, this.jwtPrivateKey, options)

        return {
            accessToken: signedPayload,
            expiresIn: expires,
            tokenType: this.tokenType
        } as AuthType
    }

    protected async createRefreshToken(userId: string): Promise<string> {
        const REFRESH_TOKEN_LENGTH = 64
        const refreshToken = randomBytes(REFRESH_TOKEN_LENGTH).toString('hex')
        const token = {
            userId,
            token: refreshToken,
            expiresAt: moment().add(this.refreshTokenTtl, 'd').toDate(),
        }
        const newRefreshToken = await this.refreshTokenRepository.create(token)
        await this.refreshTokenRepository.save(newRefreshToken)

        return newRefreshToken.token
    }

    async verifyToken(token: string): Promise<{ isVerified: boolean }> {
        verify(token, this.jwtPublicKey)
        return {
            isVerified: true,
        }
    }

    async getAccessTokenFromRefreshToken(refreshToken: string, oldAccessToken: string): Promise<AuthType> {
        const token = await this.refreshTokenRepository.findOne({
            token: refreshToken,
        })
        const currentDate = new Date()
        if (!token) {
            throw new Error('Refresh token not found')
        }
        if (token.expiresAt < currentDate) {
            throw new Error('Refresh token expired')
        }
        const oldPayload = await this.decodeToken(oldAccessToken)

        const payload: JwtPayload = {
            sub: oldPayload.sub,
            role: oldPayload.role,
        }

        const jwt = await this.createJWT(payload)

        await this.refreshTokenRepository.delete({ id: token.id })

        return jwt
    }

    async decodeToken(token: string): Promise<JwtPayload> {
        const response = await this.verifyToken(token)
        if (response.isVerified) {
            const parsedToken = await decode(token)
            return Object(parsedToken)
        }
        return undefined
    }
}
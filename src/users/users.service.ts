import {Injectable, UnauthorizedException} from "@nestjs/common";
import { compare } from "bcryptjs"
import { UserEntity } from "./enitites/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

    async createUser(input: UserDto): Promise<UserEntity> {
        const newUser = await this.usersRepository.create(input)

        return this.usersRepository.save(newUser)
    }

    async login(input: UserDto): Promise<UserEntity> {
        const { email, password } = input
        const user = await this.usersRepository.findOne({
            email,
        })

        if (!user) {
            throw new UnauthorizedException({message: 'Wrong email'})
        }

        const passwordCompare = await compare(password, user.password)

        if (!passwordCompare) {
            throw new UnauthorizedException({message: 'Wrong password'})
        }

        return user
    }

    async getUserByEmail(email: string): Promise<UserEntity> {
        return await this.usersRepository.findOne({where: {email}})
    }
}
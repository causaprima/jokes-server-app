import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity('refresh_tokens')
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column()
    token: string

    @Column()
    expiresAt: Date
}
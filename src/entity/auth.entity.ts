import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class AuthUser {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({unique: true})
    userId: string;

    @Column()
    @Index({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;h

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()

    password: string;

    @AfterInsert()
    logInsert() {
        console.log('inserted user with id : ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated user with id : ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('User removed with id : ', this.id);
    }
}
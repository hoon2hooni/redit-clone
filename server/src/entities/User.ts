import { IsEmail, Length } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  OneToMany,
  BeforeInsert,
} from "typeorm";

import bcrypt from "bcryptjs";

@Entity()
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "Invalid email" })
  @Length(1, 255, { message: "Email too long" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: "Username too short" })
  @Column()
  username: string;

  @Column()
  @Length(6, 255, { message: "Password too short" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

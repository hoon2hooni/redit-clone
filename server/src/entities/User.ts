import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import BaseEntity from "./Entity";

import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";
@Entity()
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "Invalid email" })
  @Length(1, 255, { message: "Email too long" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: "Username too short" })
  @Column({ unique: true })
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

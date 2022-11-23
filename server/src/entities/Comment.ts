import BaseEntity from "./Entity";
import { Exclude, Expose } from "class-transformer";
import { Column, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import User from "./User";
import Post from "./Post";
import Vote from "./Vote";

export default class Comment extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(()=>Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;

  setUserVote(user:User) {
    const index = this.votes?.findIndex(v => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }
  
}
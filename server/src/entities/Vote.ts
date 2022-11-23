import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from "./Entity";
import User from "./User";
import Post from "./Post";
import Comment from "./Comment";

@Entity("votes")
export default class Vote extends BaseEntity {
  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post, (post) => post.votes)
  @JoinColumn({ name: "identifier", referencedColumnName: "identifier" })
  post: Post;

  @Column({ nullable: true })
  postId: string;

  @Column()
  commentId: string;

  @Column()
  @ManyToOne(() => Comment, (comment) => comment.votes)
  @JoinColumn({ name: "identifier", referencedColumnName: "identifier" })
  comment: Comment;
}

import * as argon2 from "argon2";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

@ObjectType()
@Entity()
export default class User {
  
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ type: "text", default: UserRole.USER }) // Stocke en texte au lieu d'un ENUM
  role: string; 

  @BeforeInsert()
  protected async hashPassword() {
    console.log("🚀 @BeforeInsert() - Hashing password...");
    this.password = await argon2.hash(this.password);
  }
}

@ObjectType()
export class UserWithoutPassword implements Omit<User, "password"> {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
export class Message {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class CheckTokenInfos {
  @Field()
  email: string;
}

//--------------------------------------------
// INPUT TYPES
//--------------------------------------------

@InputType()
export class InputRegister {
  @Field()
  email: string;
  
  @Field()
  password: string;
}

@InputType()
export class InputLogin {
  @Field()
  email: string;

  @Field()
  password: string;
}

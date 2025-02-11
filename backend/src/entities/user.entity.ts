import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class User {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({unique: true})
  email: string;

  @Field()
  @Column()
  password: string;
}

@ObjectType()
export class UserWithoutPassword implements Omit<User, "password"> {
  @Field()
  id: string;

  @Field()
  email: string;
}
//--------------------------------------------
// INPUT TYPE
//--------------------------------------------
@InputType()
export class InputRegister {
  @Field()
  email: string;
  
  @Field()
  password: string
}





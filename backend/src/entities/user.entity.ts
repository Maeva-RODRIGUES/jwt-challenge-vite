import * as argon2 from "argon2";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class User {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({unique: true, transformer: {
			from(value : string) {
		    return value.toLowerCase()
		  },
			to(value: string)  {
		    return value.toLowerCase() 
		  },
		}
	})
  email: string;

  @Field()
  @Column()
  password: string;

  @BeforeInsert()
  protected async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}

@ObjectType()
export class UserWithoutPassword implements Omit<User, "password"> {
  @Field()
  id: string;

  @Field()
  email: string;
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

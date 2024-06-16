import { FirebaseOptions } from "firebase/app";
import { IFirebase, FirebaseConfig } from "../config/firebaseConfig";
import { UserDto } from "./dto/user";

export interface IUserRepository {
  fetch(uid: string): Promise<Array<UserDto>>;
  update(user: UserDto): Promise<string>;
}

export class UserRepository implements IUserRepository {
  firebase: IFirebase;
  readonly userCollectionName: string = "users";

  constructor(firebase: IFirebase) {
    this.firebase = firebase;
  }

  public fetch = async (uid: string) => {
    const fs = this.firebase.fs();
    const response: UserDto[] = [];
    const doc = await fs.collection(this.userCollectionName).doc(uid).get();

    const data = doc.data();
    if (!data || data == undefined) {
      return response
    }

    const user: UserDto = {
      id: data.id,
      name: data.name,
      username: data.username,
      password: data.password,
    };

    response.push(user);

    return response;
  };

  public update = async (user: UserDto) => {
    const fs = this.firebase.fs();
    await fs.collection(this.userCollectionName).doc(user.id).set(user);

    return user.id;
  };
}

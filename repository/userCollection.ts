import { FirebaseOptions } from "firebase/app";
import { IFirebase, FirebaseConfig } from "../config/firebaseConfig";
import { UserDto } from "./dto/user";

export interface IUserRepository {
  fetch(): Promise<Array<UserDto>>;
  update(user: UserDto): Promise<string>;
}

export class UserRepository implements IUserRepository {
  firebase: IFirebase;
  readonly userCollectionName: string = "users";

  constructor(firebase: IFirebase) {
    this.firebase = firebase;
  }

  public fetch = async () => {
    const fs = this.firebase.fs();
    const response: UserDto[] = [];
    const snapshots = await fs.collection(this.userCollectionName).get();

    snapshots.forEach((doc) => {
      const data = doc.data();
      const user: UserDto = {
        id: data.id,
        name: data.name,
        username: data.username,
        password: data.password,
      };

      response.push(user);
    });

    return response;
  };

  public update = async (user: UserDto) => {
    const fs = this.firebase.fs();
    await fs.collection(this.userCollectionName).doc(user.id).set(user);

    return user.id;
  };
}

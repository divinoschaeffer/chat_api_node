import {User} from "../../../models/User";
import {getUserByEmail} from "../../../repositories/userRepository";
import bcrypt from "bcrypt";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {AuthentificationError} from "../../../utils/AuthentificationError";

export const handleLogin = async (value: any): Promise<User> => {
    const user: User|undefined = await getUserByEmail(value.email);
    if (user === undefined) {
        throw new RessourceNotFoundError("User with this email not found");
    }
    const valid = await bcrypt.compare(value.password, user.password);

    if (!valid) {
        throw new AuthentificationError("Wrong password");
    }
    return user;
}

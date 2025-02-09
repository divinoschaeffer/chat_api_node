import {User} from "../../../models/User";
import {getUserByEmail} from "../../../repositories/userRepository";
import bcrypt from "bcrypt";
import {RessourceNotFoundError} from "../../../utils/RessourceNotFoundError";
import {AuthenticationError} from "../../../utils/AuthenticationError";

export const handleLogin = async (value: any): Promise<User> => {
    const user: User|undefined = await getUserByEmail(value.email);
    if (user === undefined) {
        throw new RessourceNotFoundError("User with this email not found");
    }
    const valid = await bcrypt.compare(value.password, user.password);

    if (!valid) {
        throw new AuthenticationError("Wrong password");
    }
    return user;
}

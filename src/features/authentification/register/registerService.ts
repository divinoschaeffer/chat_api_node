import {isExisting, store} from "../../../repositories/userRepository";
import bcrypt from 'bcrypt';
import {User} from "../../../models/User";
import {AlreadyExistsError} from "../../../utils/AlreadyExistsError";

export const handleRegister = async (value: any) => {
    const exist  = await isExisting(value.name, value.email);

    if (exist) {
        throw new AlreadyExistsError("User with this name or email already exist");
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const user = new User(
        null,
        value.name,
        value.email,
        hashedPassword,
        false,
        new Date()
    );

    return store(user);
}

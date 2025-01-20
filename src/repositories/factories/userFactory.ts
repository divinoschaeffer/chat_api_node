import {User} from "../../models/User";

export const userFromDB = (result: any): User|null => {
    if (result.length === 0 ) return null;

    return new User(
        result.user_id,
        result.user_name,
        result.user_email,
        result.user_password,
        result.user_admin,
        result.user_created_at
    )
}
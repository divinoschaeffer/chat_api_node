import { userFromDB } from "../../../src/repositories/factories/userFactory";
import { User } from "../../../src/models/User";

describe("userFromDB", () => {
    it("should return null if the result array is empty", () => {
        const result: any[] = [];
        const user = userFromDB(result);
        expect(user).toBeNull();
    });

    it("should return a User object with the correct properties when result is valid", () => {
        const result = {
            user_id: 1,
            user_name: "John Doe",
            user_email: "johndoe@example.com",
            user_password: "hashed_password",
            user_admin: true,
            user_created_at: new Date("2023-01-01"),
        };

        const user = userFromDB(result);

        expect(user).toBeInstanceOf(User);
        expect(user).toEqual(
            new User(
                1,
                "John Doe",
                "johndoe@example.com",
                "hashed_password",
                true,
                new Date("2023-01-01")
            )
        );
    });
});

import { handleSearchUser} from "../../../../src/features/user/get/getUserService";
import { getUserByName } from "../../../../src/repositories/userRepository";
import { createPublicDtoFromUser, PublicUserDTO } from "../../../../src/models/PublicUserDTO";
import { User } from "../../../../src/models/User";

jest.mock("../../../../src/repositories/userRepository");
jest.mock("../../../../src/models/PublicUserDTO");

describe("handleSearchUser", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a PublicUserDTO when a user is found", async () => {
        const mockUser: User = {
            id: 1,
            name: "testUser",
            email: "test@example.com",
            password: "hashedPassword", // Assuming this field exists in the `User` model
            admin: false,
            created_at: new Date()
        };
        const mockPublicUser: PublicUserDTO = {
            id: 1,
            name: "testUser",
        };

        (getUserByName as jest.Mock).mockResolvedValue(mockUser);
        (createPublicDtoFromUser as jest.Mock).mockReturnValue(mockPublicUser);

        const result = await handleSearchUser("testUser");

        expect(getUserByName).toHaveBeenCalledWith("testUser");
        expect(createPublicDtoFromUser).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual(mockPublicUser);
    });

    it("should return null when no user is found", async () => {
        (getUserByName as jest.Mock).mockResolvedValue(undefined);

        const result = await handleSearchUser("unknownUser");

        expect(getUserByName).toHaveBeenCalledWith("unknownUser");
        expect(createPublicDtoFromUser).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it("should throw an error if getUserByName rejects", async () => {
        const mockError = new Error("Database error");
        (getUserByName as jest.Mock).mockRejectedValue(mockError);

        await expect(handleSearchUser("testUser")).rejects.toThrow("Database error");

        expect(getUserByName).toHaveBeenCalledWith("testUser");
        expect(createPublicDtoFromUser).not.toHaveBeenCalled();
    });
});

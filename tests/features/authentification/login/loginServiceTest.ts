import { handleLogin } from "../../../../src/features/authentication/login/loginService";
import { getUserByEmail } from "../../../../src/repositories/userRepository";
import bcrypt from "bcrypt";
import { RessourceNotFoundError } from "../../../../src/utils/RessourceNotFoundError";
import { User } from "../../../../src/models/User";
import {AuthenticationError} from "../../../../src/utils/AuthenticationError";

jest.mock("../../../../src/repositories/userRepository");
jest.mock("bcrypt");

describe("handleLogin", () => {
    const mockInput = {
        email: "test@example.com",
        password: "securepassword",
    };

    const mockUser: User = {
        id: 1,
        name: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        admin: false,
        created_at: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw RessourceNotFoundError if the user is not found", async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(undefined);

        await expect(handleLogin(mockInput)).rejects.toThrow(RessourceNotFoundError);
        expect(getUserByEmail).toHaveBeenCalledWith(mockInput.email);
    });

    it("should throw authenticationError if the password is incorrect", async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(handleLogin(mockInput)).rejects.toThrow(AuthenticationError);
        expect(getUserByEmail).toHaveBeenCalledWith(mockInput.email);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockInput.password, mockUser.password);
    });

    it("should return the user if email and password are correct", async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await handleLogin(mockInput);

        expect(getUserByEmail).toHaveBeenCalledWith(mockInput.email);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockInput.password, mockUser.password);
        expect(result).toEqual(mockUser);
    });

    it("should handle unexpected errors gracefully", async () => {
        const unexpectedError = new Error("Unexpected error");
        (getUserByEmail as jest.Mock).mockRejectedValue(unexpectedError);

        await expect(handleLogin(mockInput)).rejects.toThrowError("Unexpected error");
        expect(getUserByEmail).toHaveBeenCalledWith(mockInput.email);
    });
});

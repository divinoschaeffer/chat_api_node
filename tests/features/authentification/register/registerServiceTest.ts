import {handleRegister} from "../../../../src/features/authentification/register/registerService";
import {isExisting, store} from "../../../../src/repositories/userRepository";
import {AlreadyExistsError} from "../../../../src/utils/AlreadyExistsError";
import bcrypt from "bcrypt";
import {User} from "../../../../src/models/User";
import useFakeTimers = jest.useFakeTimers;

jest.mock("../../../../src/repositories/userRepository");
jest.mock("bcrypt");
jest.mock("../../../../src/repositories/userRepository");

describe("handleRegister", () => {
    const mockUserInput = {
        name: "testuser",
        email: "test@example.com",
        password: "securepassword",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    useFakeTimers();
    jest.setSystemTime(new Date());

    it("should throw an AlreadyExistsError if the user already exists", async () => {
        (isExisting as jest.Mock).mockResolvedValue(true);

        await expect(handleRegister(mockUserInput)).rejects.toThrow(AlreadyExistsError);
        expect(isExisting).toHaveBeenCalledWith(mockUserInput.name, mockUserInput.email);
    });

    it("should hash the password and store the user if they do not exist", async () => {
        (isExisting as jest.Mock).mockResolvedValue(false);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
        (store as jest.Mock).mockResolvedValue({ id: "123" });

        const user = await handleRegister(mockUserInput);

        expect(isExisting).toHaveBeenCalledWith(mockUserInput.name, mockUserInput.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(store).toHaveBeenCalledWith(
            expect.objectContaining(new User(
                null,
                "testuser",
                "test@example.com",
                "hashedpassword",
                false,
                new Date()
            ))
        );
        expect(user).toEqual({ id: "123" });
    });

    it("should handle unexpected errors", async () => {
        const unexpectedError = new Error("Unexpected error");
        (isExisting as jest.Mock).mockRejectedValue(unexpectedError);

        await expect(handleRegister(mockUserInput)).rejects.toThrowError("Unexpected error");
        expect(isExisting).toHaveBeenCalledWith(mockUserInput.name, mockUserInput.email);
    });
});

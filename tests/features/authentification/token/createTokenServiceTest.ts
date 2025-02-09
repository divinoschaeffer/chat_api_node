import { handleCreateToken } from "../../../../src/features/authentication/token/createTokenService";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("handleCreateToken", () => {
    const mockUserId = 123;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should generate a token if PRIVATE_KEY is set", () => {
        const mockPrivateKey = "mockPrivateKey";
        process.env.PRIVATE_KEY = mockPrivateKey;

        const mockToken = "mocked-token";
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const token = handleCreateToken(mockUserId);

        expect(jwt.sign).toHaveBeenCalledWith(
            { data: mockUserId },
            mockPrivateKey,
            { expiresIn: "1d" }
        );
        expect(token).toEqual(mockToken);
    });

    it("should throw an error if PRIVATE_KEY is not set", () => {
        delete process.env.PRIVATE_KEY;

        expect(() => handleCreateToken(mockUserId)).toThrow("PRIVATE_KEY not set");
    });

    it("should propagate unexpected errors from jwt.sign", () => {
        const mockPrivateKey = "mockPrivateKey";
        process.env.PRIVATE_KEY = mockPrivateKey;

        const unexpectedError = new Error("Unexpected error");
        (jwt.sign as jest.Mock).mockImplementation(() => {
            throw unexpectedError;
        });

        expect(() => handleCreateToken(mockUserId)).toThrow("Unexpected error");
        expect(jwt.sign).toHaveBeenCalledWith(
            { data: mockUserId },
            mockPrivateKey,
            { expiresIn: "1d" }
        );
    });
});

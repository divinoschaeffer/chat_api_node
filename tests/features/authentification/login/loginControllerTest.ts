import { login } from "../../../../src/features/authentification/login/loginController";
import loginSchema from "../../../../src/validationSchema/loginSchema";
import { handleLogin } from "../../../../src/features/authentification/login/loginService";
import { handleCreateToken } from "../../../../src/features/authentification/token/createTokenService";
import { createDtoFromUser } from "../../../../src/models/UserDTO";
import { RessourceNotFoundError } from "../../../../src/utils/RessourceNotFoundError";
import { Request, Response } from "express";

jest.mock("../../../../src/validationSchema/loginSchema");
jest.mock("../../../../src/features/authentification/login/loginService");
jest.mock("../../../../src/features/authentification/token/createTokenService");
jest.mock("../../../../src/models/UserDTO");

describe("login", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "securepassword",
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it("should log in a user and return a token", async () => {
        const user = { id: "123", email: "test@example.com", name: "testuser" };
        const token = "mocked-token";
        const dto = { id: "123", email: "test@example.com", name: "testuser" };

        (loginSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleLogin as jest.Mock).mockResolvedValue(user);
        (handleCreateToken as jest.Mock).mockReturnValue(token);
        (createDtoFromUser as jest.Mock).mockReturnValue(dto);

        await login(req as Request, res as Response);

        expect(loginSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleLogin).toHaveBeenCalledWith(req.body);
        expect(handleCreateToken).toHaveBeenCalledWith(user.id);
        expect(createDtoFromUser).toHaveBeenCalledWith(user);
        expect(res.json).toHaveBeenCalledWith({ user: dto, token });
    });

    it("should return 400 if validation fails", async () => {
        const validationError = new Error("Validation failed");
        (validationError as any).isJoi = true;

        (loginSchema.validateAsync as jest.Mock).mockRejectedValue(validationError);

        await login(req as Request, res as Response);

        expect(loginSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Bad Request",
            details: validationError.message,
        });
    });

    it("should return 404 if the user is not found", async () => {
        const notFoundError = new RessourceNotFoundError("User not found");

        (loginSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleLogin as jest.Mock).mockRejectedValue(notFoundError);

        await login(req as Request, res as Response);

        expect(loginSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleLogin).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Ressource not found",
            details: notFoundError.message,
        });
    });

    it("should return 500 for an unexpected error", async () => {
        const unexpectedError = new Error("Unexpected error");

        (loginSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleLogin as jest.Mock).mockRejectedValue(unexpectedError);

        await login(req as Request, res as Response);

        expect(loginSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleLogin).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
            error: unexpectedError.message,
        });
    });
});

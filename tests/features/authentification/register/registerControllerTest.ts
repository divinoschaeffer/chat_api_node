import { register } from "../../../../src/features/authentification/register/registerController";
import createUserSchema from "../../../../src/validationSchema/createUserSchema";
import { handleRegister } from "../../../../src/features/authentification/register/registerService";
import { handleCreateToken } from "../../../../src/features/authentification/token/createTokenService";
import { createDtoFromUser } from "../../../../src/models/UserDTO";
import { AlreadyExistsError } from "../../../../src/utils/AlreadyExistsError";
import { Request, Response } from "express";

jest.mock("../../../../src/validationSchema/createUserSchema");
jest.mock("../../../../src/features/authentification/register/registerService");
jest.mock("../../../../src/features/authentification/token/createTokenService");
jest.mock("../../../../src/models/UserDTO");

describe("register", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                name: "testuser",
                email: "test@example.com",
                password: "securepassword",
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it("should register a user and return a token", async () => {
        const user = { id: "123", username: "testuser", email: "test@example.com" };
        const token = "mocked-token";
        const dto = { id: "123", username: "testuser", email: "test@example.com" };

        (createUserSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleRegister as jest.Mock).mockResolvedValue(user);
        (handleCreateToken as jest.Mock).mockReturnValue(token);
        (createDtoFromUser as jest.Mock).mockReturnValue(dto);

        await register(req as Request, res as Response);

        expect(createUserSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleRegister).toHaveBeenCalledWith(req.body);
        expect(handleCreateToken).toHaveBeenCalledWith(user.id);
        expect(createDtoFromUser).toHaveBeenCalledWith(user);
        expect(res.json).toHaveBeenCalledWith({ user: dto, token });
    });

    it("should return 400 if validation fails", async () => {
        const validationError = new Error("Validation failed");
        (validationError as any).isJoi = true;

        (createUserSchema.validateAsync as jest.Mock).mockRejectedValue(validationError);

        await register(req as Request, res as Response);

        expect(createUserSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Bad Request",
            details: validationError.message,
        });
    });

    it("should return 403 if user already exists", async () => {
        const alreadyExistsError = new AlreadyExistsError("User already exists");

        (createUserSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleRegister as jest.Mock).mockRejectedValue(alreadyExistsError);

        await register(req as Request, res as Response);

        expect(createUserSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleRegister).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Resource already exist",
            details: alreadyExistsError.message,
        });
    });

    it("should return 500 for an unexpected error", async () => {
        const unexpectedError = new Error("Unexpected error");

        (createUserSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleRegister as jest.Mock).mockRejectedValue(unexpectedError);

        await register(req as Request, res as Response);

        expect(createUserSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleRegister).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
            error: unexpectedError.message,
        });
    });
});

import { createMessage } from "../../../../src/features/messages/create/createMessageController";
import { Request, Response } from "express";
import createMessageSchema from "../../../../src/validationSchema/createMessageSchema";
import { handleCreateMessage } from "../../../../src/features/messages/create/createMessageService";
import { RessourceNotFoundError } from "../../../../src/utils/RessourceNotFoundError";

jest.mock("../../../../src/validationSchema/createMessageSchema");
jest.mock("../../../../src/features/messages/create/createMessageService");
jest.mock("../../../../src/utils/RessourceNotFoundError");

describe("createMessage", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                chatId: "123"
            },
            body: { content: "Hello World" },
            files: []
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it("should return 400 if chatId is not a valid number", async () => {
        req.params!.chatId = "invalid";
        await createMessage(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid chat ID. Must be a number." });
    });

    it("should return 201 with the message when successful", async () => {
        const mockMessage = { id: 1, content: "Hello World" };

        // Mock schema validation and service call
        (createMessageSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleCreateMessage as jest.Mock).mockResolvedValue(mockMessage);

        await createMessage(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockMessage);
    });

    it("should return 400 if validation fails", async () => {
        const mockError = { isJoi: true, message: "Validation failed" };

        // Simulate validation failure
        (createMessageSchema.validateAsync as jest.Mock).mockRejectedValue(mockError);

        await createMessage(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Bad Request", details: mockError.message });
    });

    it("should return 404 if the resource is not found", async () => {
        const mockError = new RessourceNotFoundError("Chat not found");

        // Mock schema validation and simulate resource not found error
        (createMessageSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleCreateMessage as jest.Mock).mockRejectedValue(mockError);

        await createMessage(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Ressource not found", error: mockError.message });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const mockError = new Error("Unexpected error");

        // Mock schema validation and simulate unexpected error
        (createMessageSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleCreateMessage as jest.Mock).mockRejectedValue(mockError);

        await createMessage(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error", error: mockError.message });
    });
});

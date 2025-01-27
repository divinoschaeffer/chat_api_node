import {updateChat} from "../../../../src/features/chat/update/updateChatController";
import {Request, Response} from "express";
import updateChatSchema from "../../../../src/validationSchema/updateChatSchema";
import {handleUpdateChat} from "../../../../src/features/chat/update/updateChatService";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";

jest.mock("../../../../src/validationSchema/updateChatSchema");
jest.mock("../../../../src/features/chat/update/updateChatService");

describe("updateChat", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        req = {
            params: { chatId: "1" },
            body: { name: "Updated chat message.ts" },
        };
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    it("should successfully update the chat", async () => {
        const mockChat = { id: 1, message: "Updated chat message.ts" };

        (updateChatSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleUpdateChat as jest.Mock).mockResolvedValue(mockChat);

        await updateChat(req as Request, res as Response);

        expect(updateChatSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(handleUpdateChat).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockChat);
    });

    it("should return 400 if chatId is invalid", async () => {
        req.params!.chatId = "invalid";

        await updateChat(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid chat ID. Must be a number." });
    });

    it("should return 400 if validation fails", async () => {
        req.body = {
            name: "Test Chat",
            type: "invalid_type",
            creator_id: 1,
        };

        (updateChatSchema.validateAsync as jest.Mock).mockRejectedValue({
            isJoi: true,
            message: "Invalid chat type",
        });

        await updateChat(req as Request, res as Response);

        expect(updateChatSchema.validateAsync).toHaveBeenCalledWith(req.body);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Bad Request",
            details: "Invalid chat type",
        });
    });

    it("should return 404 if the chat is not found", async () => {
        (updateChatSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleUpdateChat as jest.Mock).mockRejectedValue(new RessourceNotFoundError("Chat not found"));

        await updateChat(req as Request, res as Response);

        expect(handleUpdateChat).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Resource not found", details: "Chat not found" });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        (updateChatSchema.validateAsync as jest.Mock).mockResolvedValue(req.body);
        (handleUpdateChat as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

        await updateChat(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
            error: "Unexpected error",
        });
    });
});

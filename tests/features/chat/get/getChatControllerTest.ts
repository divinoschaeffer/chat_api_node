import {getChat} from "../../../../src/features/chat/get/getChatController";
import {Request, Response} from "express";
import {handleGetChat} from "../../../../src/features/chat/get/getChatService";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";
import {Chat} from "../../../../src/models/Chat";
import {ChatType} from "../../../../src/models/ChatType";

jest.mock("../../../../src/features/chat/get/getChatService");

describe("getChat Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        req = { params: { chatId: '1' } };
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    it("should return a chat if it exists", async () => {
        const mockChat = new Chat(
            1,
            ChatType.GROUP,
            "Test Chat",
            1,
            [],
            new Date()
        );

        (handleGetChat as jest.Mock).mockResolvedValue(mockChat);

        await getChat(req as Request, res as Response);

        expect(statusMock).not.toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith(mockChat);
    });

    it("should return 404 if the chat is not found", async () => {
        (handleGetChat as jest.Mock).mockRejectedValue(
            new RessourceNotFoundError("Chat not found")
        );

        await getChat(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Resource not found",
            details: "Chat not found",
        });
    });

    it("should return 500 if an unknown error occurs", async () => {
        (handleGetChat as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

        await getChat(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Internal server error",
            error: "Unexpected error",
        });
    });
});

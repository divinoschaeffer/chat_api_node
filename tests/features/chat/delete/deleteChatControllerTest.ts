import {deleteChat} from "../../../../src/features/chat/softDelete/deleteChatController";
import {handleDeleteChat} from "../../../../src/features/chat/softDelete/deleteChatService";
import {Request, Response} from "express";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";

jest.mock("../../../../src/features/chat/softDelete/deleteChatService");

describe("deleteChat Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        req = { params: { chatId: "1" } };
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    it("should return 204 if the chat is deleted successfully", async () => {
        (handleDeleteChat as jest.Mock).mockResolvedValue(undefined);

        await deleteChat(req as Request, res as Response);

        expect(handleDeleteChat).toHaveBeenCalledWith(1);
        expect(statusMock).toHaveBeenCalledWith(204);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Chat deleted" });
    });

    it("should return 400 if the chatId is not a valid number", async () => {
        req.params!.chatId = "abc";

        await deleteChat(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid chat ID. Must be a number." });
    });

    it("should return 404 if the chat is not found", async () => {
        (handleDeleteChat as jest.Mock).mockRejectedValue(new RessourceNotFoundError("Chat not found"));

        await deleteChat(req as Request, res as Response);

        expect(handleDeleteChat).toHaveBeenCalledWith(1);
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Resource not found",
            details: "Chat not found",
        });
    });

    it("should return 500 if an unknown error occurs", async () => {
        (handleDeleteChat as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

        await deleteChat(req as Request, res as Response);

        expect(handleDeleteChat).toHaveBeenCalledWith(1);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Internal server error",
            error: "Unexpected error",
        });
    });
});

import { deleteMessageController } from "../../../../src/features/messages/delete/deleteMessageController";
import { Request, Response } from "express";
import { handleDeleteMessage } from "../../../../src/features/messages/delete/deleteMessageService";

jest.mock("../../../../src/features/messages/delete/deleteMessageService");

describe("deleteMessageController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                message_id: "123",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("should return 400 if messageId is not a valid number", async () => {
        req.params!.message_id = "invalid";

        await deleteMessageController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid message ID. Must be a number." });
    });

    it("should return 204 if the message is deleted successfully", async () => {
        (handleDeleteMessage as jest.Mock).mockResolvedValueOnce(undefined); // Simulate successful deletion

        await deleteMessageController(req as Request, res as Response);

        expect(handleDeleteMessage).toHaveBeenCalledWith(123); // Check if the service was called with the correct ID
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "message deleted" });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const mockError = new Error("Unexpected error");
        (handleDeleteMessage as jest.Mock).mockRejectedValueOnce(mockError); // Simulate service throwing an error

        await deleteMessageController(req as Request, res as Response);

        expect(handleDeleteMessage).toHaveBeenCalledWith(123); // Ensure service was called
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error", error: mockError.message });
    });
});

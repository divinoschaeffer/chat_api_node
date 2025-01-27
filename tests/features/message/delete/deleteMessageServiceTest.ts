import { handleDeleteMessage } from "../../../../src/features/messages/delete/deleteMessageService";
import { getMessageById, softDelete } from "../../../../src/repositories/messageRepository";
import { RessourceNotFoundError } from "../../../../src/utils/RessourceNotFoundError";
import { Message } from "../../../../src/models/Message";

jest.mock("../../../../src/repositories/messageRepository");

describe("handleDeleteMessage", () => {
    const messageId = 123;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw RessourceNotFoundError if the message is not found", async () => {
        // Mock getMessageById to return null
        (getMessageById as jest.Mock).mockResolvedValue(null);

        // Assert that the function throws RessourceNotFoundError
        await expect(handleDeleteMessage(messageId)).rejects.toThrow(RessourceNotFoundError);
        await expect(handleDeleteMessage(messageId)).rejects.toThrow(
            `message with id: ${messageId} not found`
        );

        expect(getMessageById).toHaveBeenCalledWith(messageId);
        expect(softDelete).not.toHaveBeenCalled();
    });

    it("should call softDelete if the message exists", async () => {
        const mockMessage: Message = { id: messageId, content: "Test message" } as Message;

        // Mock getMessageById to return a message
        (getMessageById as jest.Mock).mockResolvedValue(mockMessage);
        (softDelete as jest.Mock).mockResolvedValue(undefined);

        await handleDeleteMessage(messageId);

        expect(getMessageById).toHaveBeenCalledWith(messageId);
        expect(softDelete).toHaveBeenCalledWith(messageId);
    });

    it("should propagate any unexpected errors", async () => {
        const mockError = new Error("Unexpected error");

        // Mock getMessageById to throw an error
        (getMessageById as jest.Mock).mockRejectedValue(mockError);

        await expect(handleDeleteMessage(messageId)).rejects.toThrow(mockError);

        expect(getMessageById).toHaveBeenCalledWith(messageId);
        expect(softDelete).not.toHaveBeenCalled();
    });
});

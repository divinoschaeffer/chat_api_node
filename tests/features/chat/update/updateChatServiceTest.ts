import {handleUpdateChat} from "../../../../src/features/chat/update/updateChatService";
import {getChatById, update} from "../../../../src/repositories/chatRepository";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";
import {Chat} from "../../../../src/models/Chat";
import {ChatType} from "../../../../src/models/ChatType";

// Mock dependencies
jest.mock("../../../../src/repositories/chatRepository");

describe("handleUpdateChat", () => {
    const chatId = 1;
    const updatedValues = { name: "Updated chat name" };
    const mockChat: Chat = { id: chatId, name: "Old chat name", creator_id: 2, type: ChatType.PRIVATE, users: [], created_at: null, deleted_at: null};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the chat successfully", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (update as jest.Mock).mockResolvedValue(mockChat);

        const result = await handleUpdateChat(chatId, updatedValues);

        expect(getChatById).toHaveBeenCalledWith(chatId);
        mockChat.name = updatedValues.name;
        expect(result).toEqual(mockChat);
        expect(update).toHaveBeenCalledWith(result);
    });

    it("should throw RessourceNotFoundError if chat is not found", async () => {
        (getChatById as jest.Mock).mockResolvedValue(null);

        await expect(handleUpdateChat(chatId, updatedValues)).rejects.toThrowError(
            new RessourceNotFoundError(`Chat with id: ${chatId} not found`)
        );
        expect(getChatById).toHaveBeenCalledWith(chatId);
        expect(update).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors during update", async () => {
        const errorMessage = "Database error";
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (update as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(handleUpdateChat(chatId, updatedValues)).rejects.toThrowError(new Error(errorMessage));

        expect(getChatById).toHaveBeenCalledWith(chatId);
        expect(update).toHaveBeenCalledWith(mockChat);
    });
});

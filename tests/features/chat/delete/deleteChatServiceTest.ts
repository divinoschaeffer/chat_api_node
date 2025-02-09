import {handleDeleteChat} from "../../../../src/features/chat/softDelete/deleteChatService";
import {getChatById, softDelete} from "../../../../src/repositories/chatRepository";
import {Chat} from "../../../../src/models/Chat";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";
import {ChatType} from "../../../../src/models/ChatType";

jest.mock("../../../../src/repositories/chatRepository");

describe("handleDeleteChat Service", () => {
    const mockChat: Chat = new Chat(1, ChatType.GROUP, "Test Chat", 1, [], new Date(), null);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should soft delete the chat if it exists", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (softDelete as jest.Mock).mockResolvedValue(undefined);

        await handleDeleteChat(1,1);

        expect(getChatById).toHaveBeenCalledWith(1);
        expect(softDelete).toHaveBeenCalledWith(1);
    });

    it("should throw RessourceNotFoundError if the chat does not exist", async () => {
        (getChatById as jest.Mock).mockResolvedValue(null);

        await expect(handleDeleteChat(1, 1)).rejects.toThrow(RessourceNotFoundError);
        await expect(handleDeleteChat(1, 1)).rejects.toThrow("Chat with id: 1 not found");

        expect(getChatById).toHaveBeenCalledWith(1);
        expect(softDelete).not.toHaveBeenCalled();
    });

    it("should propagate any error thrown by softDelete", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (softDelete as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

        await expect(handleDeleteChat(1, 1)).rejects.toThrow("Unexpected error");

        expect(getChatById).toHaveBeenCalledWith(1);
        expect(softDelete).toHaveBeenCalledWith(1);
    });
});

import {handleListingMessage} from "../../../../src/features/messages/listing/listingMessageService";
import {getChatById} from "../../../../src/repositories/chatRepository";
import {count, list} from "../../../../src/repositories/messageRepository";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";
import {Message} from "../../../../src/models/Message";
import {Chat} from "../../../../src/models/Chat";
import {ChatType} from "../../../../src/models/ChatType";

jest.mock("../../../../src/repositories/chatRepository");
jest.mock("../../../../src/repositories/messageRepository");

describe("handleListingMessage", () => {
    const mockChat: Chat = {created_at: new Date(), creator_id: 0, deleted_at: null, type: ChatType.PRIVATE, users: [], id: 123, name: "Test Chat" };
    const mockMessages: Message[] = [
        { id: 1, sender_id: 1, chat_id: 123, content: "Hello", images: [], created_at: new Date(), deleted_at: null },
        { id: 2, sender_id: 2, chat_id: 123, content: "World", images: [], created_at: new Date(), deleted_at: null },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw RessourceNotFoundError if the chat is not found", async () => {
        (getChatById as jest.Mock).mockResolvedValue(null);

        await expect(handleListingMessage(123, 10, 0)).rejects.toThrow(RessourceNotFoundError);
        expect(getChatById).toHaveBeenCalledWith(123);
    });

    it("should return messages and total count when successful", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (list as jest.Mock).mockResolvedValue(mockMessages);
        (count as jest.Mock).mockResolvedValue(2);

        const result = await handleListingMessage(123, 10, 0);

        expect(getChatById).toHaveBeenCalledWith(123);
        expect(list).toHaveBeenCalledWith(123, 10, 0);
        expect(count).toHaveBeenCalledWith(123);

        expect(result).toEqual({
            total: 2,
            messages: mockMessages,
        });
    });

    it("should handle empty message lists and return total as 0", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (list as jest.Mock).mockResolvedValue([]);
        (count as jest.Mock).mockResolvedValue(0);

        const result = await handleListingMessage(123, 10, 0);

        expect(getChatById).toHaveBeenCalledWith(123);
        expect(list).toHaveBeenCalledWith(123, 10, 0);
        expect(count).toHaveBeenCalledWith(123);

        expect(result).toEqual({
            total: 0,
            messages: [],
        });
    });

    it("should propagate errors from list or count functions", async () => {
        (getChatById as jest.Mock).mockResolvedValue(mockChat);
        (list as jest.Mock).mockRejectedValue(new Error("List error"));

        await expect(handleListingMessage(123, 10, 0)).rejects.toThrow("List error");
        expect(getChatById).toHaveBeenCalledWith(123);
        expect(list).toHaveBeenCalledWith(123, 10, 0);
    });

    it("should propagate errors from getChatById function", async () => {
        (getChatById as jest.Mock).mockRejectedValue(new Error("Database error"));

        await expect(handleListingMessage(123, 10, 0)).rejects.toThrow("Database error");
        expect(getChatById).toHaveBeenCalledWith(123);
    });
});

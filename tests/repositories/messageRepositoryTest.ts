import database from "../../src/database";
import { Message } from "../../src/models/Message";
import { count, getMessageById, list, softDelete, store } from "../../src/repositories/messageRepository";
import { messagesFromDbList } from "../../src/repositories/factories/messageFactory";

jest.mock("../../src/database");
jest.mock("../../src/repositories/factories/messageFactory");

describe("Message Repository", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("store", () => {
        it("should store a message and its images", async () => {
            const mockMessage = new Message(
                null, 1, 1, "Hello World", ["/path/to/image1", "/path/to/image2"], new Date(), null
            );

            const mockKnexChain = {
                insert: jest.fn().mockResolvedValueOnce([1]),
            };

            const trx = jest.fn().mockImplementation(() => mockKnexChain);

            (database.transaction as jest.Mock).mockImplementationOnce(async (trxCallback) => {
                return trxCallback(trx);
            });

            const result = await store(mockMessage);

            expect(mockKnexChain.insert).toHaveBeenCalledWith({
                sender_id: mockMessage.sender_id,
                content: mockMessage.content,
                chat_id: mockMessage.chat_id,
                created_at: mockMessage.created_at,
            }, "id");

            expect(mockKnexChain.insert).toHaveBeenCalledWith({
                message_id: 1,
                image_path: "/path/to/image1",
            });

            expect(mockKnexChain.insert).toHaveBeenCalledWith({
                message_id: 1,
                image_path: "/path/to/image2",
            });

            expect(result.id).toBe(1);
        });

        it("should throw an error if the transaction fails", async () => {
            const mockMessage = new Message(
                null, 1, 1, "Hello World", ["/path/to/image1"], new Date(), null
            );

            const mockKnexChain = {
                insert: jest.fn().mockRejectedValueOnce(new Error("Transaction failed")),
            };

            const trx = jest.fn().mockImplementation(() => mockKnexChain);

            (database.transaction as jest.Mock).mockImplementationOnce(async (trxCallback) => {
                return trxCallback(trx);
            });

            await expect(store(mockMessage)).rejects.toThrow("Transaction failed");
        });
    });

    describe("count", () => {
        it("should return the number of messages in a chat", async () => {
            const chatId = 1;

            (database as unknown as jest.Mock).mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                count: jest.fn().mockResolvedValueOnce([{ count: 10 }]),
            });

            const result = await count(chatId);

            expect(result).toBe(10);
        });

        it("should return 0 if no count is found", async () => {
            (database as unknown as jest.Mock).mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                count: jest.fn().mockResolvedValueOnce([{ count: undefined }]),
            });

            const result = await count(1);

            expect(result).toBe(0);
        });
    });

    describe("list", () => {
        it("should return a list of messages", async () => {
            const chatId = 1;
            const limit = 10;
            const offset = 0;

            const mockMessages = [
                {
                    message_id: 1,
                    message_sender_id: 1,
                    message_chat_id: chatId,
                    message_content: "Hello",
                    images_messages_image_path: "/path/to/image",
                    message_created_at: new Date(),
                    message_deleted_at: null,
                },
            ];

            (database as unknown as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockResolvedValueOnce(mockMessages),
            });

            (messagesFromDbList as jest.Mock).mockReturnValueOnce([
                new Message(1, 1, chatId, "Hello", ["/path/to/image"], new Date(), null),
            ]);

            const result = await list(chatId, limit, offset);

            expect(result).toHaveLength(1);
            expect(result[0].content).toBe("Hello");
        });
    });

    describe("softDelete", () => {
        it("should mark a message as deleted", async () => {
            const messageId = 1;

            (database as unknown as jest.Mock).mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
            });

            await softDelete(messageId);
        });
    });

    describe("getMessageById", () => {
        it("should return a message by ID", async () => {
            const messageId = 1;

            const mockMessage = [
                {
                    message_id: 1,
                    message_sender_id: 1,
                    message_chat_id: 1,
                    message_content: "Hello",
                    images_messages_image_path: "/path/to/image",
                    message_created_at: new Date(),
                    message_deleted_at: null,
                },
            ];

            (database as unknown as jest.Mock).mockReturnValueOnce({
                where: jest.fn().mockReturnThis().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
            });

            (messagesFromDbList as jest.Mock).mockReturnValueOnce([
                new Message(1, 1, 1, "Hello", ["/path/to/image"], new Date(), null),
            ]);

            const result = await getMessageById(messageId);

            expect(result?.content).toBe("Hello");
        });

        it("should return null if no message is found", async () => {
            (database as unknown as jest.Mock).mockReturnValueOnce({
                leftJoin: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                where: jest.fn()
                    .mockReturnThis()
                    .mockReturnThis(),
            });

            const result = await getMessageById(9999);
            expect(result).toBeNull();
        });
    });
});

import database from "../../src/database";
import {getChatById, getChatColumns, isExisting, store} from "../../src/repositories/chatRepository";
import {Chat} from "../../src/models/Chat";
import {PublicUserDTO} from "../../src/models/PublicUserDTO";
import {ChatType} from "../../src/models/ChatType";
import {chatFromDB} from "../../src/repositories/factories/chatFactory";

jest.mock("../../src/database");
jest.mock("../../src/repositories/factories/chatFactory");

describe("Chat Repository", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("isExisting", () => {
        it("should return true if a chat with the exact users exists", async () => {
            const mockChats = [{ id: 1 }];
            const mockUsersInChat = [{ user_id: 1 }, { user_id: 2 }];

            (database as unknown as jest.Mock).mockReturnValueOnce({
                join: jest.fn().mockReturnThis(),
                whereIn: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                havingRaw: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValueOnce(mockChats),
            });

            (database as unknown as jest.Mock).mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValueOnce(mockUsersInChat),
            });

            const result = await isExisting([1, 2]);
            expect(result).toBe(true);
        });

        it("should return false if no chat exists with the exact users", async () => {
            (database as unknown as jest.Mock).mockReturnValueOnce({
                join: jest.fn().mockReturnThis(),
                whereIn: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                havingRaw: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValueOnce([]),
            });

            const result = await isExisting([1, 2]);
            expect(result).toBe(false);
        });

        it("should return false if the users array is empty", async () => {
            const result = await isExisting([]);
            expect(result).toBe(false);
        });
    });

    describe("store", () => {
        it("should insert a chat and its users and return the created chat", async () => {
            const mockChat: Chat = {
                id: 1,
                name: "Test Chat",
                type: ChatType.GROUP,
                creator_id: 1,
                created_at: new Date(),
                users: [{ id: 1, name: "JOJO" }, { id: 2, name: "ZOZO" }] as PublicUserDTO[],
            };

            const mockKnexChain = {
                insert: jest.fn().mockResolvedValueOnce([mockChat.id])
            };

            const trx = jest.fn().mockImplementation((table) => {
                return mockKnexChain;
            });

            (database.transaction as jest.Mock).mockImplementationOnce(async (trxCallback) => {
                return trxCallback(trx)
            });

            const result: Chat = await store(mockChat);
            expect(result).toEqual(mockChat);
        });

        it("should throw an error if the transaction fails", async () => {
            const mockChat: Chat = {
                id: 1,
                name: "Test Chat",
                type: ChatType.GROUP,
                creator_id: 1,
                created_at: new Date(),
                users: [{ id: 1, name: "JOJO" }, { id: 2, name: "ZOZO" }] as PublicUserDTO[],
            };

            // Mock qui simule l'échec de l'insertion
            const mockKnexChain = {
                insert: jest.fn().mockRejectedValueOnce(new Error('Transaction failed'))
            };

            const trx = jest.fn().mockImplementation((table) => {
                return mockKnexChain;
            });

            (database.transaction as jest.Mock).mockImplementationOnce(async (trxCallback) => {
                return trxCallback(trx);
            });

            await expect(store(mockChat)).rejects.toThrow('Transaction failed');
        });
    });

    describe("getChatById", () => {
        it("should return a chat if a matching chat is found", async () => {
            const mockChatResult = [
                {
                    chat_id: 1,
                    chat_name: "Test Chat",
                    chat_type: "GROUP",
                    creator_id: 1,
                    created_at: new Date(),
                    user_id: 1,
                    user_name: "John Doe",
                    user_email: "john.doe@example.com",
                    user_password: "hashed_password",
                    user_admin: false,
                    user_created_at: new Date(),
                },
                {
                    chat_id: 1,
                    chat_name: "Test Chat",
                    chat_type: "GROUP",
                    creator_id: 1,
                    created_at: new Date(),
                    user_id: 2,
                    user_name: "Van DAM",
                    user_email: "van.dam@example.com",
                    user_password: "hashed_password",
                    user_admin: false,
                    user_created_at: new Date(),
                }
            ];

            (database as unknown as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                mockResolvedValueOnce: jest.fn().mockResolvedValueOnce(mockChatResult),
            });

            const chat = {
                chat_id: 1,
                chat_name: "Test Chat",
                chat_type: "GROUP",
                creator_id: 1,
                users: [{ id: 1, name: "John Doe" }, { id: 2, name: "Van DAM" }] as PublicUserDTO[],
                created_at: new Date(),
            };

            (chatFromDB as jest.Mock).mockReturnValueOnce(chat);

            const result: Chat|null = await getChatById(1);

            expect(result).toEqual(chat);
        });

        it("should return null if no chat is found", async () => {
            (database as unknown as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                mockResolvedValueOnce: jest.fn().mockResolvedValueOnce([]),
            });

            (chatFromDB as jest.Mock).mockReturnValueOnce(null);

            const result: Chat|null = await getChatById(1);
            expect(result).toBeNull();
        });
    });

    describe("getChatColumns", () => {
        it("should return the correct columns for chat queries", () => {
            const result = getChatColumns();
            expect(result).toEqual([
                "users.id as user_id",
                "users.name as user_name",
                "users.email as user_email",
                "users.password as user_password",
                "users.admin as user_admin",
                "users.created_at as user_created_at",
                "chats.id as chat_id",
                "chats.name as chat_name",
                "chats.type as chat_type",
                "chats.creator_id as creator_id",
                "chats.created_at as created_at",
            ]);
        });
    });
});

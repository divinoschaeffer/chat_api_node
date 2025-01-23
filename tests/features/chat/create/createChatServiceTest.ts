import { handleCreateChat } from "../../../../src/features/chat/create/createChatService";
import { isExisting, store } from "../../../../src/repositories/chatRepository";
import { getUserById } from "../../../../src/repositories/userRepository";
import { AlreadyExistsError } from "../../../../src/utils/AlreadyExistsError";
import { RessourceNotFoundError } from "../../../../src/utils/RessourceNotFoundError";
import { Chat } from "../../../../src/models/Chat";
import { ChatType } from "../../../../src/models/ChatType";
import { User } from "../../../../src/models/User";
import { createDtoFromUser } from "../../../../src/models/UserDTO";
import {createPublicDtoFromUser, PublicUserDTO} from "../../../../src/models/PublicUserDTO";

jest.mock("../../../../src/repositories/chatRepository");
jest.mock("../../../../src/repositories/userRepository");
jest.mock("../../../../src/models/UserDTO");

describe("handleCreateChat Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create and return a chat if all inputs are valid", async () => {
        const mockValues = {
            name: "Test Chat",
            users: [1, 2],
            creator: 1,
        };

        const mockUsers = [
            new User(1, "Alice", "alice@example.com", "password1", false, new Date()),
            new User(2, "Bob", "bob@example.com", "password2", false, new Date()),
        ];

        const mockChat = new Chat(
            null,
            ChatType.PRIVATE,
            "Test Chat",
            1,
            mockUsers.map((user) => createPublicDtoFromUser(user)), // Mocked DTO
            new Date()
        );

        (isExisting as jest.Mock).mockResolvedValue(false);
        (getUserById as jest.Mock).mockImplementation((id: number) =>
            mockUsers.find((user) => user.id === id)
        );
        (createDtoFromUser as jest.Mock).mockImplementation((user: User) => ({
            id: user.id,
            name: user.name,
        }));
        (store as jest.Mock).mockResolvedValue(mockChat);

        const result = await handleCreateChat(mockValues);
        expect(result).toEqual(mockChat);
    });

    it("should throw an AlreadyExistsError if the chat already exists", async () => {
        const mockValues = { users: [1, 2] };

        (isExisting as jest.Mock).mockResolvedValue(true);

        await expect(handleCreateChat(mockValues)).rejects.toThrow(
            AlreadyExistsError
        );
        expect(isExisting).toHaveBeenCalledWith(mockValues.users);
        expect(getUserById).not.toHaveBeenCalled();
        expect(store).not.toHaveBeenCalled();
    });

    it("should throw a RessourceNotFoundError if any user does not exist", async () => {
        const mockValues = { users: [1, 2], creator: 1 };

        (isExisting as jest.Mock).mockResolvedValue(false);
        (getUserById as jest.Mock).mockImplementation((id: number) =>
            id === 1
                ? new User(1, "Alice", "alice@example.com", "password1", false, new Date())
                : null
        );

        await expect(handleCreateChat(mockValues)).rejects.toThrow(
            RessourceNotFoundError
        );
        expect(getUserById).toHaveBeenCalledWith(1);
        expect(getUserById).toHaveBeenCalledWith(2);
        expect(store).not.toHaveBeenCalled();
    });

    it("should default chat name to a comma-separated list of user names if name is not provided", async () => {
        const mockValues = { users: [1, 2], creator: 1 };

        const mockUsers = [
            new User(1, "Alice", "alice@example.com", "password1", false, new Date()),
            new User(2, "Bob", "bob@example.com", "password2", false, new Date()),
        ];

        const mockChat = new Chat(
            null,
            ChatType.PRIVATE,
            "Alice, Bob",
            1,
            mockUsers.map((user) => createPublicDtoFromUser(user)),
            new Date()
        );

        (isExisting as jest.Mock).mockResolvedValue(false);
        (getUserById as jest.Mock).mockImplementation((id: number) =>
            mockUsers.find((user) => user.id === id)
        );
        (createDtoFromUser as jest.Mock).mockImplementation((user: User) => ({
            id: user.id,
            name: user.name,
        }));
        (store as jest.Mock).mockResolvedValue(mockChat);

        const result = await handleCreateChat(mockValues);
        expect(result).toEqual(mockChat);
    });

    it("should set chat type to GROUP if more than 2 users are provided", async () => {
        const mockValues = { users: [1, 2, 3], creator: 1, name: "Group Chat" };

        const mockUsers = [
            new User(1, "Alice", "alice@example.com", "password1", false, new Date()),
            new User(2, "Bob", "bob@example.com", "password2", false, new Date()),
            new User(3, "Charlie", "charlie@example.com", "password3", false, new Date()),
        ];

        const mockChat = new Chat(
            null,
            ChatType.GROUP,
            "Group Chat",
            1,
            mockUsers.map((user: User): PublicUserDTO => createPublicDtoFromUser(user)),
            new Date()
        );

        (isExisting as jest.Mock).mockResolvedValue(false);
        (getUserById as jest.Mock).mockImplementation((id: number) =>
            mockUsers.find((user) => user.id === id)
        );
        (createDtoFromUser as jest.Mock).mockImplementation((user: User) => ({
            id: user.id,
            name: user.name,
        }));
        (store as jest.Mock).mockResolvedValue(mockChat);

        const result = await handleCreateChat(mockValues);
        expect(result.type).toBe(ChatType.GROUP);
    });
});

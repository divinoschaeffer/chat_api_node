import {chatFromDB} from "../../../src/repositories/factories/chatFactory";
import {Chat} from "../../../src/models/Chat";
import {createPublicDtoFromUser, PublicUserDTO} from "../../../src/models/PublicUserDTO";
import {User} from "../../../src/models/User";
import {userFromDB} from "../../../src/repositories/factories/userFactory";
import {ChatType} from "../../../src/models/ChatType";

jest.mock("../../../src/repositories/factories/userFactory", () => ({
    userFromDB: jest.fn(),
}));
jest.mock("../../../src/models/PublicUserDTO", () => ({
    createPublicDtoFromUser: jest.fn(),
}));

describe("chatFromDB", () => {
    it("should return null if the results array is empty", () => {
        const results: any[] = [];
        const chat = chatFromDB(results);
        expect(chat).toBeNull();
    });

    it("should return a Chat object with the correct properties", () => {
        const mockResults = [
            {
                chat_id: 1,
                chat_type: "GROUP",
                chat_name: "Test Chat",
                creator_id: 42,
                user_id: 1,
                user_name: "Alice",
                user_email: "alice@example.com",
                created_at: new Date(),
            },
            {
                chat_id: 1,
                chat_type: "GROUP",
                chat_name: "Test Chat",
                creator_id: 42,
                user_id: 2,
                user_name: "Bob",
                user_email: "bob@example.com",
                created_at: new Date(),
            },
        ];

        const mockUsers: User[] = [
            new User(1, "Alice", "alice@example.com", "diundizndinezi", false, new Date()),
            new User(2, "Bob", "bob@example.com", "diundizndinezi", false, new Date()),
        ];

        const mockPublicUsers: PublicUserDTO[] = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ];

        (userFromDB as jest.Mock).mockImplementation((result) => {
            return mockUsers.find((user) => user.id === result.user_id);
        });

        (createPublicDtoFromUser as jest.Mock).mockImplementation((user) => {
            return mockPublicUsers.find((publicUser) => publicUser.id === user.id);
        });

        const chat: Chat|null = chatFromDB(mockResults);

        expect(chat).toBeInstanceOf(Chat);
        expect(chat).toEqual(
            new Chat(
                1,
                ChatType.GROUP,
                "Test Chat",
                42,
                mockPublicUsers,
                mockResults[0].created_at
            )
        );

        expect(userFromDB).toHaveBeenCalledTimes(2);
        expect(createPublicDtoFromUser).toHaveBeenCalledTimes(2);

        expect(userFromDB).toHaveBeenCalledWith(mockResults[0]);
        expect(userFromDB).toHaveBeenCalledWith(mockResults[1]);

        expect(createPublicDtoFromUser).toHaveBeenCalledWith(mockUsers[0]);
        expect(createPublicDtoFromUser).toHaveBeenCalledWith(mockUsers[1]);
    });
});

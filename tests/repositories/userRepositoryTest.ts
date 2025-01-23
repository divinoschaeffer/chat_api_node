import {isExisting, getUserByEmail, store, getUserColumns} from "../../src/repositories/userRepository";
import database from "../../src/database";
import { User } from "../../src/models/User";

jest.mock("../../src/database");

describe("userRepository", () => {
    const mockUser: User = {
        id: 1,
        name: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        admin: false,
        created_at: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("isExisting", () => {
        it("should return true if a user with the same name or email exists", async () => {
            (database as unknown as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                orWhere: jest.fn().mockResolvedValue([mockUser]),
            });

            const result = await isExisting(mockUser.name, mockUser.email);
            expect(result).toBe(true);
            expect(database).toHaveBeenCalledWith("users");
        });

        it("should return false if no user with the same name or email exists", async () => {
            (database as unknown as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                orWhere: jest.fn().mockResolvedValue([]),
            });

            const result = await isExisting(mockUser.name, mockUser.email);
            expect(result).toBe(false);
            expect(database).toHaveBeenCalledWith("users");
        });
    });

    describe("getUserByEmail", () => {
        it("should return a user if the email exists", async () => {
            (database as unknown as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await getUserByEmail(mockUser.email);
            expect(result).toEqual(mockUser);
            expect(database).toHaveBeenCalledWith("users");
        });

        it("should return undefined if the email does not exist", async () => {
            (database as unknown as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(undefined),
            });

            const result = await getUserByEmail(mockUser.email);
            expect(result).toBeUndefined();
            expect(database).toHaveBeenCalledWith("users");
        });
    });

    describe("store", () => {
        it("should store a user and return the stored user", async () => {
            const mockInsertResult = [1];
            const mockDatabase = {
                insert: jest.fn().mockResolvedValue(mockInsertResult),
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockUser),
            };
            (database as unknown as jest.Mock).mockReturnValue(mockDatabase);

            const result = await store(mockUser);

            expect(mockDatabase.insert).toHaveBeenCalledWith(
                {
                    name: mockUser.name,
                    email: mockUser.email,
                    password: mockUser.password,
                    admin: mockUser.admin,
                    created_at: mockUser.created_at,
                },
                "id"
            );
            expect(mockDatabase.where).toHaveBeenCalledWith("id", mockInsertResult[0]);
            expect(result).toEqual(mockUser);
        });

        it("should throw an error if the user cannot be retrieved after insertion", async () => {
            const mockInsertResult = [1];
            const mockDatabase = {
                insert: jest.fn().mockResolvedValue(mockInsertResult),
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(undefined),
            };
            (database as unknown as jest.Mock).mockReturnValue(mockDatabase);

            await expect(store(mockUser)).rejects.toThrow("Error storing user");

            expect(mockDatabase.insert).toHaveBeenCalledWith(
                {
                    name: mockUser.name,
                    email: mockUser.email,
                    password: mockUser.password,
                    admin: mockUser.admin,
                    created_at: mockUser.created_at,
                },
                "id"
            );
            expect(mockDatabase.where).toHaveBeenCalledWith("id", mockInsertResult[0]);
        });
    });

    describe("getUserColumns", () => {
        it("should get columns", async () => {
            expect(getUserColumns()).toEqual([
                'users.id as user_id',
                'users.name as user_name',
                'users.email as user_email',
                'users.password as user_password',
                'users.admin as user_admin',
                'users.created_at as user_created_at'
            ])
        })
    })
});

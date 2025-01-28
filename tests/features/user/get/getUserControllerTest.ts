import { getUserController} from "../../../../src/features/user/get/getUserController";
import { handleSearchUser} from "../../../../src/features/user/get/getUserService";
import { Request, Response } from "express";
import { PublicUserDTO } from "../../../../src/models/PublicUserDTO";

jest.mock("../../../../src/features/user/get/getUserService");

describe("searchUserController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                user_name: "testUser",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if userName parameter is undefined", async () => {
        req.params!.user_name = '';

        await getUserController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Params userName undefined" });
    });

    it("should return 200 with user data if handleSearchUser is successful", async () => {
        const mockUser: PublicUserDTO = {
            id: 1,
            name: "testUser",
        };
        (handleSearchUser as jest.Mock).mockResolvedValue(mockUser);

        await getUserController(req as Request, res as Response);

        expect(handleSearchUser).toHaveBeenCalledWith("testUser");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 200 with null if no user is found", async () => {
        (handleSearchUser as jest.Mock).mockResolvedValue(null);

        await getUserController(req as Request, res as Response);

        expect(handleSearchUser).toHaveBeenCalledWith("testUser");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(null);
    });

    it("should return 500 if handleSearchUser throws an error", async () => {
        const mockError = new Error("Database error");
        (handleSearchUser as jest.Mock).mockRejectedValue(mockError);

        await getUserController(req as Request, res as Response);

        expect(handleSearchUser).toHaveBeenCalledWith("testUser");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error", error: mockError.message });
    });
});

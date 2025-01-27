import { listingMessageController } from "../../../../src/features/messages/listing/listingMessageController";
import { handleListingMessage } from "../../../../src/features/messages/listing/listingMesssageService";
import { Request, Response } from "express";

jest.mock("../../../../src/features/messages/listing/listingMesssageService");

describe("listingMessageController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                chatId: "123",
            },
            query: {
                limit: "10",
                offset: "0",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("should return 400 if chatId is not a valid number", async () => {
        req.params!.chatId = "invalid";

        await listingMessageController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid chat ID. Must be a number.",
        });
    });

    it("should return messages and total count when successful", async () => {
        const mockResponse = {
            total: 5,
            messages: [
                { id: 1, content: "Hello" },
                { id: 2, content: "World" },
            ],
        };

        (handleListingMessage as jest.Mock).mockResolvedValue(mockResponse);

        await listingMessageController(req as Request, res as Response);

        expect(handleListingMessage).toHaveBeenCalledWith(123, 10, 0); // Correct parameters passed
        expect(res.json).toHaveBeenCalledWith({
            total_count: mockResponse.total,
            items: mockResponse.messages,
        });
    });

    it("should default limit and offset to 0 if not provided", async () => {
        req.query = {}; // Remove limit and offset from query

        const mockResponse = {
            total: 0,
            messages: [],
        };

        (handleListingMessage as jest.Mock).mockResolvedValue(mockResponse);

        await listingMessageController(req as Request, res as Response);

        expect(handleListingMessage).toHaveBeenCalledWith(123, 0, 0); // Default values for limit and offset
        expect(res.json).toHaveBeenCalledWith({
            total_count: mockResponse.total,
            items: mockResponse.messages,
        });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const mockError = new Error("Unexpected error");

        (handleListingMessage as jest.Mock).mockRejectedValue(mockError);

        await listingMessageController(req as Request, res as Response);

        expect(handleListingMessage).toHaveBeenCalledWith(123, 10, 0); // Ensure it was called before failing
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
            error: mockError.message,
        });
    });
});

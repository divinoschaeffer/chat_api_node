import {createChat} from "../../../../src/features/chat/create/createChatController";
import {Request, Response} from "express";
import createChatSchema from "../../../../src/validationSchema/createChatSchema";
import {handleCreateChat} from "../../../../src/features/chat/create/createChatService";
import {AlreadyExistsError} from "../../../../src/utils/AlreadyExistsError";
import {Chat} from "../../../../src/models/Chat";
import {ChatType} from "../../../../src/models/ChatType";

jest.mock("../../../../src/validationSchema/createChatSchema");
jest.mock("../../../../src/features/chat/create/createChatService");

describe("createChat Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        req = { body: {} };
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    it("should create a chat and return 201 if the request is valid", async () => {
        const mockRequestBody = {
            name: "Test Chat",
            type: "group",
            creator_id: 1,
        };

        const mockChat: Chat = new Chat(
            1,
            ChatType.GROUP,
            "Test Chat",
            1,
            [],
            new Date()
        );

        req.body = mockRequestBody;

        (createChatSchema.validateAsync as jest.Mock).mockResolvedValue(mockRequestBody);
        (handleCreateChat as jest.Mock).mockResolvedValue(mockChat);

        await createChat(req as Request, res as Response);

        expect(createChatSchema.validateAsync).toHaveBeenCalledWith(mockRequestBody);
        expect(handleCreateChat).toHaveBeenCalledWith(mockRequestBody);
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith(mockChat);
    });

    it("should return 400 if validation fails", async () => {
        const mockRequestBody = {
            name: "Test Chat",
            type: "invalid_type",
            creator_id: 1,
        };

        req.body = mockRequestBody;

        (createChatSchema.validateAsync as jest.Mock).mockRejectedValue({
            isJoi: true,
            message: "Invalid chat type",
        });

        await createChat(req as Request, res as Response);

        expect(createChatSchema.validateAsync).toHaveBeenCalledWith(mockRequestBody);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Bad Request",
            details: "Invalid chat type",
        });
    });

    it("should return 403 if the chat already exists", async () => {
        const mockRequestBody = {
            name: "Test Chat",
            type: "group",
            creator_id: 1,
        };

        req.body = mockRequestBody;

        (createChatSchema.validateAsync as jest.Mock).mockResolvedValue(mockRequestBody);
        (handleCreateChat as jest.Mock).mockRejectedValue(
            new AlreadyExistsError("Chat already exists")
        );

        await createChat(req as Request, res as Response);

        expect(createChatSchema.validateAsync).toHaveBeenCalledWith(mockRequestBody);
        expect(handleCreateChat).toHaveBeenCalledWith(mockRequestBody);
        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Resource already exist",
            details: "Chat already exists",
        });
    });

    it("should return 500 if an unknown error occurs", async () => {
        const mockRequestBody = {
            name: "Test Chat",
            type: "group",
            creator_id: 1,
        };

        req.body = mockRequestBody;

        (createChatSchema.validateAsync as jest.Mock).mockResolvedValue(mockRequestBody);
        (handleCreateChat as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

        await createChat(req as Request, res as Response);

        expect(createChatSchema.validateAsync).toHaveBeenCalledWith(mockRequestBody);
        expect(handleCreateChat).toHaveBeenCalledWith(mockRequestBody);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Internal server error",
            error: "Unexpected error",
        });
    });
});

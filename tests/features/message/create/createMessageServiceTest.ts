import {handleCreateMessage} from "../../../../src/features/messages/create/createMessageService";
import {getChatById} from "../../../../src/repositories/chatRepository";
import {store} from "../../../../src/repositories/messageRepository";
import {RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";
import {Message} from "../../../../src/models/Message";
import {Chat} from "../../../../src/models/Chat";
import {ChatType} from "../../../../src/models/ChatType";
import {Readable} from "node:stream";

jest.mock("../../../../src/repositories/chatRepository");
jest.mock("../../../../src/repositories/messageRepository");
jest.mock("../../../../src/utils/RessourceNotFoundError");

describe("handleCreateMessage", () => {
    const chatId = 123;
    const mockRequestBody = {
        sender: "123",
        content: "Hello World",
    };
    const mockFiles: Express.Multer.File[] = [
        {
            fieldname: 'file',
            originalname: 'image1.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            size: 12345,
            stream: new Readable(),  // Mocking a readable stream
            destination: '/uploads',
            filename: 'image1.jpg',
            path: 'uploads/image1.jpg',
            buffer: Buffer.from('some file data'),
        },
        {
            fieldname: 'file',
            originalname: 'image2.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            size: 67890,
            stream: new Readable(),  // Mocking a readable stream
            destination: '/uploads',
            filename: 'image2.jpg',
            path: 'uploads/image2.jpg',
            buffer: Buffer.from('some other file data'),
        }
    ];
    const mockChat: Chat = new Chat(
        chatId,
        ChatType.GROUP,
        "nana",
        2,
        []
    );

    it("should create and store the message when the chat is found", async () => {
        const mockMessage: Message = new Message(
            null,
            parseInt(mockRequestBody.sender),
            chatId,
            mockRequestBody.content,
            ["image1.jpg", "image2.jpg"],
            new Date(),
            null
        );

        // Mock `getChatById` to return a valid chat object
        (getChatById as jest.Mock).mockResolvedValue(mockChat);

        // Mock `store` to return the created message
        (store as jest.Mock).mockResolvedValue(mockMessage);

        const result = await handleCreateMessage(chatId, mockRequestBody, mockFiles);

        // Ensure the message is created with the correct data
        expect(result).toEqual(mockMessage);
    });

    it("should handle the absence of files correctly", async () => {
        const mockMessage: Message = new Message(
            null,
            parseInt(mockRequestBody.sender),
            chatId,
            mockRequestBody.content,
            [], // No files
            new Date(),
            null
        );

        // Mock `getChatById` to return a valid chat object
        (getChatById as jest.Mock).mockResolvedValue(mockChat);

        // Mock `store` to return the created message
        (store as jest.Mock).mockResolvedValue(mockMessage);

        const result = await handleCreateMessage(chatId, mockRequestBody, []);

        // Ensure the message is created without files
        expect(result).toEqual(mockMessage);
    });
});

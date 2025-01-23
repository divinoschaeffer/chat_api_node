import { handleGetChat } from "../../../../src/features/chat/get/getChatService";
import { getChatById} from "../../../../src/repositories/chatRepository";
import { RessourceNotFoundError} from "../../../../src/utils/RessourceNotFoundError";

jest.mock("../../../../src/repositories/chatRepository");

describe('handleGetChat', () => {
    it('should return a chat when the id is valid', async () => {
        const chatId = 1;
        const mockChat = { id: chatId, message: "Hello" };

        (getChatById as jest.Mock).mockResolvedValue(mockChat);

        const result = await handleGetChat(chatId);

        expect(result).toEqual(mockChat);
        expect(getChatById).toHaveBeenCalledWith(chatId);
    });

    it('should throw a RessourceNotFoundError when the chat is not found', async () => {
        const chatId = 999;

        (getChatById as jest.Mock).mockResolvedValue(null);

        await expect(handleGetChat(chatId)).rejects.toThrowError(
            new RessourceNotFoundError(`Chat with id: ${chatId} not found`)
        );
        expect(getChatById).toHaveBeenCalledWith(chatId);
    });
});

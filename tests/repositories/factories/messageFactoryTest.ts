import {Message} from "../../../src/models/Message";
import {messagesFromDbList} from "../../../src/repositories/factories/messageFactory";

describe("messagesFromDbList", () => {
    it("should return an empty array when given an empty results array", () => {
        const results: any[] = [];

        const messages = messagesFromDbList(results);

        expect(messages).toEqual([]);
    });

    it("should map a single result into a Message instance", () => {
        const results = [
            {
                message_id: 1,
                message_sender_id: 2,
                message_chat_id: 3,
                message_content: "Hello!",
                message_created_at: new Date("2025-01-01T10:00:00Z"),
                message_deleted_at: null,
                images_messages_image_path: null,
            },
        ];

        const messages = messagesFromDbList(results);

        expect(messages).toHaveLength(1);
        expect(messages[0]).toBeInstanceOf(Message);
        expect(messages[0]).toEqual(
            expect.objectContaining({
                id: 1,
                sender_id: 2,
                chat_id: 3,
                content: "Hello!",
                images: [],
                created_at: new Date("2025-01-01T10:00:00Z"),
                deleted_at: null,
            })
        );
    });

    it("should aggregate images into the correct message object", () => {
        const results = [
            {
                message_id: 1,
                message_sender_id: 2,
                message_chat_id: 3,
                message_content: "Hello!",
                message_created_at: new Date("2025-01-01T10:00:00Z"),
                message_deleted_at: null,
                images_messages_image_path: "image1.jpg",
            },
            {
                message_id: 1,
                message_sender_id: 2,
                message_chat_id: 3,
                message_content: "Hello!",
                message_created_at: new Date("2025-01-01T10:00:00Z"),
                message_deleted_at: null,
                images_messages_image_path: "image2.jpg",
            },
        ];

        const messages = messagesFromDbList(results);

        expect(messages).toHaveLength(1);
        expect(messages[0].images).toEqual(["image1.jpg", "image2.jpg"]);
    });

    it("should sort messages by created_at in descending order", () => {
        const results = [
            {
                message_id: 1,
                message_sender_id: 2,
                message_chat_id: 3,
                message_content: "First message",
                message_created_at: new Date("2025-01-01T10:00:00Z"),
                message_deleted_at: null,
                images_messages_image_path: null,
            },
            {
                message_id: 2,
                message_sender_id: 4,
                message_chat_id: 3,
                message_content: "Second message",
                message_created_at: new Date("2025-01-02T10:00:00Z"),
                message_deleted_at: null,
                images_messages_image_path: null,
            },
        ];

        const messages = messagesFromDbList(results);

        expect(messages).toHaveLength(2);
        expect(messages[0].content).toBe("Second message");
        expect(messages[1].content).toBe("First message");
    });
});

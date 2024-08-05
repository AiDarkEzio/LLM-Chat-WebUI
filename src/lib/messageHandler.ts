import { db } from "@/lib/db";
import ollama from 'ollama';
import { Conversation, MessageHandlerProps, $Enums } from "@/types/types";

export async function messageHandler({ conversation, assistant, user }: MessageHandlerProps): Promise<Conversation | null> {
    try {
        if (!conversation) throw new Error("Conversation is null");
        if (conversation.messages.length === 0) {
            const systemMessage = await db.message.create({
                data: {
                    text: "Your name is Friday and you are a helpful assistant.",
                    role: $Enums.MessageRole.SYSTEM,
                    conversationId: conversation.id,
                    senderId: "system",
                }
            });

            const response = await ollama.chat({
                model: assistant.name, // e.g., 'gemma:2b' or 'phi:2.7b'
                messages: [{
                    role: systemMessage.role,
                    content: systemMessage.text,
                }],
            });

            await db.message.create({
                data: {
                    text: response.message.content,
                    role: $Enums.MessageRole.ASSISTANT,
                    conversationId: conversation.id,
                    senderId: assistant.id,
                    assistantId: assistant.id,
                }
            });
        }

        if (user.prompt) {
            await db.message.create({
                data: {
                    text: user.prompt,
                    image: user.image,
                    role: $Enums.MessageRole.USER,
                    conversationId: conversation.id,
                    senderId: user.id,
                    userId: user.id,
                }
            });

            const messages = (await db.message.findMany({
                where: { conversationId: conversation.id }
            })).map(message => ({
                role: message.role,
                content: message.text,
                image: message.image
            }));

            const response = await ollama.chat({
                model: assistant.name, // e.g., 'gemma:2b' or 'phi:2.7b'
                messages,
            });

            await db.message.create({
                data: {
                    text: response.message.content,
                    role: $Enums.MessageRole.ASSISTANT,
                    conversationId: conversation.id,
                    senderId: assistant.id,
                    assistantId: assistant.id,
                }
            });
        }

        const updatedConversation = await db.conversation.findUnique({
            where: {
                id: conversation.id,
            },
            select: {
                messages: {
                    select: {
                        id: true,
                        conversationId: true,
                        userId: true,
                        senderId: true,
                        text: true,
                        createdAt: true,
                        updatedAt: true,
                        image: true,
                        role: true,
                        User: {
                            select: {
                                name: true,
                            }
                        },
                        Assistant: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                id: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                name: true
            }
        });

        if (!updatedConversation) throw new Error("Could not find Conversation in database.");

        return updatedConversation;
    } catch (error) {
        console.error("Error in messageHandler:", error);
        return null;
    }
}

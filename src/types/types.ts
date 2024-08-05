import { $Enums } from "@prisma/client";

export { $Enums }

export type Message = {
    id: string;
    text: string;
    image: string | null;
    role: $Enums.MessageRole;
    createdAt: Date;
    updatedAt: Date;
    senderId: string | null;
    conversationId?: string;
    Assistant: {
        name: string;
    } | null;
    User: {
        name: string;
    } | null;
};

export type MessageHandlerProps = {
    user: {
        id: string;
        prompt?: string;
        image?: string;
    }
    conversation: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: {
            id: string;
            text: string;
            image: string | null;
            role: $Enums.MessageRole;
            createdAt: Date;
            updatedAt: Date;
            senderId: string | null;
            conversationId?: string;
        }[]
    } | null;
    assistant: {
        name: string;
        id: string;
    };
};

export type Model = {
    id: string;
    name: string;
  };

export type Conversations = {
    id: string,
    updatedAt: string,
    userId: string,
    name: string
}[]

export type Conversation = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    messages: Message[];
}

export type ConversationHandlerResponse = Conversation & {
    messages: Message[];
}

export type User = {
    id: string;
    name: string;
    username?: string | null;
    email?: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: $Enums.UserRole;
};
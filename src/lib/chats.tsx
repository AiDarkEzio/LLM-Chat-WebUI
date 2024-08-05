"use client";
import { SetStateAction } from "react";
import { ConversationHandlerResponse, Conversations, Conversation, Message, $Enums } from '@/types/types'
import toast from "react-hot-toast";


export async function getConversations(userId: string) {
    try {
        const response = await fetch(`/api/conversations/${userId}`, {method: 'GET'});
        if (!response.ok) {
            console.error('Error:', response.statusText);
            toast.error(response.statusText);
            return [];
        }
        const data: Conversations = await response.json();
        return data;
    } catch (e: any) {
        console.error(e)
        toast.error(e);
        return []
    }
}

export async function getConversation(chatId: string): Promise<Conversation|null> {
    try {
        const response = await fetch(`/api/conversation/${chatId}`, { method: 'GET' });
        if (!response.ok) {
            console.error('Error:', response.statusText);
            toast.error(response.statusText);
            return null;
        }
        if (response.status === 404) {
            toast.error('Chat not found');
            return null;
        }
        if (response.status === 500) {
            const data: { message: string } = await response.json()
            toast.error(data.message);
            return null;
        }
        const data: Conversation = await response.json();
        return data;
    } catch (e: any) {
        console.error(e);
        toast.error(e);
        return null
    }
}

export function renderChatmessages(conversation: Conversation) {
    const messages = conversation.messages;
    if (!messages) {
        return
    };
    return messages.map(({ id, role, text, User, Assistant }) => {
        const userName = User?.name || "User";
        const modelName = Assistant?.name || 'Assistant';
        return (
            <div key={id} className={"flex flex-row px-4 pt-4 h-auto " + getMessageSide(role)}>
                <div className={"flex flex-col"}>
                    {role !== "SYSTEM" && (
                        <p className={"flex flex-row font-bold font-sans text-gray-500 px-2 " + getMessageSide(role)}>
                            {role === "USER" ? userName : role === "ASSISTANT" ? modelName : "Anonymous"}
                        </p>
                    )}
                    <p className="surface-2 p-2 rounded-xl max-w-3xl min-w-28 shadow-md">{text}</p>
                </div>
            </div>
        )
    });
}

export function getMessageSide(role: $Enums.MessageRole) {
    if (role === "ASSISTANT") return 'justify-start';
    if (role === "USER") return 'justify-end';
    return 'justify-center text-center';
}
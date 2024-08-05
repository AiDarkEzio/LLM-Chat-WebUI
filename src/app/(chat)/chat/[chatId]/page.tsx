"use client";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer";
import { Prompt } from '@/lib/schemas';
import { getConversations, getConversation, renderChatmessages } from "@/lib/chats";
import Dropdown from '@/components/Dropdown';
import { Conversation, Conversations, Model } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [models, setModels] = useState<Model[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>();
  const [isResponseGenerating, setResponseGenerating] = useState(false);
  const [conversations, setConversations] = useState<Conversations>([]);
  const [conversation, setConversation] = useState<Conversation>();

  const handleModelSelect = (model: string) => setSelectedModel(model);

  async function getModels() {
    const response = await fetch('/api/models/db', { method: 'GET' });
    if (!response.ok) {
        setModels([]);
        toast.error('Failed to fetch models');
        throw new Error('Failed to fetch models');
    }
    if (response.status === 200) {
        const data: Model[] = await response.json();
        setModels(data);
        setSelectedModel(data[0].id);
    } else {
        const data: { message: string } = await response.json();
        toast.error(data.message)
    }
  }

  const fetchConversations = async () => {
    try {
      if (!session?.user?.id) {
        toast.error("Please login to continue");
        return;
      }
      const data = await getConversations(session.user.id);
      setConversations(data);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching conversations");
    }
  };

  const fetchConversation = async () => {
    if (params.chatId.toLowerCase() !== "newchat") {
      try {
        if (conversations.map(c => c.id).includes(params.chatId.toLowerCase())) {
          router.push("/chat/newchat");
          return;
        }
        const data = await getConversation(params.chatId.toLowerCase());
        if (!data || !data.messages || data.messages.length === 0) {
          router.push("/chat/newchat");
          return;
        }
        if (data.messages[0].role === "SYSTEM") data.messages.shift();
        if (data.messages[0].role === "ASSISTANT") data.messages[0].role = 'SYSTEM';
        setConversation(data);
      } catch (e) {
        console.error(e);
        toast.error("An error occurred while fetching the conversation");
        router.push("/chat/newchat");
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/")
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.id) {
      getModels();
      fetchConversations();
      fetchConversation();
    }
  }, [params.chatId, session?.user?.id]);

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(event.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setResponseGenerating(true);
      if (!prompt) {
        toast.error("Please enter a prompt");
        return;
      }
      if (!selectedModel) {
        toast.error("Please select a model");
        return;
      }
      if (!session?.user?.id) {
        toast.error("Please login to continue");
        return;
      }
      const body: Prompt = {
        prompt,
        model: selectedModel,
        userId: session.user.id,
        conversationId: conversation?.id || params.chatId.toLowerCase(),
      };
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error("Error: " + response.statusText);
        console.error("Error:", response.statusText);
        return;
      }

      const data: Conversation = await response.json();
      setConversation(data);
    } catch (e: any) {
      toast.error("An error occurred while sending the prompt");
      console.error(e);
    } finally {
      setResponseGenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-64 surface m-1 rounded-xl items-center">
        <div className="flex-grow w-full p-2 flex flex-col items-center">
          <h2 className="my-2 mx-2 font-bold text-lg">Chat List</h2>
          <span className="h-px bg-gray-500 w-2/3 my-1 mb-3"></span>
          <div className="mb-1 flex-grow flex flex-col gap-1 w-full">
            {(conversations === undefined || conversations.length === 0 || !Array.isArray(conversations)) ? (
              <p className="px-2 py-2 text-slate-500 text-sm text-center">Empty Chat History</p>
            ) : conversations.map((item, i) => (
              <Link key={i} className="rounded-lg px-2 py-2 surface-2 surface-2-h overflow-hidden text-nowrap shadow-md" href={'/chat/' + item.id}>{item.name}</Link>
            ))}
          </div>
        </div>
        <span className="h-px bg-gray-500 w-9/12 my-1"></span>
        <div className="h-16 w-full p-2">
          <Link href={'/profile'} className="p-2 flex flex-row items-center surface-2 surface-2-h justify-between pr-4 rounded-xl shadow-md">
            <Image className="rounded-full hover:shadow-md" src="/profilePhoto.png" alt="Profile Image" width={30} height={30} priority />
            <h3 className="font-bold hover:shadow-md">{session?.user?.name || 'User'}</h3>
          </Link>
        </div>
      </div>
      <div className="flex-grow surface mr-1 mt-1 mb-1 rounded-xl flex flex-col">
        <div className="flex-grow flex flex-col p-2 items-center">
          <div className="h-auto p-2 px-4 font-bold justify-between flex flex-row items-center w-full">
            <Dropdown models={models} onSelect={handleModelSelect} />
            {params.chatId.toLocaleLowerCase() !== 'newchat' && (
              <button className="h-auto primary p-1 rounded-lg font-bold px-3 shadow-md" onClick={() => router.push('/chat/newchat')}>New Chat</button>
            )}
          </div>
          <span className="h-px bg-gray-500 w-11/12 mb-2 my-1"></span>
          <div className="flex-grow flex flex-col overflow-y-scroll w-full">
            {conversation?.messages && params.chatId.toLowerCase() !== "newchat" ? renderChatmessages(conversation) : ''}
          </div>
        </div>
        <div className="max-h-48 flex flex-col items-center">
          <span className="h-px bg-gray-500 w-9/12 mb-3 my-1"></span>
          <form onSubmit={handleSubmit} className="max-h-36 flex-grow flex flex-row items-center p-2 px-5 gap-2 w-full">
            <textarea
              className="flex-grow surface-2 surface-2-h min-h-10 max-h-36 text-lg p-1 rounded-lg shadow-md"
              onChange={handlePromptChange}
              name="prompt"
              id="prompt"
              placeholder="Enter your prompt as one or multiple lines."
              rows={4} // Adjust the number of rows as needed
            />
            <button
              type="submit"
              className={"h-auto p-1 rounded-lg font-bold px-3 shadow-md " + (isResponseGenerating ? 'error' : 'primary')}
              disabled={isResponseGenerating}
            >
              Send
            </button>
          </form>
          <Footer />
        </div>
      </div>
    </>
  );
}

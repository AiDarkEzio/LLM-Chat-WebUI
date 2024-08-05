import ollama from 'ollama';
import fs from 'fs';
import path from 'path';

(async (jsonFilePath: string) => {
  const chatFilePath = path.resolve(jsonFilePath);

  // Load existing chat messages from the JSON file
  let messages = [];
  if (fs.existsSync(chatFilePath)) {
    try {
      const chatData = fs.readFileSync(chatFilePath, 'utf-8');
      messages = JSON.parse(chatData);
    } catch (error) {
      console.error('Error reading chat.json:', error);
      messages = [];
    }
  } else {
    messages = [];
  }

  if (messages.length === 0) {
    messages.push({ role: 'system', content: 'You are a helpful assistant.' });
  } else {
    messages.push({ role: 'user', content: 'What are the deferane of programmer vs developer vs engineer vs scientist' });
  }

  const response = await ollama.chat({
    model: 'gemma:2b', // gemma:2b   phi:2.7b
    messages,
    stream: true,
  });

  const message = { role: 'assistant', content: '' };
  for await (const data of response) {
    message.content += data.message.content;
    message.role = data.message.role;
    process.stdout.write(data.message.content);
    if (data.done) {
      process.stdout.write('\n\n\n');
      if (message.content.trim() === '') continue;
      messages.push(message);
    }
  }

  // Save the updated chat messages to the JSON file
  try {
    fs.writeFileSync(chatFilePath, JSON.stringify(messages, null, 2));
    console.log('Chat history saved successfully.');
  } catch (error) {
    console.error(`Error writing to ${chatFilePath}  : ${error}`);
  }
})


const updateDB = async ({ chat }: {
  chat: {
    id: string
    title: string
    messages: {
      message: string;
      role: 'assistant' | 'user' | 'system';
      name: string;
    }[]
  }
}) => {
  let data: {
    chat: {
      id: string
      title: string
      messages: {
        message: string;
        role: 'assistant' | 'user' | 'system';
        name: string;
      }[]
    }
  }[] = []
  let filePath = path.resolve('./db.json')
  function DO() {
    const chatData = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(chatData);
  }
  if (fs.existsSync(filePath)) {
    try {
      DO()
    } catch (error) {
      console.error('Error reading chat.json:', error)
    }
  } else {
    fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' })
    try {
      DO()
    } catch (error) {
      console.error('Error reading chat.json:', error)
    }
  }
  return data
}
const getDB = async () => {
  let data: {
    chat: {
      id: string
      title: string
      messages: {
        message: string;
        role: 'assistant' | 'user' | 'system';
        name: string;
      }
    }
  }[] = []
  let filePath = path.resolve('./db.json')
  if (fs.existsSync(filePath)) {
    console.log(fs.existsSync(filePath));
    try {
      const chatData = fs.readFileSync(filePath, 'utf-8');
      console.log("data:",chatData);
      data = JSON.parse(chatData);
      console.log(data)
      return data
    } catch (error) {
      console.error('Error reading chat.json:', error)
    }
  } else {
    fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' })
    try {
      const chatData = fs.readFileSync(filePath, 'utf-8');
      console.log("data:",chatData);
      data = JSON.parse(chatData);
      console.log(data)
      return data
    } catch (error) {
      console.error('Error reading chat.json:', error)
    }
  }

}

export {
  getDB
}
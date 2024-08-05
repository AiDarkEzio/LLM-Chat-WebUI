'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Model = {
    name: string;
    id: string;
};

interface ModelProps { }

const Models: React.FC<ModelProps> = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [ollamaModels, setOllamaModels] = useState<string[]>([]);

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
        } else {
            const data: { message: string } = await response.json();
            toast.error(data.message)
        }
    }

    async function getOllamaModels() {
        const response = await fetch('/api/models/ollama', { method: 'GET' });
        if (!response.ok) {
            setOllamaModels([]);
            toast.error('Failed to fetch models');
            throw new Error('Failed to fetch models');
        }
        if (response.status === 200) {
            const data: string[] = await response.json();
            setOllamaModels(data);
        } else {
            const data: { message: string } = await response.json();
            toast.error(data.message)
        }
    }

    function handleModel(model: string, isAdded: boolean) {
        return async function () {
            if (isAdded) {
                try {
                    const modelId = models.find(m => m.name === model )?.id;
                    if (modelId) {
                        const response = await fetch(`/api/models/db/${modelId}`, { method: 'DELETE',})
                        if (!response.ok) {
                            toast.error('Failed to delete model: ' + model);
                            return
                        }
                        if (response.status === 200) {
                            const data: {
                                id: string;
                                name: string;
                                createdAt: Date;
                                modified_at: Date;
                            } = await response.json();
                            toast.success('Model deleted: ' + data.name);
                            getModels();
                            return
                        } else {
                            const data: { message: string } = await response.json();
                            toast.error(data.message);
                            return
                        }
                    } else {
                        toast.error('Failed to select model')
                        return
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('somthing went wrong.')
                } 
            } else {
                try {
                    const response = await fetch(`/api/models/db/`, { 
                        method: 'POST', 
                        body: JSON.stringify({ name: model }), 
                        headers: { 'Content-Type': 'application/json',}
                    })
                    if (!response.ok) {
                        toast.error('Failed to create model: ' + model);
                        return
                    }
                    if (response.status === 200) {
                        const data: {
                            id: string;
                            name: string;
                            createdAt: Date;
                            modified_at: Date;
                        } = await response.json();
                        toast.success('Model created: ' + data.name);
                        getModels();
                        return
                    } else {
                        const data: { message: string } = await response.json();
                        toast.error(data.message);
                        return
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('somthing went wrong.')
                } 
            }
        }
    }

    useEffect(() => {
        getModels();
        getOllamaModels();
    }, []);

    return (
        <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Models</h1>
        {ollamaModels.length > 0 && (<>
        <span className="h-px bg-gray-500 w-2/3 my-1 mb-3"></span>
        <div className="overflow-x-auto">
            <table className='min-w-full bg-transparent border-2 border-gray-700 text-white'>
                <tr className="bg-gray-700">
                    <th className='py-2 px-4 text-left'>Model Name</th>
                    <th className='py-2 px-4 text-left'>Option</th>
                </tr>
                    {ollamaModels.map((model, index) => {
                        const isAdded = models.length === 0 ? false : models.map(m => m.name).includes(model)
                        return (
                        <tr key={index} className='border-b border-gray-700 hover:bg-gray-900'>
                            <td className='py-2 px-4 text-left'>{index+1}: {model}</td>
                            <td className='py-2 px-4 text-center'><button 
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded'
                            onClick={handleModel(model, isAdded)}>{isAdded?'Remove':'Add'}</button></td>
                        </tr>)
                    })}
            </table>
        </div>
        </>)}
    </div>
    );
};

export default Models;

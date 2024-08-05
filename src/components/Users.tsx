'use client';
import { $Enums, User } from '@/types/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserProps { }

const Models: React.FC<UserProps> = () => {
    const [users, setUsers] = useState<User[]>([]);

    async function getUsers() {
        const response = await fetch('/api/users/', { method: 'GET' });
        if (!response.ok) {
            setUsers([]);
            toast.error('Failed to fetch users');
            throw new Error('Failed to fetch users');
        }
        if (response.status === 200) {
            const data: User[] = await response.json();
            setUsers(data);
        } else {
            const data: { message: string } = await response.json();
            toast.error(data.message)
        }
    }

    function removeUser(user: User) {
        return async function () {
            const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE',})
            if (!response.ok) {
                toast.error('Failed to delete user: ' + user.name);
                return
            }
            if (response.status === 200) {
                const data: {
                    id: string;
                    name: string;
                    username: string | null;
                    email: string;
                    emailVerified: Date | null;
                    image: string | null;
                    passwordHash: string;
                    createdAt: Date;
                    updatedAt: Date;
                    role: $Enums.UserRole;
                } = await response.json();
                toast.success('User deleted: ' + data.name);
                getUsers();
                return
            } else {
                const data: { message: string } = await response.json();
                toast.error(data.message);
                return
            }
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Users</h1>
        {users.length > 0 && (<>
        <span className="h-px bg-gray-500 w-2/3 my-1 mb-3"></span>
        <div className="overflow-x-auto">
            <table className='min-w-full bg-transparent border-2 border-gray-700 text-white'>
                <tr className="bg-gray-700">
                    <th className='py-2 px-4 text-left'>Name</th>
                    <th className='py-2 px-4 text-left'>Id</th>
                    <th className='py-2 px-4 text-left'>User Name</th>
                    <th className='py-2 px-4 text-left'>Email</th>
                    <th className='py-2 px-4 text-left'>Role</th>
                    <th className='py-2 px-4 text-left'>Image</th>
                    <th className='py-2 px-4 text-left'>Created At</th>
                    <th className='py-2 px-4 text-left'>Updated At</th>
                    <th className='py-2 px-4 text-left'>Delete</th>
                </tr>
                    {users.map((user, index) => {
                        return (
                        <tr key={index} className='border-b border-gray-700 hover:bg-gray-900'>
                            <td className='py-2 px-4 text-left'>{index+1}: {user.name}</td>
                            <td className='py-2 px-4 text-left'>{user.id}</td>
                            <td className='py-2 px-4 text-left'>{user.username}</td>
                            <td className='py-2 px-4 text-left'>{user.email}</td>
                            <td className='py-2 px-4 text-left'>{user.role}</td>
                            <td className='py-2 px-4 text-left'>{user.image}</td>
                            <td className='py-2 px-4 text-left'>{user.createdAt.toLocaleString()}</td>
                            <td className='py-2 px-4 text-left'>{user.updatedAt.toLocaleString()}</td>
                            <td className='py-2 px-4 text-center'><button 
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded'
                            onClick={removeUser(user)}>{'Remove'}</button></td>
                        </tr>)
                    })}
            </table>
        </div>
        </>)}
    </div>
    );
};

export default Models;

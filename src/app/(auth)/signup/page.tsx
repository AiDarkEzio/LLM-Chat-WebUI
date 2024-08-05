'use client'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SignUpSchema, SignUpFormData } from '@/lib/schemas';
import toast from 'react-hot-toast';
import { User } from '@prisma/client';

export default function SignUp () {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }
      if (response.status === 200) {
        const user: User = await response.json();
        const result = await signIn('credentials', {
          redirect: false,
          email: user.email,
          password: data.password,
        }, {
          callbackUrl: '/',
        });
        if (result?.error) {
          toast.error(result.error);
          console.error(result.error);
        } else {
          router.push('/');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
    } catch (error) {
      toast.error('Sign up failed');
      console.error("Sign up failed:", error);
    }
  };

  return (
    <div className="background min-h-screen flex items-center justify-center">
      <div className="surface p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
            <input
              id="name"
              {...register("name")}
              className="surface-2 mt-1 p-2 w-full rounded border"
            />
            {errors.name && <p className="text-error mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
            <input
              id="username"
              {...register("username")}
              className="surface-2 mt-1 p-2 w-full rounded border"
            />
            {errors.username && <p className="text-error mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              id="email"
              {...register("email")}
              className="surface-2 mt-1 p-2 w-full rounded border"
            />
            {errors.email && <p className="text-error mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="surface-2 mt-1 p-2 w-full rounded border"
            />
            {errors.password && <p className="text-error mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="primary w-full py-2 rounded font-bold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

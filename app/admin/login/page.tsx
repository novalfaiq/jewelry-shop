'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import Logo from '@/components/atoms/Logo';
import Container from '@/components/atoms/Container';
import Link from 'next/link';

type FormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                router.replace('/admin/dashboard');
            }
        };
        
        checkAuth();
    }, [router]);

    const form = useForm<FormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push('/admin/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Container>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                       <Link href="/" className="font-extrabold text-gray-900">
                            BAYSIDE FINE JEWELRY
                        </Link>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <Card>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && (
                                        <div className="text-red-500 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-primary-foreground"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
"use client"

/**
 * Navbar Component
 * Main navigation bar with role-based menu items
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen, LayoutDashboard, GraduationCap, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <GraduationCap className="size-6 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Course Master
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
                            Browse Courses
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isStudent && (
                                    <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                                        <LayoutDashboard className="size-4" />
                                        My Dashboard
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                                        <LayoutDashboard className="size-4" />
                                        Admin Panel
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                                    <span className="text-sm text-muted-foreground">
                                        {user?.name}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="gap-2"
                                    >
                                        <LogOut className="size-4" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/courses"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse Courses
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {isStudent && (
                                        <Link
                                            href="/dashboard"
                                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="size-4" />
                                            My Dashboard
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="size-4" />
                                            Admin Panel
                                        </Link>
                                    )}

                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Signed in as <strong>{user?.name}</strong>
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="gap-2 w-full"
                                        >
                                            <LogOut className="size-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 pt-4 border-t">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button size="sm" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

// Helper hook to access user role
const isStudent = (user: any) => user?.role === 'student';

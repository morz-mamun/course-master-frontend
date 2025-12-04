import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


export default function StudentDashboardHeader() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-sidebar px-3">
            <SidebarTrigger />
            <div className="flex-1" />
            {/* User info */}
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
            </div>
            {/* Logout button */}
            <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>
        </header>
    );
}
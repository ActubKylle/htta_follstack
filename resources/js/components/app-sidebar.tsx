import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types'; // Import PageProps
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UserCheck } from 'lucide-react'; // Import UserCheck icon for enrollments

// Assuming AppLogo is in components folder
import AppLogo from './app-logo';

// Define a type for your Auth user to access role
interface AuthUser {
    id: number;
    name: string;
    email_verified_at: string | null; // <--- ADD THIS LINE
    role: string; // Assuming 'role' is on the user object
}

// Extend PageProps to get the authenticated user
interface CustomPageProps extends PageProps {
    auth: {
        user: AuthUser;
    };
}

export function AppSidebar() {
    const { auth } = usePage<CustomPageProps>().props; // Get auth data from Inertia page props
    const userRole = auth.user?.role; // Access the user's role

    // Main navigation items
    const mainNavItems: NavItem[] = [
        {
            title: 'User Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Add Enrollment link if user is an admin
    if (userRole === 'admin') {
        mainNavItems.push({
            title: 'Enrollments', // Changed title
            href: '/admin/enrollments', // Changed href
            icon: UserCheck, // A more fitting icon for enrollments
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
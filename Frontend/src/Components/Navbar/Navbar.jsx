import { BuildingStorefrontIcon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'

const Navbar = () => {
    const userRole = useSelector((state) => state.user.userRole);
    const location = useLocation();
    const cartItems = useSelector((state) => state.cart.items);
    
    const toggleDarkMode = () => {
        const mode = document.body.parentElement.getAttribute("data-theme");
        if (mode === "dark") {
            document.body.parentElement.setAttribute("data-theme", "cupcake")
            localStorage.setItem("isDarkMode", "false")
        } else {
            document.body.parentElement.setAttribute("data-theme", "dark")
            localStorage.setItem("isDarkMode", "true")
        }
    }

    const getPageTitle = () => {
        switch(location.pathname) {
            case '/':
                return 'Login';
            case '/login':
                return 'Login';
            case '/dashboard':
                return userRole === 'shopkeeper' ? 'My Products' : 'Dashboard';
            case '/customer':
                return 'Browse Products';
            case '/purchases':
                return 'Purchase History';
            case '/newSales':
                return 'New Sales';
            case '/viewSales':
                return 'View Sales';
            case '/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    }

    return (
        <div className="navbar h-10  rounded-md shadow-md mb-3">
            <div className='md:w-[80%] md:mx-auto flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className="icon mx-2">
                        <BuildingStorefrontIcon className='w-6 h-6' />
                    </div>
                    <a className="text-xl font-bold">Shop Inventory Management</a>
                </div>
                <div className='flex items-center gap-4 px-2'>
                    {userRole && (
                        <div className="flex items-center gap-2 text-sm">
                            <UserCircleIcon className="w-4 h-4" />
                            <span className="capitalize">{userRole}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">{getPageTitle()}</span>
                        </div>
                    )}
                    {userRole === 'customer' && (
                    <Link to="/cart" className="relative">
                        <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                        {cartItems && cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    )}
                    <SunIcon onClick={toggleDarkMode} className='dark:hidden h-6 w-6 cursor-pointer' />
                    <MoonIcon onClick={toggleDarkMode} className='hidden dark:block h-6 w-6 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default Navbar
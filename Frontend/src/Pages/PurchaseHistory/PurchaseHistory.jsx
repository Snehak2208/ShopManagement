import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Bars3BottomLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import baseUrl from '../../utils/baseurl';
import Aside from '../../Components/Aside/Aside';
import toast, { Toaster } from 'react-hot-toast';

const PurchaseHistory = () => {
    const isLogin = useSelector((state) => state.login.loginStatus)
    const userRole = useSelector((state) => state.user.userRole)
    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // fetch customer's purchase history
    const fetchPurchaseHistory = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        try {
            const response = await fetch(`${baseUrl}/purchases`, requestOptions);
            const result = await response.json();
            if (result.status) {
                setPurchases(result.data);
            } else {
                toast.error("Failed to fetch purchase history");
                console.log('Error::PurchaseHistory::result', result.message)
            }
        } catch (error) {
            toast.error("Something went wrong! try again");
            console.log('Error::PurchaseHistory::fetchPurchaseHistory', error)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        // check if login and correct role:
        if (!isLogin) {
            navigate("/login")
        } else if (userRole !== 'customer') {
            navigate("/")
        } else {
            fetchPurchaseHistory();
        }
    }, [isLogin, userRole])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // exec only if login and customer:
    return (isLogin && userRole === 'customer' &&
        <div className='md:w-[80%] md:mx-auto'>
            {/* main */}
            <div className="drawer lg:drawer-open">
                <input id="sidebar_drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content px-4">
                    <div className="flex items-center justify-between ">
                        {/* Page content here */}
                        <label htmlFor="sidebar_drawer" className="drawer-button lg:hidden">
                            <Bars3BottomLeftIcon className='w-6 h-6' />
                        </label>
                        <h2 className='text-xl'>Purchase History</h2>
                    </div>

                    {/* Purchase History Table */}
                    <div className="overflow-auto max-h-[80vh] mt-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : purchases && purchases.length > 0 ? (
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th>Purchase Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchases.map((purchase, i) => (
                                        <tr className="hover" key={purchase._id}>
                                            <th>{i + 1}</th>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12 bg-primary/20 flex items-center justify-center">
                                                            <ShoppingBagIcon className="w-6 h-6 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{purchase.productId?.p_name || 'Product Unavailable'}</div>
                                                        <div className="text-sm opacity-50">Rs. {purchase.productId?.p_price || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{purchase.quantity}</td>
                                            <td className="font-bold text-primary">Rs. {purchase.totalPrice}</td>
                                            <td>{formatDate(purchase.purchaseDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='text-center mt-8'>
                                <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className='text-lg text-gray-600'>No purchase history found!</p>
                                <p className='text-sm text-gray-500'>Start shopping to see your purchases here.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="drawer-side md:h-[80vh] h-full">
                    <label htmlFor="sidebar_drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <Aside/>
                </div>
            </div>
            {/* main end */}
            <Toaster />
        </div>
    )
}

export default PurchaseHistory 
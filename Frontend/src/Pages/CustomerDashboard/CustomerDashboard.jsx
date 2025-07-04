import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bars3BottomLeftIcon, MagnifyingGlassIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import baseUrl from '../../utils/baseurl';
import { setProducts } from '../../Redux/products/productSlice';
import Aside from '../../Components/Aside/Aside';
import toast, { Toaster } from 'react-hot-toast';
import { addToCart } from '../../Redux/cart/cartSlice';

const CustomerDashboard = () => {
    const isLogin = useSelector((state) => state.login.loginStatus)
    const userRole = useSelector((state) => state.user.userRole)
    const navigate = useNavigate();

    // get all products from store:
    const products = useSelector((state) => state.product.products);
    const [isFetchFinished, setisFetchFinished] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    // fetch all products (for customers to browse):
    const fetchAllProducts = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            const response = await fetch(`${baseUrl}/products/all`, requestOptions);
            const result = await response.json();
            if (result.status) {
                console.log("Products received successfully");
                dispatch(setProducts(result.data));
            } else {
                toast.error("Failed to fetch products");
                console.log('Error::CustomerDashboard::result', result.message)
            }
        } catch (error) {
            toast.error("Something went wrong! try again");
            console.log('Error::CustomerDashboard::fetchAllProducts', error)
        }
        setisFetchFinished(true);
    }

    // Purchase product function
    const purchaseProduct = async (productId, productName, quantity = 1) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ productId, quantity }),
            redirect: 'follow',
            credentials: 'include'
        };

        try {
            console.log('Attempting purchase:', { productId, productName, quantity });
            const response = await fetch(`${baseUrl}/purchase`, requestOptions);
            const result = await response.json();
            console.log('Purchase response:', result);
            
            if (result.status) {
                toast.success(`Successfully purchased ${quantity} ${productName}!`);
                // Refresh products to update stock
                fetchAllProducts();
            } else {
                toast.error(result.message || "Purchase failed");
                console.log('Purchase failed:', result.message);
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error("Something went wrong! try again");
        }
    }

    // Add to cart function
    const handleAddToCart = async (productId, productName) => {
        try {
            const resultAction = await dispatch(addToCart({ productId, quantity: 1 }));
            if (addToCart.fulfilled.match(resultAction)) {
                toast.success(`${productName} added to cart!`);
            } else {
                toast.error(resultAction.payload || 'Failed to add to cart');
            }
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    }

    useEffect(() => {
        // check if login and correct role:
        if (!isLogin) {
            navigate("/login")
        } else if (userRole !== 'customer') {
            navigate("/")
        } else if (products.length <= 0 && !isFetchFinished) {
            // async fetch data and save result to store
            fetchAllProducts();
        }
    }, [products, userRole])

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.p_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.p_price.toString().includes(searchTerm)
    );

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
                        <h2 className='text-xl'>Browse Products</h2>
                        {/* search bar */}
                        <form action="" className='hidden md:flex items-center w-1/2'>
                            <input 
                                type="text" 
                                placeholder="Search Products" 
                                className="input input-bordered rounded-full h-10 lg:w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className='serch p-2 bg-blue-500 text-white rounded-md ms-2'>
                                <MagnifyingGlassIcon className='w-6 h-6' />
                            </button>
                        </form>
                    </div>

                    {/* search bar mobile*/}
                    <form action="" className='flex md:hidden items-center w-full mt-4'>
                        <input 
                            type="text" 
                            placeholder="Search Products" 
                            className="input input-bordered rounded-full h-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className='serch p-2 bg-blue-500 text-white rounded-md ms-2'>
                            <MagnifyingGlassIcon className='w-6 h-6' />
                        </button>
                    </form>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                        {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, i) => (
                            <div key={product._id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">{product.p_name}</h2>
                                    <p className="text-2xl font-bold text-primary">Rs. {product.p_price}</p>
                                    <p className="text-sm text-gray-600">Stock: {product.p_stock}</p>
                                    <p className="text-xs text-gray-500">Sold by: {product.userId?.email || 'Unknown'}</p>
                                    
                                    <div className="card-actions justify-end mt-4">
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => purchaseProduct(product._id, product.p_name, 1)}
                                            disabled={product.p_stock <= 0}
                                        >
                                            <ShoppingCartIcon className="w-4 h-4" />
                                            {product.p_stock > 0 ? 'Buy Now' : 'Out of Stock'}
                                        </button>
                                        <button
                                            className="btn btn-outline btn-sm ml-2"
                                            onClick={() => handleAddToCart(product._id, product.p_name)}
                                            disabled={product.p_stock <= 0}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isFetchFinished && filteredProducts.length <= 0 && (
                        <div className='text-center mt-8'>
                            <p className='text-lg text-gray-600'>No products found!</p>
                            {searchTerm && <p className='text-sm text-gray-500'>Try adjusting your search terms.</p>}
                        </div>
                    )}
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

export default CustomerDashboard 
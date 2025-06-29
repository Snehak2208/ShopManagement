import React, { useState } from 'react'
import { setloginStatus } from "../../Redux/login/isLogin";
import { setUserRole } from "../../Redux/user/userSlice";
import { useDispatch } from 'react-redux';
import baseurl from '../../utils/baseurl';

import { useForm } from 'react-hook-form';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
    const [isLoginPage, setisLoginPage] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [eyePassword, seteyePassword] = useState(false);
    const [eyeConfirmPassword, seteyeConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({/** resolver: yupResolver(schema), */ });
    const validateEmail = (email) => {
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return "Invalid email format";
        };
    }
    const validatePassword = (password) => {
        // Simplified password validation for testing
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        // Original strict validation (commented out for testing)
        // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s).{8,}$/g;
        // if (!password.match(regex)) {
        //     return "invalid password format";
        // };
    }

    const loginUser = async (obj) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(obj),
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            console.log('Attempting login with:', { email: obj.email });
            const response = await fetch(`${baseurl}/login`, requestOptions);
            const result = await response.json();
            console.log('Login response:', result);
            
            if (result.status) {
                dispatch(setloginStatus(true));
                dispatch(setUserRole(result.role)); // Store user role
                toast.success(`Login successful! Welcome ${result.role}`);
                setTimeout(() => {
                    // Redirect based on user role
                    if (result.role === 'customer') {
                        navigate("/customer");
                    } else {
                        navigate("/dashboard");
                    }
                }, 1500);
            } else {
                toast.error(result.message || "Invalid credentials");
                console.log('Error::Auth::loginUser::result', result.message)
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Something went wrong! try again");
        }
    }

    const registerUser = async (obj) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(obj),
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            console.log('Attempting registration with:', { email: obj.email, role: obj.role });
            const response = await fetch(`${baseurl}/register`, requestOptions)
            const result = await response.json();
            console.log('Registration response:', result);
            
            if (result.status) {
                toast.success(`Registration successful! Welcome ${result.role}`);
                setisLoginPage(!isLoginPage);
            } else {
                toast.error(result.message || "Something went wrong! try again");
                console.log('Error::Auth::registerUser::result', result.message)
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error("Something went wrong! try again");
        }
    }

    const onSubmit = (data) => {
        console.log(data);
        if (data.btnOption === "REGISTER") {
            // register btn is clicked:
            if (data.password !== data.cpassword) {
                alert("Password and comfirm password DO Not match!");
                return false;
            }
            registerUser(data);
            return false;
        }
        // else login btn clicked:
        loginUser(data)
        return false;
    }
    return (
        <main className='px-4 md:w-2/3 md:mx-auto'>
            <div className="h2 text-center text-xl font-bold">{isLoginPage ? "Login into Account" : "Register Account"}</div>
            <div className='flex justify-center  mx-auto mt-4'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full lg:max-w-xs' autoComplete='off' noValidate>
                    {/* email */}
                    <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.email ? "input-error" : "input-success"} `}>
                        <EnvelopeIcon className="h-4 w-4 opacity-70" />
                        <input type="text" name='email' className="grow bg-transparent " placeholder="Email"
                            {...register('email', { validate: validateEmail })} />
                    </label>
                    <div className="label-text text-xs text-error h-8 pt-2">
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    {/* Role selection for registration */}
                    {!isLoginPage && (
                        <>
                            <label className="input input-bordered flex items-center gap-2 rounded-lg">
                                <UserIcon className="h-4 w-4 opacity-70" />
                                <select className="grow bg-transparent" {...register('role', { required: true })}>
                                    <option value="shopkeeper">Shopkeeper</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </label>
                            <div className="label-text text-xs text-gray-500 h-8 pt-2">
                                <p>Select your role</p>
                            </div>
                        </>
                    )}

                    {/* password */}
                    <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.password ? "input-error" : "input-success"} `}>
                        <KeyIcon className="h-4 w-4 opacity-70" />
                        <input type={eyePassword ? "text" : "password"} name='password' className="grow bg-transparent" placeholder="password"
                            {...register('password', { validate: validatePassword })} />
                        {eyePassword ? <EyeIcon className="h-4 w-4 opacity-70" onClick={() => { seteyePassword(!eyePassword) }} />
                            :
                            <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => { seteyePassword(!eyePassword) }} />}
                    </label>

                    <div className="label-text text-xs text-error h-8 pt-2">
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    <div className="label">
                        <span className="label-text text-xs text-gray-500">Password must be at least 6 characters long.</span>
                    </div>

                    {/* confirm password */}
                    {!isLoginPage && (<>
                        <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.cpassword ? "input-error" : "input-success"} `}>

                            <KeyIcon className="h-4 w-4 opacity-70" />
                            <input type={eyeConfirmPassword ? "password" : "text"} name='cpassword' className="grow bg-transparent" placeholder="confirm password"
                                {...register('cpassword', { validate: validatePassword })} />
                            {!eyeConfirmPassword ? <EyeIcon className="h-4 w-4 opacity-70" onClick={() => { seteyeConfirmPassword(!eyeConfirmPassword) }} />
                                :
                                <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => { seteyeConfirmPassword(!eyeConfirmPassword) }} />}
                        </label>
                        <div className="label-text text-xs text-error h-8 pt-2">
                            {errors.cpassword && <p>{errors.cpassword.message}</p>}
                        </div>
                    </>)}

                    <input type="hidden" name='btnOption' {...register('btnOption')} id='btnHiddenForm' />

                    {isLoginPage ? (<input type="submit" className='btn w-full lg:max-w-xs btn-primary mt-4' value="Login"
                        onClick={() => { reset({"btnOption":"LOGIN"}) }} />)
                        : (<input type="submit" className='btn w-full lg:max-w-xs btn-primary mt-4' value="Register"
                            onClick={() => { reset({"btnOption":"REGISTER"}) }} />)
                    }
                </form>
            </div>

            <div className="more text-center mt-4">
                <h5>OR</h5>
                {isLoginPage ? (<div>Do not have account? <span className='underline cursor-pointer'
                    onClick={() => { setisLoginPage(!isLoginPage) }}>Register</span></div>)
                    : (<div>Already have account? <span className='underline cursor-pointer'
                        onClick={() => { setisLoginPage(!isLoginPage) }}>Login</span></div>)
                }
            </div>

            <Toaster />
        </main>
    )
}

export default Auth
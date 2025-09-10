import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import authService from '../feature/auth/authService.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { User, Lock, Mail, Store, FileText } from 'lucide-react'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('buyer');
    const [formData, setFormData] = useState({

        name: '',
        email: '',
        password: '',
        shopName: '',
        gstNumber: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { name, email, password, shopName, gstNumber } = formData;
    const onChange = (e) => {

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));

    };



    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {

            if (isLogin) {

                const userData = { email, password };
                const responseData = await authService.login(userData);
                login(responseData); 

                if (role === 'buyer') {
                    navigate('/');
                } else {
                    navigate('/seller');
                }
            } else {

                const userData = {
                    name,
                    email,
                    password,
                    role,
                    sellerInfo: role === 'seller' ? { shopName, gstNumber } : undefined,
                };

               

                await authService.register(userData);
        

                const loginData = { email, password };
                const responseData = await authService.login(loginData);
                login(responseData);


                

                toast('Registered Succesfully ')

            }

        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
            setError(message);
        } finally {
            setLoading(false);
        }

    };



    const renderInput = (id, name, type, placeholder, icon, value) => (

        <div className="relative mb-4" key={id}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">

                {icon}

            </div>

            <input

                type={type}

                id={id}

                name={name}

                value={value}

                onChange={onChange}

                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 bg-gray-50"

                placeholder={placeholder}

                required

            />

        </div>

    );



    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">

            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg m-4">

                <div className="flex border border-gray-200 rounded-lg p-1">

                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${isLogin ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${!isLogin ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        Register
                    </button>
                </div>



                <div>
                    <h2 className="text-2xl font-bold text-center text-gray-800">{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>
                    <p className="text-center text-gray-500 text-sm mt-1">{isLogin ? 'Login to continue.' : 'Get started by creating a new account.'}</p>
                </div>



                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}



                <form onSubmit={onSubmit} className="space-y-4">

                    {!isLogin && renderInput('name', 'name', 'text', 'Full Name', <User size={18} />, name)}
                    {renderInput('email', 'email', 'email', 'Email Address', <Mail size={18} />, email)}
                    {renderInput('password', 'password', 'password', 'Password', <Lock size={18} />, password)}

                    <div className="pt-2">

                        <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                        <div className="flex space-x-4">

                            <button type="button" onClick={() => setRole('buyer')} className={`flex-1 text-center p-3 border rounded-lg transition-all duration-200 ${role === 'buyer' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                Buyer

                            </button>

                            <button type="button" onClick={() => setRole('seller')} className={`flex-1 text-center p-3 border rounded-lg transition-all duration-200 ${role === 'seller' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>

                                Seller

                            </button>

                        </div>

                    </div>



                    {!isLogin && role === 'seller' && (

                        <div className="p-4 border-t mt-4 space-y-4">

                            <p className="text-sm font-medium text-gray-700">Seller Information:</p>

                            {renderInput('shopName', 'shopName', 'text', 'Shop Name', <Store size={18} />, shopName)}

                            {renderInput('gstNumber', 'gstNumber', 'text', 'GST Number', <FileText size={18} />, gstNumber)}

                        </div>

                    )}



                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"

                    >

                        {loading ? (

                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

                            </svg>
                        ) : null}

                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}

                    </button>
                </form>

                <p className="text-xs text-center text-gray-500">

                    By continuing, you agree to our Terms of Service.

                </p>
            </div>
        </div>
    );
};
export default Auth;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { login } from "../../services";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/userSlice";
import { validateEmail } from "../../utils/helper";
import ModalOfForgotPassword from '../../components/modal/ModalOfForgotPassword';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.email === "") {
                toast.error("Email boş olamaz");
                return;
            }
            if (!validateEmail(formData.email)) {
                toast.error("Email geçersiz");
                return;
            }
            if (formData.password === "") {
                toast.error("Şifre boş olamaz");
                return;
            }

            try {
                const data = await login(formData);
                dispatch(userLogin(data));
                navigate("/panel", { replace: true });
                toast.success("Giriş başarılı");
            } catch (error) {
                toast.error(error.message);
            }

        } catch (error) {
            console.error('Giriş hatası:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-login-background bg-cover px-6 bg-center relative">
            <div className="relative">
                <div className="absolute -inset-0 backdrop-blur-md rounded-xl" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md lg:max-w-lg bg-white/20 p-8 lg:p-10 rounded-xl shadow-xl relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <h2 className="text-center font-extrabold text-transparent text-4xl lg:text-5xl bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 tracking-wider">
                            Study Reminder
                        </h2>

                    </motion.div>

                    <motion.form
                        className="mt-6 space-y-4"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-3 py-3 lg:py-4 text-gray-700 bg-white/60 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 peer placeholder-transparent text-sm lg:text-base [-webkit-autofill]:bg-white/60"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-sm lg:text-base text-gray-600 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0]  px-2 peer-placeholder-shown:px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 peer-focus:text-purple-600 rounded"
                                >
                                    Email
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full px-3 py-3 lg:py-4 text-gray-700 bg-white/60 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 peer placeholder-transparent pr-10 text-sm lg:text-base [-webkit-autofill]:bg-white/60"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-sm lg:text-base text-gray-600 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0]  px-2 peer-placeholder-shown:px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 peer-focus:text-purple-600 rounded"
                                >
                                    Şifre
                                </label>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-purple-600 cursor-pointer"
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="text-lg lg:text-xl"
                                    />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 lg:py-4 px-4 border border-transparent text-sm lg:text-base font-medium rounded-lg text-white bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Giriş Yap
                        </button>

                        <div className="flex justify-end mt-2">
                            <button
                                type='button'
                                onClick={() => setShowForgotPasswordModal(true)}
                                className="text-sm text-gray-200 bg-purple-600/20 px-2 py-1 rounded-md hover:text-purple-500 hover:bg-white/40 duration-300 font-medium"
                            >
                                Şifremi unuttum!
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-gray-200">Hesabınız yok mu? </span>
                            <NavLink
                                to="/register"
                                className="text-purple-600 ml-2 hover:text-purple-500 font-medium"
                            >
                                Kayıt Ol
                            </NavLink>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
            {
                showForgotPasswordModal && (
                    <ModalOfForgotPassword onClose={() => setShowForgotPasswordModal(false)} />
                )
            }

        </div>
    );
};

export default Login;

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { getTodaysLessons } from "../services"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [todaysLessons, setTodaysLessons] = useState({
        count: 0,
        totalHours: 0
    });
    const menuRef = useRef(null);
    const { user } = useSelector(state => state.user.user)
    const navigate = useNavigate();

    // Menü dışına tıklandığında menüyü kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchTodaysLessons = async () => {
            try {
                const response = await getTodaysLessons();
                setTodaysLessons(response);
            } catch (error) {
                toast.error('Dersler yüklenirken bir hata oluştu');
            }
        };

        fetchTodaysLessons();
    }, []);

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Sol taraf - Kullanıcı adı */}
                    <div>
                        <div className="text-xl font-semibold text-blue-600 ">
                            {user?.fullName}
                        </div>
                        <span className='text-gray-500 text-sm font-medium'>Bugün için {todaysLessons.count}  ders planlandı</span>
                    </div>

                    {/* Sağ taraf - Hamburger menü */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faBars} className='sm:hidden' />
                            {/* <svg
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg> */}

                            <FontAwesomeIcon icon={faUser} className='hidden sm:flex items-center text-lg bg-blue-600 text-white p-2 rounded-full  space-x-2' />
                        </button>

                        {/* Dropdown Menü */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            navigate('/lessons');
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Ders Programı
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Çıkış işlemi buraya gelecek
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 
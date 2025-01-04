import { useState, useEffect } from 'react';
import { getLessons } from '../../services';
import { toast } from 'sonner';
import Header from '../../components/Header';

const LessonsList = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await getLessons();
            if (response.success) {
                setLessons(response.data);
            } else {
                toast.error('Dersler yüklenemedi');
            }
        } catch (error) {
            toast.error('Dersler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Header/>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="sm:text-2xl text-lg font-bold text-gray-900">Ders Programım</h1>
                    <button className="bg-indigo-600 text-white sm:px-4 sm:py-2 px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                        Yeni Ders Ekle
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className='overflow-x-auto'>
                            <div className='inline-block min-w-full align-middle'>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Gün
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Başlangıç
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bitiş
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ders Adı
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {lessons.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    Henüz ders eklenmemiş
                                                </td>
                                            </tr>
                                        ) : (
                                            lessons.map((lesson) => (
                                                <tr key={lesson._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {lesson.dayOfWeek}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {lesson.startTime}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {lesson.endTime}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {lesson.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-900  mr-3 transition-colors duration-200">
                                                            Düzenle
                                                        </button>
                                                        <button className="bg-red-600 text-white hover:bg-red-800 py-1 px-2 rounded-md transition-colors duration-200">
                                                            Sil
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonsList;
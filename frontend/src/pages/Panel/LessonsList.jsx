import React, { useState, useEffect } from 'react';
import { getLessons } from '../../services';
import { toast } from 'sonner';
import Header from '../../components/Header';
import { Popover } from '@headlessui/react';
import {createLesson} from "../../services"
import LessonForm from '../../components/Modal/LessonForm';

const LessonsList = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLessonForm, setShowLessonForm] = useState(false);

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
    console.log(lessons)

    // Gün sıralaması için sabit bir dizi
    const dayOrder = [
        'Pazartesi',
        'Salı',
        'Çarşamba',
        'Perşembe',
        'Cuma',
        'Cumartesi',
        'Pazar'
    ];

    // Dersleri günlere göre grupla ve sırala
    const sortedLessons = [...lessons].sort((a, b) => {
        // Önce gün sırasına göre sırala
        const dayComparison = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);

        // Eğer aynı günse, başlangıç saatine göre sırala
        if (dayComparison === 0) {
            return a.startTime.localeCompare(b.startTime);
        }

        return dayComparison;
    });

    // Dersleri günlere göre grupla
    const groupedLessons = sortedLessons.reduce((groups, lesson) => {
        if (!groups[lesson.dayOfWeek]) {
            groups[lesson.dayOfWeek] = [];
        }
        groups[lesson.dayOfWeek].push(lesson);
        return groups;
    }, {});

    const handleAddLesson = async (lessonData) => {
        console.log("deneme abi")
         try {
             const response = await createLesson(lessonData);
             setShowLessonForm(false);
             toast.success(response.message);
             setTimeout(() => {
                window.location.reload();
             }, 1000);
         } catch (error) {
             toast.error(error.response?.data?.message || 'Ders eklenirken bir hata oluştu');
         }
    };

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="sm:text-2xl text-lg font-bold text-gray-900">Ders Programım</h1>
                    <button
                        onClick={() => setShowLessonForm(true)}
                        className="bg-indigo-600 text-white sm:px-4 sm:py-2 px-2 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                        Yeni Ders Ekle
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Gün
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Başlangıç
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Bitiş
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Ders Adı
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Not
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                                            dayOrder.map(day => {
                                                const dayLessons = groupedLessons[day] || [];
                                                if (dayLessons.length === 0) return null;

                                                return (
                                                    <React.Fragment key={day}>
                                                        <tr className="bg-gray-50">
                                                            <td colSpan="6" className="px-6 py-3 text-left text-sm bg-gray-400/20   font-semibold text-gray-900">
                                                                {day}
                                                            </td>
                                                        </tr>
                                                        {dayLessons.map((lesson, index) => (
                                                            <tr key={lesson._id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <span className='font-bold '>{index + 1}.</span>
                                                                    Ders
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {lesson.startTime}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {lesson.endTime}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-900">
                                                                    {lesson.name}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                                    {lesson.notes ? (
                                                                        <div>
                                                                            <Popover className="relative">
                                                                                <Popover.Button className="focus:outline-none">
                                                                                    <div className='max-w-[120px] truncate cursor-pointer text-blue-500 hover:text-indigo-600'>{lesson.notes}</div>
                                                                                </Popover.Button>

                                                                                <Popover.Panel className="absolute z-10 w-64 p-2 mt-2 bg-gray-100 rounded-lg shadow-lg shadow-gray-300 border border-gray-200 right-2 transform  -translate-x-1/2">
                                                                                    <div className="text-sm text-gray-600 overflow-y-auto max-h-[200px] leading-relaxed">
                                                                                        <p>
                                                                                            {lesson.notes}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="absolute -top-2 left-1/2 sm:left-auto sm:right-4 transform -translate-x-1/2 sm:translate-x-0 
                                                                              w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
                                                                                </Popover.Panel>
                                                                            </Popover>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-gray-400">Not yok</span>
                                                                    )}
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
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showLessonForm && (
                <LessonForm
                    onClose={() => setShowLessonForm(false)}
                    onSubmit={handleAddLesson}
                />
            )}
        </div>
    );
};

export default LessonsList;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

//bence bu modala bir tane lesson propu gelmeli eğer gelmez ise default olarak false olsun
//eğer task olursa input değerleri lesson propundan gelsin,eğer yoksa boş olarak gelsin

const getChangedFields = (data, originalData) => {
    // Değişen özellikleri tespit et
    const changedFields = {};
    for (const key in data) {
        if (data[key] !== originalData[key]) {
            changedFields[key] = data[key];
        }
    }
    return changedFields;
};

const LessonForm = ({ onClose, onSubmit, lesson }) => {

    const initialFormData = {
        name: lesson?.name || '',
        instructor: lesson?.instructor || '',
        dayOfWeek: lesson?.dayOfWeek || '',
        startTime: lesson?.startTime || '',
        endTime: lesson?.endTime || '',
        classroom: lesson?.classroom || '',
        color: lesson?.color || '#3B82F6',
        notes: lesson?.notes || ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [originalData] = useState(initialFormData);
    const changes = getChangedFields(formData, originalData);


    const daysOfWeek = [
        'Pazartesi',
        'Salı',
        'Çarşamba',
        'Perşembe',
        'Cuma',
        'Cumartesi',
        'Pazar'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (lesson) {
            onSubmit(lesson._id, formData);
        } else {
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-lg">
                    <h2 className="text-lg sm:text-xl bg-green-800/50 text-white px-3 py-1 rounded-md font-semibold text-gray-800">{lesson ? "Ders Güncelle" : "Yeni Ders Ekle"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white bg-red-600 px-3 py-1 rounded-md  p-1"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className='overflow-y-auto flex-1'>
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ders Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Öğretim Görevlisi
                                </label>
                                <input
                                    type="text"
                                    name="instructor"
                                    value={formData.instructor}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gün
                                </label>
                                <select
                                    name="dayOfWeek"
                                    value={formData.dayOfWeek}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Gün Seçin</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlangıç
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bitiş
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sınıf
                                </label>
                                <input
                                    type="text"
                                    name="classroom"
                                    value={formData.classroom}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Renk
                                </label>
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-full h-8 sm:h-10 p-1 border  border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notlar (İsteğe Bağlı)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 text-sm sm:text-base border bg-gray-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="border-t p-4 sm:p-6 sticky bottom-0 bg-white rounded-b-lg">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-700 text-gray-200 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                >
                                    İptal
                                </button>
                                <button
                                    disabled={Object.keys(changes).length != 0 ? false : true}
                                    type="submit"
                                    className="px-3 sm:px-4 py-2 text-sm disabled:opacity-50 sm:text-base bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-300 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                                    {lesson ? "Güncelle" : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LessonForm;

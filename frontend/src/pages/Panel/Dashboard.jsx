import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus,
  faTimes,
  faBell,
  faBook,
  faChartLine,
  faInfoCircle,
  faCalendar,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux"
import LessonForm from '../../components/Modal/LessonForm';
import { createLesson } from '../../services';
import { toast } from 'sonner';
import { Popover } from '@headlessui/react';
import { fetchDashboardData } from '../../hooks/useDashboardData';


// Tarih formatı
const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// Saat formatı
const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};

const Dashboard = () => {
  const { user } = useSelector(state => state.user.user)
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [todaysLessonsArray, setTodaysLessonsArray] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [todaysLessons, setTodaysLessons] = useState({
    count: 0,
    totalHours: 0
  });
  const [activeReminders, setActiveReminders] = useState({
    total: 0,
    todayCount: 0,
    reminders: []
  });
  const [progress, setProgress] = useState({
    totalHours: 0,
    completedHours: 0,
    percentage: 0
  });

  // Tarih ve saati her saniye güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Veri yükleme fonksiyonunu useCallback ile sarmalayalım
  const loadDashboardData = useCallback(async () => {
    console.log("Veri yükleniyor...");
    await Promise.all([
      fetchDashboardData.fetchTodaysLessons(setTodaysLessons, setTodaysLessonsArray),
      fetchDashboardData.fetchActiveReminders(setActiveReminders),
      fetchDashboardData.fetchProgress(setProgress)
    ]);
  }, []); // Dependency array boş çünkü setter fonksiyonları stabil

  useEffect(() => {
    // İlk yükleme
    loadDashboardData();

    // Her 1 dakikada bir yenile
    const intervalId = setInterval(() => {
      loadDashboardData();
    }, 60000); // 10 saniye

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [loadDashboardData]);

  const handleAddLesson = async (lessonData) => {
    try {
      const response = await createLesson(lessonData);
      setShowLessonForm(false);
      await loadDashboardData();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ders eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bölümü */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - MD ve üstünde görünür */}
            <div className="hidden md:flex items-center">
              <div className='bg-blue-900/80 py-3 px-2 rounded-full'>
                <img
                  src="/logo/mylogo.svg" // Logo yolunu güncelleyin
                  alt="Logo"
                  className="h-8 w-auto select-none"
                />
              </div>
            </div>

            {/* Hoşgeldin Mesajı */}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Hoşgeldin, <span className="text-blue-600">{user.fullName}</span>
              </h1>
              <span className='text-gray-500 text-sm font-medium'>Bugün için {todaysLessons.count} ders planlandı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 lg:px-4 mt-5">
        {/* Ana Aksiyon Butonu */}
        <div className="text-center grid grid-cols-1 lg:grid-cols-2 items-center justify-between mb-8">
          <button
            onClick={() => setShowLessonForm(true)}
            className="bg-blue-600 hover:bg-blue-700 mb-3 md:mb-0 lg:w-[55%] text-white px-6 lg:px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
            Yeni Ders Programı Oluştur
          </button>
          {/* Tarih ve Saat Bilgisi */}
          <div className="flex justify-end pr-3">
            <div className="text-right">
              <p className="text-gray-600 font-medium">
                {currentDateTime.toLocaleDateString('tr-TR', dateOptions)}
              </p>
              <p className="text-gray-500 font-mono">
                {currentDateTime.toLocaleTimeString('tr-TR', timeOptions)}
              </p>
            </div>
          </div>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-md border border-blue-100">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 text-xl mr-2" />
              <h3 className="text-lg font-semibold">Bugünkü Dersler</h3>
            </div>
            <div className='flex items-center justify-between'>
              <p className="text-2xl font-bold text-gray-800">{todaysLessons.count} adet</p>
              <p className="text-gray-600 font-medium">Toplam {todaysLessons.totalHours} saat</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-md border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faBell} className="text-purple-600 text-xl mr-2" />
                <h3 className="text-lg font-semibold">Aktif Hatırlatıcılar</h3>
              </div>
              <div>
                <Popover className="relative">
                  <Popover.Button className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Popover.Button>

                  <Popover.Panel className="absolute z-10 w-64 p-2 mt-2 bg-gray-100 rounded-lg shadow-lg shadow-gray-300 border border-gray-200 
                  right-0 transform translate-x-2">
                    <div className="text-sm text-gray-600 leading-relaxed">
                      <p>
                        Aktif hatırlatıcılar, bugün ve bir sonraki gün içerisinde planlanan
                        henüz başlamamış derslerinizi gösterir.
                      </p>
                      <p className="mt-2">
                        "Bugün için" ibaresi, bu dersler arasından bugüne denk gelen
                        derslerin sayısını belirtir.
                      </p>
                    </div>
                    <div className="absolute -top-2 left-1/2 sm:left-auto sm:right-4 transform -translate-x-1/2 sm:translate-x-0 
                      w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
            <div className='flex items-center justify-between'>

              <span className="text-2xl font-bold text-blue-600">
                {activeReminders.total}
              </span>
              <p className="text-gray-600">
                {activeReminders.todayCount} tanesi bugün için
              </p>
            </div>

          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow-md border border-green-100">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xl mr-2" />
              <h3 className="text-lg font-semibold">Haftalık İlerleme</h3>
            </div>
            <div className='flex items-center justify-between'>
              <p className="text-2xl font-bold text-gray-800">{progress.percentage}%</p>
              <p className="text-gray-600 font-medium">
                {progress.completedHours}/{progress.totalHours} saat tamamlandı
              </p>
            </div>
          </div>
        </div>

        {/* Günün Programı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-5">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-xl mr-2" />
                <h3 className="text-lg font-semibold">Günün Dersleri</h3>
              </div>
              <div className="space-y-4">
                {/* Örnek Ders Kartı */}
                {
                  todaysLessonsArray.length === 0 ? (
                    <p className="text-gray-500">Bugün için planlanmış ders bulunmuyor.</p>
                  ) : (
                    todaysLessonsArray.map((lesson) => (
                      <div key={lesson._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-white rounded-r shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{lesson.name}</h4>
                            <p className="text-gray-600 text-sm">
                              {lesson.startTime} - {lesson.endTime}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsDetailModalOpen(true);
                            }}
                            className="text-blue-800 bg-blue-600/20 px-2 py-1 rounded-md hover:text-blue-800"
                          >
                            Detaylar
                          </button>
                        </div>
                      </div>
                    ))
                  )
                }
                {/* Diğer dersler buraya eklenebilir */}
              </div>
            </div>
          </div>

          {/* Sağ Sidebar - Yaklaşan Hatırlatıcılar */}
          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow-md border border-green-100">
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faCalendar} className='text-red-600 text-xl mr-2' />
              <h2 className="text-xl font-semibold">Yaklaşan Hatırlatıcılar</h2>
            </div>
            <div className="space-y-4">
              {activeReminders.reminders.length === 0 ? (
                <p className="text-gray-500">Aktif hatırlatıcı bulunmuyor</p>
              ) : (
                activeReminders.reminders.map(reminder => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-blue-50 rounded shadow-sm border border-blue-100">
                    <div>
                      <p className="font-semibold">{reminder.name}</p>
                      <p className="text-sm text-gray-600">
                        {reminder.timeUntilStart} sonra , {reminder.classroom}
                      </p>
                    </div>
                    <FontAwesomeIcon icon={faBell} className="text-blue-600" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ders Ekleme Formu Modal */}
      {showLessonForm && (
        <LessonForm
          onClose={() => setShowLessonForm(false)}
          onSubmit={handleAddLesson}
        />
      )}

      {/* Responsive Modal with Lesson Details */}
      {isDetailModalOpen && selectedLesson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 px-4 py-6 sm:px-0">
          <div className="relative top-10 mx-auto p-3 border shadow-lg rounded-md bg-white 
            w-full max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl bg-blue-600/20 px-2 py-1 rounded-md font-medium text-black">
                  Ders Detayları
                </h3>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedLesson(null);
                  }}
                  className="text-gray-100 bg-red-600 px-2 py-1 rounded-md hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Ders Adı</h4>
                  <p className="mt-1 text-base font-semibold text-gray-500">{selectedLesson.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Sınıf</h4>
                  <p className="mt-1 text-base font-semibold text-gray-500">{selectedLesson.classroom}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Gün</h4>
                  <p className="mt-1 text-base font-semibold text-gray-500">{selectedLesson.dayOfWeek}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Saat Aralığı</h4>
                  <p className="mt-1 text-base font-semibold text-gray-500">
                    {selectedLesson.startTime} - {selectedLesson.endTime}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Öğretim Görevlisi</h4>
                  <p className="mt-1 text-base font-semibold text-gray-500">{selectedLesson.instructor}</p>
                </div>
              </div>

              {/* <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedLesson(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                    transition-colors text-sm sm:text-base"
                >
                  Kapat
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
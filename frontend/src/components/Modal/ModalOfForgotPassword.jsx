import { useState } from 'react';
import { forgotPassword } from '../../services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


const ModalOfForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await forgotPassword(email);
      setMessage(response.message);
      // 3 saniye sonra modalı kapat
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      setError(error.response?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-xl z-50 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg bg-blue-800/70 select-none rounded-md px-2 py-1 text-white font-bold text-gray-900">Şifremi Unuttum</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FontAwesomeIcon icon={faXmark} className='text-lg bg-red-500 rounded-md px-2 py-1 text-white'/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Adresi
            </label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md p-2 outline-none border-2 border-gray-300 focus:border-purple-600"
              placeholder="ornek@email.com"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          {message && (
            <div className="text-sm text-green-600">{message}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalOfForgotPassword; 
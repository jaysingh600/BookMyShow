import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, register, reset } from '../store/authSlice';
import { MdClose } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      onClose();
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, dispatch, onClose]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-sm rounded-lg overflow-hidden shadow-xl relative transition-all">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-dark">Get Started</h2>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          <div className="space-y-4 mb-6">
            <button className="w-full flex items-center justify-center space-x-2 border rounded-md py-3 text-sm font-medium hover:bg-gray-50 transition">
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-4 items-center mb-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required className="w-full p-3 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
              </div>
            )}
            <div>
              <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required className="w-full p-3 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required className="w-full p-3 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-md font-semibold transition mt-4">
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import { use, useEffect, useId } from 'react';
import { useState } from 'react';
import MailIcon from '../../icons/MailIcon';
import LockIcon from '../../icons/LockIcon';
import ShowPassword from '../../icons/ShowPassword';
import HiddenPassword from '../../icons/HiddenPassword';
import { images } from '../../assets/assets';
import { useNavigate } from 'react-router';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const id = useId();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <section className='container m-auto flex flex-col items-center justify-center h-screen gap-10 '>
      <div className='flex flex-col gap-5 border border-gray-200 p-5 rounded-md sm:w-[450px]  shadow-lg'>
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-4xl text-(--text-primary) font-bold text-center'>
            Welcome back
          </h1>
          {/* <p className='text-lg text-(--text-secondary) text-center'>
            Sign in to access your tasks and manage your progress.
          </p> */}
        </div>

        <form className='flex flex-col gap-5'>
          {['email', 'password'].map((data, index) => {
            return (
              <div key={id + index} className='flex flex-col gap-2 '>
                <label
                  htmlFor={`input-${index}`}
                  className='text-lg font-medium'
                >
                  {data.toUpperCase()}
                </label>

                <div className='flex items-center gap-2 border border-gray-200 rounded-md p-3'>
                  {data === 'email' ? <MailIcon /> : <LockIcon />}
                  <input
                    type={data === 'password' && show ? 'text' : 'password'}
                    name={data}
                    id={`input-${index}`}
                    value={loginData[data]}
                    placeholder={`${
                      data === 'email' ? 'example@gmail.com' : 'password'
                    }`}
                    onChange={handleChange}
                    className='w-full bg-transparent outline-none'
                  />
                  {data === 'password' && (
                    <button
                      onClick={() => setShow((prev) => !prev)}
                      type='button'
                    >
                      {show ? <ShowPassword /> : <HiddenPassword />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button>
            <button
              type='submit'
              className='bg-(--bg-quaternary) px-10 py-3 rounded-md text-(--text-primary) text-xl hover:shadow-2xl shadow-(--shadow-primary) w-full font-medium'
            >
              Login
            </button>
          </button>
        </form>

        <div className='flex  gap-2 items-center'>
          <div className='w-1/2 h-0.5 bg-(--bg-quinary)'></div>

          <span className='text-lg font-medium'>OR</span>

          <div className='w-1/2 h-0.5 bg-(--bg-quinary)'></div>
        </div>

        <button className='bg-(--bg-quaternary) px-10 py-2 rounded-md text-(--text-primary) text-xl hover:shadow-2xl shadow-(--shadow-primary) font-medium flex items-center gap-2 justify-center'>
          <img src={images.google_logo} alt='' className='size-10' />
          Log in With Google
        </button>

        <div className='flex  gap-2 items-center justify-center'>
          <p className='text-lg text-(--text-secondary) text-center'>
            Don't have an account?
          </p>
          <button className='text-lg text-(--text-primary) font-medium' onClick={()=>navigate("/signup") }>
            Sign up here
          </button>
        </div>
      </div>
    </section>
  );
};
export default Login;

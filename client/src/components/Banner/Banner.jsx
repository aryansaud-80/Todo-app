import { useNavigate } from 'react-router';

const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className='container m-auto flex flex-col items-center justify-center h-screen gap-10 bg-(--bg-primary)'>
      <h1 className='text-7xl font-extrabold w-1/2 text-center'>
        A simple to do list to manage it all
      </h1>
      <p className='text-lg font-semibold text-center w-1/2 text-gray-500'>
        Keep track of your tasks and manage them with ease. Add new tasks, mark
        them as completed, and delete them when you're done.
      </p>

      <button
        className='bg-(--button-primary) px-10 py-3 rounded-md text-(--text-primary) text-xl hover:shadow-2xl shadow-(--shadow-primary)'
        onClick={() => {
          navigate('/login');
        }}
      >
        Get started
      </button>
    </section>
  );
};
export default Banner;

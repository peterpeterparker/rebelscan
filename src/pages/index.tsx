import Header from '../components/header/Header';

import dynamic from 'next/dynamic';
const Home = dynamic(() => import('../components/home/Home'), {ssr: false});

const Index = () => {
  return (
    <>
      <Header></Header>

      <Home></Home>
    </>
  );
};

export default Index;

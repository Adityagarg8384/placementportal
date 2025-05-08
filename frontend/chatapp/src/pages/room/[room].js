import dynamic from 'next/dynamic';

// Load your Room component only in the browser
const Room = dynamic(
  () => import('../../component/room'),
  { ssr: false }
);

export default Room;
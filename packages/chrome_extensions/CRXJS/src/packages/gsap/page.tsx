import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { useRef } from 'react'
export default function Page() {
  const container = useRef(null);
  useGSAP(() => {
    gsap.to(container.current, { rotation: 360, duration: 1, repeat: -1 })
    gsap.to(container.current, { width: '132px', height: '132px', duration: 1})
  }, {
    scope: container
  })
  return (
    <div className="w-full h-full p-4" >
      <div className='w-30 h-30 bg-info-content rounded-full text-center text-white relative outline outline-red-300' >
        <div ref={container} className="w-10 h-10 bg-radial from-transparent from-0% via-transparent via-[100% - 10px] via-green-700 via-[100% - 10px] to-green-700 to-100% rounded-full absolute top-1/2 left-1/2 -translate-1/2" >

        </div>
      </div>
    </div>
  );
}

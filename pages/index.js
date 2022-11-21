import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Home() {
  return (
    <div className="w-screen h-screen bg-black">
      <div className='absolute top-5 w-full z-10 px-10'>
        <div className='flex text-white font-mono font-extralight gap-5 justify-between items-center'>
          <div className='text-2xl'>
            ARES ROBOTICS
          </div>
          <div className='flex gap-5 text-lg'>
            <div>about</div>
            <div>team</div>
            <div>contact</div>
          </div>
        </div>
      </div>
      <Scene/>
    </div>
  )
}

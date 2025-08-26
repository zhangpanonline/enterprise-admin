import { useState } from 'react'

export default function Page() {
  const [cpu, setCpu] = useState<chrome.system.cpu.CpuInfo & { temperatures?: Array<number> }>();
  chrome.system.cpu.getInfo().then((r) => {
    setCpu(r)
  });
  const [memory, setMemory] = useState<{ [K in keyof chrome.system.memory.MemoryInfo] : string } & { used: string }>();
  chrome.system.memory.getInfo().then(r => {
    setMemory({
      capacity: Math.round(r.capacity / (1024 * 1024)) + 'MB' + `（${Math.round(r.capacity / (1024 * 1024 * 1024))}GB）`,
      availableCapacity: Math.round(r.availableCapacity / (1024 * 1024)) + 'MB' + `（${Math.round(r.availableCapacity / (1024 * 1024 * 1024))}GB）`,
      used: Math.round((r.capacity - r.availableCapacity) / (1024 * 1024)) + 'MB' + `（${Math.round((r.capacity - r.availableCapacity) / (1024 * 1024 * 1024))}GB）`,
    })
  })
  return (
    <div className="w-full h-full p-4" >
      <div className="divider divider-info">系统的基本 CPU 信息</div>
      <ul className="grid grid-cols-[130px_1fr]" >
        <li className='text-info text-sm' >处理器架构名称：</li>
        <li className='text-sm' >{cpu?.archName ?? '-'}</li>
        <li className='text-info text-sm' >处理器的型号名称：</li>
        <li className='text-sm' >{cpu?.modelName ?? '-'}</li>
        <li className='text-info text-sm' >CPU 温度：</li>
        <li className='text-sm' >{cpu?.temperatures?.join('°C') ?? '-'}</li>
        <li className='text-info text-sm' >处理器特征码：</li>
        <li className='text-sm' >{cpu?.features?.join(',') ?? '-'}</li>
        <li className='text-info text-sm' >逻辑处理器数量：</li>
        <li className='text-sm' >{cpu?.numOfProcessors ?? '-'}</li>
      </ul>
      <ul className="pl-[130px]" >
        {
          cpu?.processors?.map(({ usage }, index) => {
            return (
                <li key={index} >
                  <span className='text-info text-sm' >处理器 {index + 1}： </span>
                  {`user：${usage.user}，kernel：${usage.kernel}，idle：${usage.idle}，total：${usage.total}`}
                </li>
            )
          })
        }
      </ul>
      <div className="divider divider-info">系统的物理内存信息</div>
      <ul className='text-sm grid grid-cols-3' >
        <li>
          <span className='text-info' >总内存：</span>
          <span>{memory?.capacity ?? '-'}</span>
        </li>
        <li>
          <span className='text-info' >可用内存：</span>
          <span>{memory?.availableCapacity ?? '-'}</span>
        </li>
        <li>
          <span className='text-info' >已用内存：</span>
          <span>{memory?.used ?? '-'}</span>
        </li>
      </ul>
    </div>
  );
}

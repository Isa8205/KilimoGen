import React, { useEffect, useState } from 'react'
import { Minus, Square, Maximize2, X, Minimize2, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false)
  const navigation = useNavigate()


  const handleMinimize = () => {
    window.api.window.minimize()
  }

  const handleToggleMax = async () => {
    if (isMaximized) {
      await window.api.window.maximize()
      setIsMaximized(false)
    } else {
      await window.api.window.maximize()
      setIsMaximized(true)
    }
  }

  const handleClose = () => {
    window.api.window.close()
  }

  const menus = ['File', 'Edit', 'View', 'Help']

//   Handle window navigation back and forward
    const handleBack = () => {
        navigation(-1)
    }

    const handleForward = () => {
        navigation(1)
    }

  return (
    <div
      className={
        `[-webkit-app-region:drag] flex items-center justify-between ` +
        `w-full bg-[#1F2937] h-[35px] border-b border-[#252525] select-none`
      }
    >
      {/* App title + icon */}
      <div className="flex items-center pl-2 text-xs">  
        <span className='ml-2'>Kilimogen</span>
      </div>


      {/* Menu bar */}
      <div className="flex items-center space-x-2 ml-2 [-webkit-app-region:no-drag] text-xs">
      {/* Back and front navigation */}
        <div className="flex items-center gap-2 [-webkit-app-region:no-drag] text-xs">
            <button
            title='Back'
            onClick={handleBack}
            className=" h-full flex items-center cursor-pointer hover:bg-[#383838]"
            >
            <ChevronLeft size={18}/>
            </button>
            <button
            title='Forward'
            onClick={handleForward}
            className=" h-full flex items-center cursor-pointer hover:bg-[#383838]"
            >
            <ChevronRight size={18}/>
            </button>
        </div>
        {menus.map((m) => (
          <div
            key={m}
            className="px-2 h-full flex items-center cursor-pointer hover:bg-[#383838]"
          >
            {m}
          </div>
        ))}
      </div>

      {/* Window controls */}
      <div className="flex h-full">
        <button
          onClick={handleMinimize}
          title="Minimize"
          className={
            `[-webkit-app-region:no-drag] flex items-center justify-center ` +
            `w-12 h-full text-xs transition-colors ` +
            `hover:bg-[#383838]`
          }
        >
          <Minus size={16} />
        </button>

        <button
          onClick={handleToggleMax}
          title={!isMaximized ? 'Restore' : 'Maximize'}
          className={
            `[-webkit-app-region:no-drag] flex items-center justify-center ` +
            `w-12 h-full text-xs transition-colors ` +
            `hover:bg-[#383838]`
          }
        >
          {isMaximized ? <Square size={16} /> : <Minimize2 size={16} />}
        </button>

        <button
          onClick={handleClose}
          title="Close"
          className={
            `[-webkit-app-region:no-drag] flex items-center justify-center ` +
            `w-12 h-full text-xs transition-colors ` +
            `hover:bg-[#e81123]`
          }
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default TitleBar

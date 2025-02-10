import React from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none'
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal

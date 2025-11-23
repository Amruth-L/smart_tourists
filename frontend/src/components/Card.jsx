import { motion } from 'framer-motion'
import React from 'react'

export default function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  )
}

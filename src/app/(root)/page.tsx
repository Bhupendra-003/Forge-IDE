import React from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
function page() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
      </div>
    </div>
  )
}

export default page

"use client"

import dynamic from "next/dynamic"
import React, { Suspense } from "react"

const TeacherPage = dynamic(() => import("./TeacherClient"), { ssr: false });

function page() {
  return (
    <Suspense>
      <TeacherPage />
    </Suspense>
  )
}

export default page
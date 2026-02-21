"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic";

const StudentPage = dynamic(() => import("./StudentClient"), { ssr: false });

function page() {
  return (
    <Suspense>
      <StudentPage />
    </Suspense>
  )
}

export default page
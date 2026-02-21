import React, { Suspense } from "react"
import StudentClient from "./StudentClient"

function page() {
  return (
    <Suspense>
      <StudentClient />
    </Suspense>
  )
}

export default page
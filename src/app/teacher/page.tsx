import React, { Suspense } from "react"
import TeacherClient from "./TeacherClient"

function page() {
  return (
    <Suspense>
      <TeacherClient />
    </Suspense>
  )
}

export default page
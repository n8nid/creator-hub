import { Suspense } from "react"
import { TalentDirectory } from "@/components/talent-directory"
import { TalentDirectorySkeleton } from "@/components/talent-directory-skeleton"

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<TalentDirectorySkeleton />}>
        <TalentDirectory />
      </Suspense>
    </div>
  )
}

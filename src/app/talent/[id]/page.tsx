import { Suspense } from "react"
import { TalentProfile } from "@/components/talent-profile"
import { TalentProfileSkeleton } from "@/components/talent-profile-skeleton"

interface TalentProfilePageProps {
  params: {
    id: string
  }
}

export default function TalentProfilePage({ params }: TalentProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<TalentProfileSkeleton />}>
        <TalentProfile profileId={params.id} />
      </Suspense>
    </div>
  )
}

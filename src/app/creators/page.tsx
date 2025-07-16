import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GradientCircle from "@/components/GradientCircle";

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/creators");
        const json = await res.json();
        if (res.ok) {
          setCreators(json.creators || []);
        } else {
          setError(json.error || "Gagal memuat data creator");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data creator");
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Gradient circles langsung di halaman */}
      <GradientCircle
        type="hero"
        style={{
          top: "20vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      <GradientCircle
        type="about"
        style={{
          top: "70vh",
          right: "15vw",
          transform: "translateX(50%)",
          zIndex: -1,
        }}
      />

      <div className="relative z-10">
        <h1 className="text-4xl font-bold">All Creators</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {loading ? (
            <div className="col-span-3 text-center">Loading...</div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">{error}</div>
          ) : creators.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">
              Belum ada creator terdaftar.
            </div>
          ) : (
            creators.map((creator: any) => (
              <div
                className="border p-4 rounded-lg text-center"
                key={creator.id}
              >
                <img
                  src={creator.profile_image || "/placeholder-user.jpg"}
                  alt={creator.name}
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <h3 className="text-xl font-bold mt-4">{creator.name}</h3>
                <p>{creator.bio || "-"}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {creator.location || "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

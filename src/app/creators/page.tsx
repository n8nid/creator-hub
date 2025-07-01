import { Button } from "@/components/ui/button";

export default function CreatorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">All Creators</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Placeholder for creators */}
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 1" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 1</h3>
          <p>Description of creator 1.</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 2" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 2</h3>
          <p>Description of creator 2.</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 3" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 3</h3>
          <p>Description of creator 3.</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 4" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 4</h3>
          <p>Description of creator 4.</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 5" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 5</h3>
          <p>Description of creator 5.</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <img src="/placeholder-user.jpg" alt="Creator 6" className="w-24 h-24 rounded-full mx-auto"/>
          <h3 className="text-xl font-bold mt-4">Creator 6</h3>
          <p>Description of creator 6.</p>
        </div>
      </div>
    </div>
  );
}

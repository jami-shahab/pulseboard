import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-gray-600">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>
      {/* Placeholder for main content / dashboard */}
      <div className="mt-10">
        <p className="text-center text-gray-500">Dashboard content will go here...</p>
      </div>
    </div>
  );
}

import { StoreTest } from '@/components/test/StoreTest';

export default function TestStoresPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">Zustand Store Testing</h1>
      <StoreTest />
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          This is a test page to verify our Zustand stores are working correctly.
          Try clicking the buttons to test state updates.
        </p>
      </div>
    </div>
  );
}
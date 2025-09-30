import React from "react";

export default function TestPage() {
  return (
    <div className="h-full bg-yellow-200 flex flex-col">
      <div className="bg-red-200 p-4">Header</div>
      <div className="flex-grow bg-green-200 p-4">Content</div>
      <div className="bg-blue-200 p-4">Footer</div>
    </div>
  );
}

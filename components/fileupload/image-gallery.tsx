// pages/index.tsx

import Image from "next/image";
import prettyBytes from "pretty-bytes";

export const ImageGallery = ({ images }: any) => {
  return (
    <ul
      role="list"
      className="py-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {images.map((image: any) => (
        <li key={image.source} className="relative">
          <div className="group h-48 aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 relative">
            <Image
              src={image.source}
              fill
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              alt=""
              quality={100}
              className="pointer-events-none object-cover group-hover:opacity-75"
            />
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {image.title}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
            {image.title}
          </p>
          <p className="pointer-events-none block text-sm font-medium text-gray-500">
            {prettyBytes(image.size)}
          </p>
        </li>
      ))}
    </ul>
  );
};

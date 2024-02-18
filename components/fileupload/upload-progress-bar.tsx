export const UploadProgressBar = ({ progress }: any) => (
  <div className="py-5">
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className={`${
          progress === 0 ? "invisible" : ""
        } bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`}
        style={{ width: progress + "%" }}
      >
        {progress}%
      </div>
    </div>
  </div>
);

import ReactPlayer from "react-player"; // Import ReactPlayer
import prettyBytes from "pretty-bytes";
import VideoPlayer from "../video/video-player";

export const VideoGallery = ({ videos }: any) => {
  console.log(videos);
  return (
    <ul
      role="list"
      className="py-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {videos.map((video: any) => (
        <li key={video.source} className="relative">
          <VideoPlayer src={video.source} />
        </li>
      ))}
    </ul>
  );
};

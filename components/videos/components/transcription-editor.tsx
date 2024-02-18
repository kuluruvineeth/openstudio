import TranscriptionItem from "./transcription-item";

export default function TranscriptionEditor({
  awsTranscriptionItems,
  setAwsTranscriptionItems,
}: any) {
  function updateTranscriptionItem(index: any, prop: any, ev: any) {
    const newAwsItems = [...awsTranscriptionItems];
    const newItem = { ...newAwsItems[index] };
    newItem[prop] = ev.target.value;
    newAwsItems[index] = newItem;
    setAwsTranscriptionItems(newAwsItems);
  }

  return (
    <>
      <div className="grid grid-cols-3 sticky top-0 bg-violet-800/80 p-2 rounded-md">
        <div>From</div>
        <div>End</div>
        <div>Content</div>
      </div>
      {awsTranscriptionItems.length > 0 && (
        <div className="h-48 sm:h-auto overflow-y-scroll sm:overflow-auto">
          {awsTranscriptionItems.map((item: any, key: any) => (
            <div key={key}>
              <TranscriptionItem
                handleStartTimeChange={(ev: any) =>
                  updateTranscriptionItem(key, "start_time", ev)
                }
                handleEndTimeChange={(ev: any) =>
                  updateTranscriptionItem(key, "end_time", ev)
                }
                handleContentChange={(ev: any) =>
                  updateTranscriptionItem(key, "content", ev)
                }
                item={item}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

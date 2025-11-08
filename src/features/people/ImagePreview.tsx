

interface Prev{
    preview: string | null,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
}


function ImagePreview({ preview, setPreview }: Prev) {
    return (
      <>
        {preview && (
          <div
            onClick={() => setPreview(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <img
              src={preview}
              alt="Preview"
              className="max-w-[90%] max-h-[85%] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </>
    );
}

export default ImagePreview;
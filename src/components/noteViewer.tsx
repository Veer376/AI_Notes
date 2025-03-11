import React from 'react';

interface NoteViewerProps {
  note: {
    title: string;
    value: string; // Assuming 'value' contains the base64 image data
  };
  onClose: () => void;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ note, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-4 max-w-4xl max-h-4xl overflow-auto">
        <h2 className="text-2xl font-semibold mb-2">{note.title}</h2>
        <img src={note.value} alt={note.title} className="w-full h-auto" />
        <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ">
          Close
        </button>
      </div>
    </div>
  );
};

export default NoteViewer;
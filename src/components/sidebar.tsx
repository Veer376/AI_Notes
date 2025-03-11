import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import NoteViewer from './noteViewer';
const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: any }) => {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
  const {user} = useAuth();

  const closeNote = () => {
    setSelectedNote(null);
  };

  const toggleMore = () => {
    setShowMore(!showMore);
  };

  const visibleNotes = showMore ? user?.notes : user?.notes?.slice(0, 5); // Show 5 initially

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-gray-700 text-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-blue hover:bg-gray-500 rounded-full p-2"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold p-4">Sketch AI</h1>
        <h3 className="text-lg font-semibold pl-4 pt-4">Saved Notes</h3>
        <ul className="pl-4 pt-3 pr-4 space-y-4 h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
          {visibleNotes?.map((note: any, index: number) => (
            <li key={index}>
              <button onClick={() => setSelectedNote(note)} className="w-full text-left hover:bg-gray-500 rounded-full pl-3 p-1">
                <span>{note.title}</span>
              </button>
            </li>
          ))}
          {user?.notes?.length > 5 && (
            <li>
              <button
                onClick={toggleMore}
                className="w-full text-left text-gray-400 hover:text-white pl-3 p-1"
              >
                {showMore ? "▼ Less" : "▼ More"}
              </button>
            </li>
          )}
        </ul>
        <h3 className="text-lg font-semibold p-5">O {user?.email}</h3>
      </div>

      {selectedNote && <NoteViewer note={selectedNote} onClose={closeNote} />}
    </>
  );
};

export default Sidebar;

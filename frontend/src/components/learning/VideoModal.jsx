import React from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoModal = ({ isOpen, onClose, videoUrl, topicTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="video-modal-header">
          <h3>Video Reference: {topicTitle}</h3>
          <button className="video-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="video-player-wrapper">
          <ReactPlayer
            url={videoUrl}
            controls={true}
            width="100%"
            height="100%"
            playing={true}
          />
        </div>
        
      </div>
    </div>
  );
};

export default VideoModal;
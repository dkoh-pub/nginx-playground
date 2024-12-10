import React from 'react';

function App() {
    return (
        <div className="App">
            <h1>Simple Video Streaming App</h1>
            <video controls width="600">
                <source src="<http://localhost:3010/video>" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default App;
import './App.css';
import Header from './Header.js';
import Footer from './Footer.js';
import { useState } from 'react';
import Scanner from './Scanner';

function App() {
    var title = 'Jedzonko w kuchni';
    var [activeTab, setActiveTab] = useState('');

    function onBottomButtonClick(newActiveTab) {
        setActiveTab(newActiveTab);
    }

    function onBarcodeScanned(code) {
        console.log(`Proper code: ${code}`);
    }

    function onPictureTaken(pictureBlob) {
        console.log(`Picture ${pictureBlob}`);
    }

    return (
        <div className="App">
            <Header title={title} />
            <div className="main-content">
                <aside></aside>
                <main>
                    <Scanner onBarcodeScanned={onBarcodeScanned} onPictureTaken={onPictureTaken} activeTab={activeTab} />
                </main>
            </div>
            <Footer active={activeTab} onBottomButtonClick={onBottomButtonClick} />
        </div>
    );
}

export default App;

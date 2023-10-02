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

    function onBarcodeScanned(code, data) {
        var errorSum = 0;
        data.codeResult.decodedCodes.forEach(code => {
            errorSum += code.error ? code.error : 0; 
        })

        return { code: code, valid: errorSum < 1.45 }; // magic number
    }

  return (
      <div className="App">
          <Header title={ title } />
          <aside></aside>
          <main>
              <Scanner onBarcodeScanned={onBarcodeScanned} activeTab={activeTab}  />
          </main>
          <Footer active={activeTab} onBottomButtonClick={onBottomButtonClick} />
    </div>
  );
}

export default App;

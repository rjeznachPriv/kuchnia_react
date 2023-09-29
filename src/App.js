import './App.css';
import Header from './Header.js';
import Footer from './Footer.js';

function App() {

    var title = 'Jedzonko w kuchni';
    var active = 1;

  return (
      <div className="App">
          <Header title={ title } />
          <aside></aside>
          <main>

          </main>
          <Footer active={ active } />
    </div>
  );
}

export default App;

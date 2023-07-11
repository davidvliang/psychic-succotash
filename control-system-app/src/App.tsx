import Navbar from "./components/Navbar";
import TopInterface from "./components/TopInterface";
// import History from "./components/History";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <TopInterface />
        {/* <History /> */}
      </div>
    </div>
  );
}

export default App;

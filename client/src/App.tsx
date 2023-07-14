import Navbar from "./components/Navbar";
import TopInterface from "./components/TopInterface";
// import History from "./components/History";
// import SocketExample from "./components/example/SocketExample";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <TopInterface />
        {/* <SocketExample /> */}
        {/* <History /> */}
      </div>
    </div>
  );
}

export default App;

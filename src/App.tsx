import { useState } from "react";
import { AppProviders } from "./providers";
import { Layout } from "./page/Layout";
import { Content } from "./components/Content";
import "./App.css";
import "./index.css";

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AppProviders>
      <Layout>
        <Content searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Layout>
    </AppProviders>
  );
}

export default App;

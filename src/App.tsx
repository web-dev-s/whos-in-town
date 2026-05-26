import { AppProviders } from "./providers";
import { Layout } from "./page/Layout/Layout";
import { Content } from "./components/Content";
import "./App.css";
import "./index.css";

function App() {
  return (
    <AppProviders>
      <Layout>
        <Content />
      </Layout>
    </AppProviders>
  );
}

export default App;

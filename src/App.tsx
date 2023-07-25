import { useNav } from './routes';
import Layout from './components/Layout';
import { SnackbarProvider } from 'notistack';

function App() {
  const { routesList, menu, element: routes } = useNav();

  return (
    <div className="AppContainer">
      <SnackbarProvider 
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}>
        <Layout menu={menu}
          routesList={routesList}>
          {routes}
        </Layout>
      </SnackbarProvider>
    </div>
  )
}

export default App;

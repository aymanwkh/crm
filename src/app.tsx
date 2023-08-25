import { createContext, useReducer, useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import MyAppBar from './components/my-app-bar'
import axios from 'axios'
import Reducer from './data/reducer'
import { iContext } from './data/interfaces'
import { getToken } from './data/actions'
import './app.css';
import CircularProgress from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const Register = lazy(() => import('./pages/register'));
const Login = lazy(() => import('./pages/login'));
const NotFound = lazy(() => import('./pages/not-found'));
const Home = lazy(() => import('./pages/home'));

axios.defaults.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://first-express-orm.herokuapp.com/api'
export const AppContext = createContext({} as iContext)
const queryClient = new QueryClient()

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    },
  }),
);

const App = () => {
  const [state, dispatch] = useReducer(Reducer, {})
  const classes = useStyles();
  const history = useHistory()
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = getToken()
        if (token) {
          axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
          const response = await axios.get('/auth/getUser')
          dispatch({type: 'LOGIN', payload: response.data})
        }
      } catch (err) {
        localStorage.removeItem('token')
        history.push('/login')
      }
    }
    getUser()
  }, [])
  return (
    <Suspense fallback={<div className={classes.flexContainer}><CircularProgress size={100} /></div>}>
      <AppContext.Provider value={{state, dispatch}}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MyAppBar />
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/register" component={Register}/>
              <Route path="/login" component={Login}/>
              <Route path="*" component={NotFound}/>
            </Switch>
          </BrowserRouter>
        </QueryClientProvider>
      </AppContext.Provider>
    </Suspense>
  );
}


export default App;

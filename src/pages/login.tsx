import { useState, FormEvent, useContext, useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';
import { AppContext } from '../app'
import { saveToken } from '../data/actions'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

interface errorType {
  email?: string,
  password?: string
}
interface userType {
  name: string,
  email: string,
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const Login = () => {
  const { dispatch } = useContext(AppContext)
  const classes = useStyles();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState(false)
  const history = useHistory()
  useEffect(() => {
    if (error) setError('')
  }, [email, password])
  const handleSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault()
      setWaiting(true)
      const response = await axios.post('/auth/login', {email, password})
      dispatch({type: 'LOGIN', payload: response.data.user})
      saveToken(response.data.token)
      axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`}
      setWaiting(false)
      history.push('/')
    }catch (err) {
      setWaiting(false)
      setError('Login Failed')
    }
  }
  return (
    <Grid container>
      <Snackbar open={!!error}>
        <Alert severity="error" variant="filled">
          Login Failed
        </Alert>
      </Snackbar>
      <Grid item xs={1} sm={3} />
      <Grid item xs={10} sm={6}>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2">
              Sign in
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            name="email"
            onChange={e => setEmail(e.target.value)}
            type="email"
            aria-label="email"
            value={email}
            variant="outlined"
          />
          <FormControl fullWidth variant="outlined" style={{marginTop: '1em'}}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
            id="password"
            aria-label="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            labelWidth={70}
            onChange={e => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={e => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            />
          </FormControl>
          <Box my={2} style={{position: 'relative'}}>
            <Button
              color="primary"
              disabled={waiting || !email || !password || !!error}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Sign in
            </Button>
            {waiting && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Box>
          <Typography color="textSecondary">
            New user?{' '}
            <Link component={RouterLink} to="/register" variant="h6" aria-label="signup">
              Sign up
            </Link>
          </Typography>
        </form>
      </Grid>
      <Grid item xs={1} sm={3} />
    </Grid>
  );
};

export default Login;
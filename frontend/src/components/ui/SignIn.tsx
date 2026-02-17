'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {}),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  
  // New State to toggle between Login and Signup
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  
  // Validation States
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [idError, setIdError] = React.useState(false);

  // Logic States
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Toggle mode helper
  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setFormError('');
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (mode === 'signup') {
      const name = document.getElementById('name') as HTMLInputElement;
      const id = document.getElementById('id') as HTMLInputElement;
      if (!name.value) { setNameError(true); isValid = false; } else { setNameError(false); }
      if (!id.value) { setIdError(true); isValid = false; } else { setIdError(false); }
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const id = formData.get('id');

    setFormError('');
    setLoading(true);

    // Determine endpoint and payload based on mode
    const endpoint = mode === 'login' ? "/login" : "/signup";
    const payload = mode === 'login' 
      ? { email, password } 
      : { id, name, email, password };

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        if (mode === 'signup' && responseData.detail === "Email already registered") {
          setFormError("Email already registered. Please sign in instead.");
        } else {
          setFormError(responseData.detail || `${mode === 'login' ? 'Login' : 'Signup'} failed`);
        }
        setLoading(false);
        return;
      }

      // Success: Store user and redirect
      localStorage.setItem("user", JSON.stringify(responseData));
      
      if (mode === 'login') {
        router.push("/main");
      } else {
        router.push("/onboarding");
      }

    } catch (err) {
      setFormError("Server is offline. Check your FastAPI terminal.");
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {mode === 'login' ? 'Sign in' : 'Join ClubMonkey'}
          </Typography>
          
          {formError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {formError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {/* SIGNUP ONLY FIELDS */}
            {mode === 'signup' && (
              <>
                <FormControl>
                  <FormLabel htmlFor="id">Unique ID</FormLabel>
                  <TextField
                    error={idError}
                    id="id"
                    name="id"
                    placeholder="e.g. sambhav_01"
                    required
                    fullWidth
                    variant="outlined"
                    color={idError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <TextField
                    error={nameError}
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                    fullWidth
                    variant="outlined"
                    color={nameError ? 'error' : 'primary'}
                  />
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            
            {mode === 'login' && (
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            )}

            <ForgotPassword open={open} handleClose={handleClose} />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading 
                ? (mode === 'login' ? "Signing In..." : "Creating Account...") 
                : (mode === 'login' ? "Sign in" : "Create Account")
              }
            </Button>
            
            {mode === 'login' && (
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Forgot your password?
              </Link>
            )}
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              {mode === 'login' ? "Don't have an account? " : "Already a member? "}
              <Link
                component="button"
                type="button"
                onClick={toggleMode}
                variant="body2"
                sx={{ alignSelf: 'center', fontWeight: 'bold' }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in to existing account'}
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
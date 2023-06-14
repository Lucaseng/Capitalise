import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../../customHooks/useAuth";
import Logo from "../../assets/Logo.svg";
import { Alert, AlertTitle, Divider, Fade, IconButton, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

//Copyright bottom of page

//Sign Up Function
export default function SignUp() {
  // Reg Expressions for validation
  const nav = useNavigate();
  const spCh = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const emailF = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [name, setName] = useState("");
  const [nameErrorText, setNameErrorText] = useState("");
  const [success, setSuccess] = useState("");
  // Auth Provider
  const auth = useAuth();
  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));
  useEffect(() => {
    if (auth.error) {
      setEmailErrorText(auth.error);
      auth.error = "";
  
    } else
    if (auth.success) {
      setSuccess(auth.success);
      auth.success = "";
    }
  }, [auth.error, auth.success]);

  //Validators
  const validateName = () => {
    if (!name) {
      setNameErrorText("Please enter a name.");
    } else if (name.length > 50) {
      setNameErrorText("Name has reached maximum characters of 50");
    } else if (spCh.test(name)) {
      setNameErrorText("Please enter a name without special characters");
    } else {
      setNameErrorText("");
      return true;
    }
  };

  const validateEmail = () => {
    if (!email) {
      setEmailErrorText("Please enter email.");
    } else if (email.length > 254) {
      setEmailErrorText("Email exceeded character limit of 254.");
    } else if (!validator.isEmail(email)) {
      setEmailErrorText(
        "Enter a valid email. For example: .ac.nz, .com, .co.nz are commonly used and recommended."
      );
    } else {
      setEmailErrorText("");
      return true;
    }
  };

  const validatePassword = (pw: string, cpw: string) => {
    if (validator.isEmpty(pw)) {
      setPasswordErrorText("Please enter password.");
    } else if (pw.length < 5) {
      setPasswordErrorText("Please enter a password longer than 5 characters");
    } else if (!(pw === cpw)) {
      setPasswordErrorText("Passwords do not match!");
    } else {
      setPasswordErrorText("");
      return true;
    }
  };

  // Submit Function (What happens when you submit the form?)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //Retrieve validation booleans. Must keep this so all errors appear on the UI  at the same time
    const data = new FormData(event.currentTarget);
    //Get all form data and convert to string
    const fn = data.get("fullName") as string;
    const em = data.get("email") as string;
    const pw = data.get("password") as string;
    const cpw = data.get("confirmPassword") as string;
    const n = validateName();
    const e = validateEmail();
    const p = validatePassword(pw, cpw);
    event.preventDefault();
    // Check if all are valid before submitting to server.
    if (n && e && p) {
      //Create object obeying SignUpProp Interface.
      const userToSignUp = { name: fn, email: em.toLowerCase(), password: pw };
      //Pass object to authenticator provider to add user to database.
      auth.signup(userToSignUp);
    }
  };
  //Error Handler

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Link href='/'>
          <Box
            component="img"
            src={Logo}
            alt="logo"
            sx={{
              width: "300px",
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
            }}
          ></Box>
        </Link>
        <Typography sx={{ fontWeight: "700" }} component="h1" variant="h6">
          Register
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                autoComplete="full-name"
                id="fullName"
                required
                autoFocus
                fullWidth
                value={name}
                error={!!nameErrorText}
                helperText={nameErrorText}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                helperText="Capstone Students: Use @aucklanduni.ac.nz email"
                value={email}
                error={!!emailErrorText}              
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
                error={!!passwordErrorText}
                helperText={passwordErrorText}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="off"
                error={!!passwordErrorText}
                helperText={passwordErrorText}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            disabled={success ? true : false}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {success && (
            <Alert severity="success">
              <AlertTitle>Successfully signed up!</AlertTitle>
              
                Please check your email for a confirmation email to activate
                your account.
              
            </Alert>
          )}
          {emailErrorText && (
            <Alert severity="error">
              <AlertTitle>Something went wrong!</AlertTitle>
              
                {emailErrorText}
              
            </Alert>
          

          )}
      
          <Divider></Divider>
          <Button
            href={`${API_URL}/api/auth/google`}
            fullWidth
            disabled={success ? true : false}
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign up with Google
          </Button>
          <Grid sx={{ mb: 2 }} container justifyContent="center">
            <Grid item>
              <Link href="/login" underline="hover" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

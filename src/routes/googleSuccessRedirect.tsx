import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useAuth } from "../customHooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";

export default function GoogleSuccessRedirect() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#2196F3");
  useEffect(() => {
    setLoading(true)
    auth.googleAuth();
    setTimeout(() => {
      navigate("/");
      setLoading(false);

    }, 2500)
  }, [])
  return (
    // Yathi - Added neg margin
    <div style={{ margin: '-8vh' }}>
      <Grid container direction="column" display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" sx={{ height: '100vh' }}>
        <Grid item >


          <HashLoader
            color={color}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader" />
        </Grid>
        <Grid item >
          {/* Yathi - Need to change colour to match our theme */}
          <Typography fontWeight={500} color={color} sx={{ mt: 6 }}>Successfully activated your new account. Redirecting back to homepage...</Typography>
        </Grid>
      </Grid>
    </div>

  );



}

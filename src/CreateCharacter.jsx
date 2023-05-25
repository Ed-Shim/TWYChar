import React, { useState } from "react";
import { Container, Grid, TextField, Button, Typography, Box, CssBaseline, useMediaQuery, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"; // CSS Styles

const CreateCharacter = () => {
  const [characterSettings, setCharacterSettings] = useState([]);
  const [sampleResponses, setSampleResponses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newSetting, setNewSetting] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [apiKey, setApiKey] = useState(""); // state for the API key
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5', // This is a pleasant blue color.
      },
      secondary: {
        main: '#f44336', // This is a matching red color for contrast.
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      button: {
        textTransform: 'none', // Removes the uppercase transformation from buttons.
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("settings", JSON.stringify(characterSettings));
    formData.append("responses", JSON.stringify(sampleResponses));
    formData.append("apiKey", apiKey);
    if (selectedImage) formData.append("image", selectedImage, selectedImage.name);

    try {
      const result = await fetch("https://character-server.eisukeshimizu.repl.co/create-chatbot", {
        method: "POST",
        body: formData,
      });

      const body = await result.json();
      console.log(body);
      setNewSetting("");
      setNewResponse("");
      navigate("/chatroom");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const totalCharacters = [...characterSettings, ...sampleResponses].join().length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Create Your Character!
        </Typography>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h2" gutterBottom color="secondary">
                Upload Image
              </Typography>
              <Button variant="contained" component="label" color="primary" fullWidth>
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Character" style={{ width: '100%', marginTop: theme.spacing(2) }} />
              ) : (
                <Typography color="textSecondary" style={{ marginTop: theme.spacing(2) }}>
                  No image selected
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2">Character Settings</Typography>
              {characterSettings.map((setting, index) => (
                <Box key={index} display="flex" justifyContent="space-between">
                  <Typography>{setting}</Typography>
                  <Button variant="outlined" color="secondary" onClick={() => setCharacterSettings(characterSettings.filter((_, i) => i !== index))}>X</Button>
                </Box>
              ))}
              <TextField label="New setting" value={newSetting} onChange={(e) => setNewSetting(e.target.value)} />
              <Button variant="contained" color="primary" onClick={() => { setCharacterSettings([...characterSettings, newSetting]); setNewSetting(""); }}>Add Setting</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2">Sample Responses</Typography>
              {sampleResponses.map((response, index) => (
                <Box key={index} display="flex" justifyContent="space-between">
                  <Typography>{response}</Typography>
                  <Button variant="outlined" color="secondary" onClick={() => setSampleResponses(sampleResponses.filter((_, i) => i !== index))}>X</Button>
                </Box>
              ))}
              <TextField label="New response" value={newResponse} onChange={(e) => setNewResponse(e.target.value)} />
              <Button variant="contained" color="primary" onClick={() => { setSampleResponses([...sampleResponses, newResponse]); setNewResponse(""); }}>Add Response</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>

              <Button variant="contained" color="primary" type="submit">Create Chat Bot</Button>
              <Typography variant="subtitle1">{`Total characters: ${characterSettings.join('').length + sampleResponses.join('').length}`}</Typography>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCharacter;

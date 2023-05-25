import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Button, Typography, Box, CssBaseline, useMediaQuery, createTheme, ThemeProvider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"; // CSS Styles

const CreateCharacter = () => {
  // Load characterSettings, sampleResponses, and selectedImage from local storage if they exist
  const initialCharacterSettings = JSON.parse(localStorage.getItem('characterSettings')) || [];
  const initialSampleResponses = JSON.parse(localStorage.getItem('sampleResponses')) || [];
  const initialSelectedImage = localStorage.getItem('selectedImage') || null;

  const [characterSettings, setCharacterSettings] = useState(initialCharacterSettings);
  const [sampleResponses, setSampleResponses] = useState(initialSampleResponses);
  const [selectedImage, setSelectedImage] = useState(initialSelectedImage);
  const [newSetting, setNewSetting] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [apiKey, setApiKey] = useState(""); // state for the API key
  const [apiKeyError, setApiKeyError] = useState(false);
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

    if (apiKey === "") {
      setApiKeyError(true);
      return;
    }

    setApiKeyError(false);

    // Construct the prompt for the OpenAI API based on the user input
    const prompt = `The following is the background of the character: ${characterSettings.join('. ')}\n Some samples of response by the character is as follows: ${sampleResponses.join('\n')}`;
    console.log("Submitted " + prompt);

    // const response = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{
    //       role: "system", content: prompt},
    //     { role: "user", content: message }],
    //     temperature: 0.5,
    //     max_tokens: 500
    //   });

    // Clear inputs
    setCharacterSettings([]);
    setSampleResponses([]);
    setSelectedImage(null);
    setNewSetting("");
    setNewResponse("");
    navigate("/chatroom", { state: { botIcon: selectedImage } });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      alert('The file is too large. Please select a file that is less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = function() {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };


  useEffect(() => {
    localStorage.setItem('characterSettings', JSON.stringify(characterSettings));
    localStorage.setItem('sampleResponses', JSON.stringify(sampleResponses));
    localStorage.setItem('selectedImage', selectedImage);
  }, [characterSettings, sampleResponses, selectedImage]);

  const handleReset = () => {
    // Reset state and remove from local storage
    setCharacterSettings([]);
    setSampleResponses([]);
    setSelectedImage(null);
    setNewSetting("");
    setNewResponse("");
    setApiKey("");
    setApiKeyError(false);
    localStorage.removeItem('characterSettings');
    localStorage.removeItem('sampleResponses');
    localStorage.removeItem('selectedImage');
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
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom color="textSecondary">
                Upload Image
              </Typography>
              <Button variant="contained" component="label" color="primary" fullWidth>
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {selectedImage && (
                <img src={selectedImage} alt="Character" style={{ maxWidth: '100%', height: 'auto', marginTop: theme.spacing(2) }} />
              )}
              {!selectedImage && (
                <Typography color="textSecondary" style={{ marginTop: theme.spacing(2) }}>
                  No image selected
                </Typography>
              )}


            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="textSecondary">Character Settings</Typography>
              <Box display="flex" flexWrap="wrap" sx={{ minHeight: '100px', backgroundColor: '#333', padding: 2, borderRadius: 2 }}>
                {characterSettings.map((setting, index) => (
                  <Box key={index} sx={{ margin: 1 }}>
                    <Chip label={setting} onDelete={() => setCharacterSettings(characterSettings.filter((_, i) => i !== index))} style={{ backgroundColor: '#fff', color: '#808080' }} />
                  </Box>
                ))}
              </Box>
              <TextField label="New setting" value={newSetting} onChange={(e) => setNewSetting(e.target.value)} />
              <Button variant="contained" color="primary" onClick={() => { setCharacterSettings([...characterSettings, newSetting]); setNewSetting(""); }}>Add Setting</Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="textSecondary">Sample Responses</Typography>
              <Box display="flex" flexWrap="wrap" sx={{ minHeight: '100px', backgroundColor: '#333', padding: 2, borderRadius: 2 }}>
                {sampleResponses.map((response, index) => (
                  <Box key={index} sx={{ margin: 1 }}>
                    <Chip label={response} onDelete={() => setSampleResponses(sampleResponses.filter((_, i) => i !== index))} style={{ backgroundColor: '#fff', color: '#808080' }} />
                  </Box>
                ))}
              </Box>
              <TextField label="New response" value={newResponse} onChange={(e) => setNewResponse(e.target.value)} />
              <Button variant="contained" color="primary" onClick={() => { setSampleResponses([...sampleResponses, newResponse]); setNewResponse(""); }}>Add Response</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="API Key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setApiKeyError(false);
                }}
              />

            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">Create Chat Bot</Button>
              <Button variant="contained" color="secondary" onClick={handleReset} style={{ marginLeft: '20px' }}>Reset</Button>
              <Typography variant="subtitle1">{`Total characters: ${characterSettings.join('').length + sampleResponses.join('').length}`}</Typography>
              {apiKeyError && (
                <Typography color="error">
                  Please add an API key to create the bot.
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCharacter;

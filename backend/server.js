/* This is ViewGame Backend */
/* This connects to OpenLigaDB for soccer data and Supabase for saving favorites */
const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));


/* Supabase setup */
const supabaseUrl = 'https://dcneqxbfvoymwqrzhqrx.supabase.co';
const supabaseKey = 'sb_publishable_0rnxCQ_UHpzuCym3rQZ4NA_NcBnmLQP';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

/* Get all saved favorites */
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select();
  if (error) {
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

/* Save a favorite team */
app.post('/api/favorites', async (req, res) => {
  const teamName = req.body.team_name;
  const { data, error } = await supabase
    .from('favorites')
    .insert({ team_name: teamName })
    .select();
  if (error) {
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

/* Delete a favorite team */
app.delete('/api/favorites/:id', async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .select();
  if (error) {
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

/* Get the match results */
app.get('/api/matches', async (req, res) => {
  const response = await fetch('https://api.openligadb.de/getmatchdata/bl1/2024');
  const data = await response.json();
  res.json(data);
});

/* Get a leagure standings*/
app.get('/api/standings', async (req, res) => {
  const response = await fetch('https://api.openligadb.de/getbltable/bl1/2024');
  const data = await response.json();
  res.json(data);
});

/* Get list of teams */
app.get('/api/teams', async (req, res) => {
  const response = await fetch('https://api.openligadb.de/getavailableteams/bl1/2024');
  const data = await response.json();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
  
    ws.on('message', (message) => {
      const data = JSON.parse(message);
  
      if (data.type === 'update_leaderboard') {
        // Handle updating leaderboard logic
        console.log(`Update leaderboard: ${data.player_name}, ${data.score}, ${data.date}`);
  
        // Add the new player data to the leaderboard array
        leaderboard.push({
          player_name: data.player_name,
          score: data.score,
          date: data.date
        });
  
        // Sort the leaderboard array by score in descending order
        leaderboard.sort((a, b) => b.score - a.score);
  
        // Limit the leaderboard to the top 10 players
        leaderboard.length = Math.min(leaderboard.length, 10);
  
        // Broadcast the updated leaderboard to all connected clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'leaderboard_update', leaderboard }));
          }
        });
      }
  
      if (data.type === 'request_leaderboard') {
        // Handle sending leaderboard data back to the client
        console.log('Request leaderboard');
  
        // Send the current leaderboard data to the requesting client
        ws.send(JSON.stringify({ type: 'leaderboard_update', leaderboard }));
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  

server.listen(process.env.PORT, () => {
  console.log(`WebSocket server is running on port ${process.env.PORT}`);
});

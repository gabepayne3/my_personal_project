const app = require("./api")

// app.listen(9091, () => {
//     console.log("Server is listening on port 9091...");
//   });

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
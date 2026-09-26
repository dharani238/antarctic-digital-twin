import "dotenv/config";

import app from "./app";

const PORT = Number(
  process.env.PORT || 5000
);

const server = app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Antarctic Digital Twin API running on port ${PORT}`
    );
  }
);

process.on(
  "SIGINT",
  () => {
    console.log(
      "\n🛑 Server shutting down..."
    );

    server.close(() => {
      console.log(
        "Server closed."
      );

      process.exit(0);
    });
  }
);

process.on(
  "SIGTERM",
  () => {
    console.log(
      "\n🛑 Server shutting down..."
    );

    server.close(() => {
      console.log(
        "Server closed."
      );

      process.exit(0);
    });
  }
);
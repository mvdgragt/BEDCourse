import { createApp } from "./app";

const PORT = 4000;

createApp().listen(PORT, () => {
  console.log(`API is runnning on http://localhost:${PORT}`);
});

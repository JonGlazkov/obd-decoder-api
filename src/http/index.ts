import App from "./app";

const start = async () => {
  const app = new App();
  await app.init();
};

try {
  start();
} catch (err) {
  console.error("[SERVER] Application failed to start", err);
}

export default function Home() {
  function handleSayHello() {
    window.ipcRenderer.sendMessage("Hello World");

    console.log("Message sent! Check main process log in terminal.");
  }

  return (
    <main id="home">
      <h1>Home</h1>
      <button onClick={handleSayHello}>handleSayHello</button>
    </main>
  );
}

async function run() {
  const response = await fetch("https://r.jina.ai/https://www.free-work.com/fr/tech-it/jobs?query=helpdesk", {
    headers: { 'Accept': 'text/event-stream' }
  });
  const md = await response.text();
  console.log(md.substring(0, 1000));
}
run();

export const  formatTimeString = ()=> {
  const d = new Date();

  const pad = (n, z = 2) => String(n).padStart(z, "0");
  const ms = pad(d.getMilliseconds(), 3);
  const micros = pad(Math.floor(Math.random() * 1000), 3);

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    "." +
    ms +
    micros
  );
}


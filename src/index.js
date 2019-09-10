import "./styles.css";

import "./sample.js";
// basket.require({ url: "jquery.js" });

//https://github.com/pamelafox/lscache
// lscache.set("forever", "And Ever");
// lscache.set("greeting", [52353, 622, 232], 2);
// lscache.set("counter", true, 2);
// lscache.set("data", { name: "Pamela", aa: null, asA: 52.526, age: 26 }, 2);
// console.log(lscache.get("forever"));
// console.log(lscache.get("greeting"));
// console.log(lscache.get("counter"));
// console.log(lscache.get("data"));

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use Parcel to bundle this sandbox, you can find more info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

import { renameSync } from "node:fs";

renameSync("standalone/index.html", "standalone/ALMA-AI.html");
console.log("Built standalone/ALMA-AI.html - open it by double-clicking.");

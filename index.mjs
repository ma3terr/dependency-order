import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";

export function run(input) {
  const graph = new Map(Object.entries(input));
  const done = new Set();
  const visiting = new Set();
  const order = [];
  function visit(task) {
    if (done.has(task)) return;
    if (visiting.has(task)) throw new Error("Dependency cycle at " + task);
    if (!graph.has(task)) throw new Error("Unknown dependency " + task);
    visiting.add(task);
    for (const dependency of graph.get(task)) visit(dependency);
    visiting.delete(task);
    done.add(task);
    order.push(task);
  }
  for (const task of graph.keys()) visit(task);
  return order;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error("Usage: node index.mjs INPUT.json");
    const input = JSON.parse(readFileSync(process.argv[2], "utf8"));
    console.log(JSON.stringify(run(input), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

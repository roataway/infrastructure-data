import parse from "csv-parse/lib/sync.js";
import fs from "fs";

const parseOptions = {
  columns: true,
  trim: true,
  skip_empty_lines: true
};

const routesRaw = fs.readFileSync("./routes.csv");
const routesJson = parse(routesRaw, parseOptions);
const routesJsonRaw = JSON.stringify(routesJson, null, 2);

const vehiclesRaw = fs.readFileSync("./vehicles.csv");
const vehiclesJson = parse(vehiclesRaw, parseOptions).map(v => {
  let release_date = null;
  if (v.release_date) {
    const [date, month, year] = v.release_date.split("/");
    release_date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(date, 10)
    ).getTime();
  }
  return {
    ...v,
    tracker_id: !!v.tracker_id ? v.tracker_id : null,
    door_count: v.door_count ? new Number(v.door_count) : 0,
    release_date,
    articulated: v.articulated === "yes",
    accessibility: v.accessibility === "yes"
  };
});

const vehiclesJsonRaw = JSON.stringify(vehiclesJson, null, 2);

fs.writeFileSync("./routes.json", routesJsonRaw);
fs.writeFileSync("./vehicles.json", vehiclesJsonRaw);

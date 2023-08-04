const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "output.json");
const fileContent = fs.readFileSync(filePath, "utf8");
const obj = JSON.parse(fileContent);

const HOST = "https://raw.githubusercontent.com/Kaysil/tad-assets/master/high/"

let mapped = obj.map(el => {
	return {
		...el,
		link: `${HOST}${el.dupeName ?? el.name}.png`
	}
});

fs.writeFileSync(
	path.resolve(__dirname, "host-output.json"), JSON.stringify(mapped, null, "\t"))

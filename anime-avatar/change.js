const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "input.json");
const fileContent = fs.readFileSync(filePath, "utf8");
const HOST =
	"https://raw.githubusercontent.com/Kaysil/tad-assets/main/anime-avatar/high/";
/**
 * @type {{rows: {c: {v: string}[]}[]}}
 */
const data = JSON.parse(fileContent);
const names = {};
console.log(`Total rows: ${data.rows.length}`)
let formattedData = data.rows.map((row, i) => {
	console.log(`Now processing row ${i + 1}...`);
	let cell = row.c;
	let dupeName;
	let [link, color, category, marginLeft, maskHeight] = cell;
	let name = cell[0]?.v
		.split("/")
		.pop()
		.trim()
		// .replace(/-/g, " ")
		.replace(/.png/g, "")
		.toLowerCase();

	if (names[name] === undefined) {
		names[name] = 0;
	} else {
		dupeName = `${name}-${++names[name]}`;
	}

	return {
		_id: i,
		name,
		dupe_name: dupeName ?? null,
		image_url: `${HOST}${dupeName ?? name}.png`,
		image_original_url: link?.v,
		primary_color: color?.v,
		category: category?.v ?? "",
		margin_left: marginLeft?.v ?? 0,
		mask_height: maskHeight?.v ?? 0,
	};
});

fs.writeFileSync(
	path.resolve(__dirname, "output.json"),
	JSON.stringify(formattedData, null, "\t")
);

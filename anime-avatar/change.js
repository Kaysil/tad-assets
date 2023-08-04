const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "input.json");
const fileContent = fs.readFileSync(filePath, "utf8");

/**
 * @type {{rows: {c: {v: string}[]}[]}}
 */
const data = JSON.parse(fileContent);
const names = new Map()

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

	if (names.has(name)) {
		const count = names.get(name);
		dupeName = `${name}-${count}`;
	} else {
		names.set(name, 1);
	}

	return {
		_id: i,
		name,
		dupeName: dupeName ?? null,
		link: link?.v,
		color: color?.v,
		category: category?.v ?? "",
		marginLeft: marginLeft?.v ?? 0,
		maskHeight: maskHeight?.v ?? 0,
	};
});

fs.writeFileSync(
	path.resolve(__dirname, "output.json"),
	JSON.stringify(formattedData, null, "\t")
);

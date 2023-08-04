const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "output.json");
const fileContent = fs.readFileSync(filePath, "utf8");

const outDir = path.resolve(__dirname, "outHigh");
const resolution = "s0";

function timeout(ms) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error("Request timeout"));
		}, ms);
	})
}

async function fetchWithTimeout(url, ms) {
	const timeoutPromise = timeout(ms);
	const fetchPromise = fetch(url);

	return Promise.race([fetchPromise, timeoutPromise]);
}

async function fetchImage(url, retryTimes = 0) {
	try {
		const res = await fetchWithTimeout(url, 5000);
		const buffer = Buffer.from(await res.arrayBuffer());
		return buffer;
	} catch (err) {
		console.log(err);
		if (retryTimes < 3) {
			console.log(`Retrying ${url}... (${retryTimes})`);
			return await fetchImage(url, retryTimes + 1);
		} else {
			console.warn(`Failed to fetch ${url} after ${retryTimes} retries.`);
		}
	}
}

async function main() {
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

	for (let n of JSON.parse(fileContent)) {
		try {
			let { name, dupeName, link, _id } = n;
			console.log(`Now processing row ${_id}...`);

			let buffer = await fetchImage(link.replace(/\/h\d+\//g, `/${resolution}/`));
			fs.writeFileSync(path.resolve(outDir, `${dupeName ?? name}.png`), buffer);
		} catch (ex) {
			console.log(ex);
		}
	}
}


main()
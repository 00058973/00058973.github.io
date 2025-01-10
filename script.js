document.getElementById("parse-button").addEventListener("click", () => {
	parseInput();
});

document.getElementById("paste-parse-button").addEventListener("click", async () => {
	await pasteAndParse();
});
  
document.getElementById("copy-button").addEventListener("click", () => {
	const outputElement = document.getElementById("output");
	const textToCopy = outputElement.textContent;

	if (textToCopy) {
		navigator.clipboard.writeText(textToCopy).then(() => {
			alert("Parsed output copied to clipboard!");
		}).catch(err => {
			console.error("Error copying text: ", err);
		});
	} else {
		alert("Nothing to copy! Please parse some input first.");
	}
});
  
async function pasteAndParse() {
	try {
		const clipboardText = await navigator.clipboard.readText();
		const inputField = document.getElementById("input");

		inputField.value = clipboardText;

		parseInput();
	} catch (err) {
		console.error("Error reading from clipboard: ", err);
		alert("Failed to read from clipboard.");
	}
}
  
function parseInput() {
	const input = document.getElementById("input").value.trim();

	if (!input) {
		hideOutput();
		alert("Input field is empty. Please enter valid data.");
		return;
	}

	const output = parseEnvironment(input);

	if (output) {
		showOutput(output);
	} else {
		hideOutput();
		alert("Parsing failed. Please check your input.");
}
}
  
function parseEnvironment(input) {
	const lines = input.split("\n");
	const result = [];

	let currentName = null;
	for (let line of lines) {
		line = line.trim();

		if (line.startsWith("- name:")) {
			currentName = line.split(":")[1].trim();
			currentName = currentName.replace(/['"]/g, "");
		} else if (line.startsWith("value:") || line.startsWith("valueFrom:")) {
			if (line.startsWith("value:")) {
				const value = line.slice(line.indexOf(":") + 1).trim().replace(/['"]/g, "");
				result.push(`${currentName}=${value}`);
				currentName = null;
			} else {
				result.push(`${currentName}=`);
				currentName = null;
			}
		}
	}

	return result.join(";");
}

function showOutput(parsedOutput) {
	document.getElementById("output-header").style.display = "block";
	document.getElementById("output").style.display = "block";
	document.getElementById("copy-button").style.display = "block";

	document.getElementById("output").textContent = parsedOutput;
}

function hideOutput() {
	document.getElementById("output-header").style.display = "none";
	document.getElementById("output").style.display = "none";
	document.getElementById("copy-button").style.display = "none";
}

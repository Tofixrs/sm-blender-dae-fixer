import "./style.css";

const form = document.getElementById("form") as HTMLFormElement;
const file = document.getElementById("file") as HTMLInputElement;

form.addEventListener("submit", async (ev) => {
	ev.preventDefault();

	const text = await file.files?.item(0)?.text();

	if (!text) {
		throw new Error("Failed to read file");
	}

	const parser = new DOMParser();
	const doc = parser.parseFromString(text, "text/xml");

	const diffuse = doc.querySelector("diffuse:has(texture)");
	if (diffuse) diffuse.textContent = "";

	const armature = doc.querySelector("node#Armature");
	const scene = doc.querySelector("visual_scene#Scene");

	const children: Node[] = [];
	armature?.childNodes.forEach((v) => {
		if (v.nodeName == "NODE") children.push(v.cloneNode(true));
	});

	armature?.remove();

	scene?.append(...children);

	const serializer = new XMLSerializer();
	const content = serializer.serializeToString(doc);

	download(file.files?.item(0)?.name!, content);
});

function download(filename: string, text: string) {
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(text),
	);
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

let header = document.querySelector("header");
let field = document.querySelector("#search_inp");

window.onunload = function () {
	field.value = "";
	window.scrollTo(0, 0);
}
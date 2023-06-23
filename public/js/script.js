const header = document.querySelector("header");
const field = document.querySelector("#search_inp");
//const search = document.querySelector("#search");
const search_butt = document.querySelector("#search_butt");

window.onunload = function () {
	field.value = "";
	window.scrollTo(0, 0);
}

search_butt.onclick = function (e) {
	e.preventDefault();
	const search_window = document.createElement("section");
	search_window.setAttribute("id", 'search_window')
	search_window.innerHTML =
		`  <div class="m-0 m-auto pb-2">
	<form class="flex relative search_form" method="POST" role="search" action="/search">
	<div class="flex text-xl text-white relative hover:text-zinc-400" id="cancel">
	<button class="m-0 m-auto" id="cancel_butt">
	<span> 
	X
	</span>
	</button>
	</div>
		<input
			class="bg-gray-200 h-9 focus:outline-none focus:shadow-[inset_0_1px_1px_0_rgba(50,50,50,0.9)] text-xs text-gray-950 px-4 relative rounded-xl leading-3"
			type="search" aria-label="Search" id="search_inp" name="search_inp" placeholder="Search">
		<div>
			<button class="p-2 flex h-8 mb-2 ml-6 w-9">
				<svg class="text-white h-6 w-7 hover:text-zinc-400" xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		</form>
	</div>`

	document.body.prepend(search_window);
	document.body.style.overflowY = "hidden";

	const cancel_butt = document.querySelector("#cancel_butt");

	cancel_butt.onclick = function (e) {
		e.preventDefault();
		search_window.remove();
		document.body.style.overflowY = "scroll";
	}
}


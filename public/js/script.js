const field = document.querySelector(".search_inp");
const search = document.querySelector(".search");


/* const letter = /[a-z]/;
const upper = /[A-Z]/;
const number = /[0-9]/;
const greek_low = /[α-ω]/;
const greek_upper = /[Α-Ω]/;
const greek_low_tone = /[ά-ώ]/;
const greek_upper_tone = /[Ά-Ώ]/;
const symbols = /[!@#$%^&*(),.?":{}|<>]/; */

window.onunload = function () {
	field.value = "";
	window.scrollTo(0, 0);
}

if (!window.location.toString().includes("login")
	|| !window.location.toString().includes("signin")
	|| !window.location.toString().includes("add")
	|| !window.location.toString().includes("profile")
) {
	const search_butt = document.querySelector("#search_butt");

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
			class="bg-gray-200 h-9 focus:outline-none focus:shadow-[inset_0_1px_1px_0_rgba(50,50,50,0.9)] text-xs text-gray-950 px-4 relative rounded-xl leading-3 new_search_inp"
			type="search" aria-label="Search" name="search_inp" placeholder="Search">
		<div>
			<button class="p-2 flex h-8 mb-2 ml-6 w-9 new_search_butt" >
				<svg class="text-white h-6 w-7 hover:text-zinc-400" xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		</form>
	</div>
	`

		document.body.prepend(search_window);
		document.body.style.overflowY = "hidden";

		const cancel_butt = document.querySelector("#cancel_butt");
		const new_field = document.querySelector(".new_search_inp");
		const new_search_butt = document.querySelector(".new_search_butt");

		cancel_butt.onclick = function (e) {
			e.preventDefault();
			search_window.remove();
			document.body.style.overflowY = "scroll";
		}


		new_search_butt.addEventListener("click", function (e) {

			if (new_field.value == "" || new_field.value.length < 4) {
				e.preventDefault();
				alert("Please use more than 3 characters to search");
			}
			else {
				return true;
			}
		});


		new_search_butt.addEventListener("submit", function (e) {
			removeScripts(new_search_inp);
		});
	}
}

else {
	const search_butt = null;
}



if (window.location.toString().includes("profile")
) {
	const profile_butt = document.querySelector("#profile_butt");

	profile_butt.style.display = "none";
}

else {
	const profile_butt = null;
}

search.addEventListener("click", function (e) {

	if (field.value == "" || field.value.length < 4) {
		e.preventDefault();
		alert("Please use more than 3 characters to search");
	}
	else {
		return true;
	}
});

function removeScripts(html) {
	let scripts = html.querySelectorAll('script');
	for (let script of scripts) {
		script.remove();
	}
}


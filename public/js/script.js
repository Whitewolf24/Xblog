const field = document.querySelector(".search_inp"), search = document.querySelector(".search"); if (window.onunload = function () { field.value = "", window.scrollTo(0, 0) }, !window.location.toString().includes("login") || !window.location.toString().includes("signin") || !window.location.toString().includes("add") || !window.location.toString().includes("profile")) {
	const a = document.querySelector("#search_butt"); a.onclick = function (a) {
		a.preventDefault(); const b = document.createElement("section"); b.setAttribute("id", "search_window"), b.innerHTML = `  <div class="m-0 m-auto pb-2">
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
	`, document.body.prepend(b), document.body.style.overflowY = "hidden"; const c = document.querySelector("#cancel_butt"), d = document.querySelector(".new_search_inp"), e = document.querySelector(".new_search_butt"); c.onclick = function (a) { a.preventDefault(), b.remove(), document.body.style.overflowY = "scroll" }, e.addEventListener("click", function (a) { return !("" == d.value || 4 > d.value.length) || void (a.preventDefault(), alert("Please use more than 3 characters to search")) }), e.addEventListener("submit", function () { removeScripts(new_search_inp) })
	}
} else { } if (window.location.toString().includes("profile")) { const a = document.querySelector("#profile_butt"); a.style.display = "none" } else { } search.addEventListener("click", function (a) { return !("" == field.value || 4 > field.value.length) || void (a.preventDefault(), alert("Please use more than 3 characters to search")) }); function removeScripts(a) { let b = a.querySelectorAll("script"); for (let c of b) c.remove() }
var a=document.querySelector('.search_inp'),b=document.querySelector('.search');window.onunload=()=>{a.value='';window.scrollTo(0,0)};if(!`${window.location}`.includes('login')||!`${window.location}`.includes('signin')||!`${window.location}`.includes('add')||!`${window.location}`.includes('profile')){var A=document.querySelector('#search_butt');A.onclick=e=>{e.preventDefault();var _=document.createElement('section'),B=document.querySelector('#cancel_butt'),d=document.querySelector('.new_search_inp'),E=document.querySelector('.new_search_butt');_.setAttribute('id','search_window');_.innerHTML=`  <div class="m-0 m-auto pb-2">
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
	`;document.body.prepend(_);document.body.style.overflowY='hidden';B.onclick=e=>{e.preventDefault();_.remove();document.body.style.overflowY='scroll'};E.addEventListener('click',function(e){if(d.value==''||d.value.length<4){e.preventDefault();alert('Please use more than 3 characters to search')}else return!0});E.addEventListener('submit',function(){c(new_search_inp)})}}if(`${window.location}`.includes('profile')){var C=document.querySelector('#profile_butt');C.style.display='none'}b.addEventListener('click',function(e){if(a.value==''||a.value.length<4){e.preventDefault();alert('Please use more than 3 characters to search')}else return!0});function c(_a){let _b=_a.querySelectorAll('script');for(let D of _b)D.remove()}

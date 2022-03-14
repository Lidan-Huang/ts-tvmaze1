import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = "https://api.tvmaze.com/";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

const DEFAULT_IMG = "https://tinyurl.com/tv-missing";

interface ShowsInterface{
  id: number,
  name: string,
  summary: string,
  image: string,
}

interface ApiResultInterface{
  id: number,
  name: string,
  summary: string,
  image: {medium: string} | null,
}


async function getShowsByTerm(term:string): Promise<ShowsInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
  const result = await axios.get(`${BASE_URL}search/shows?q=${term}`);
  console.log("result", result.data);  
  const shows = result.data; 
  const showsResult:ShowsInterface[] = [];
  for(let {show} of shows){
    let newShow:ApiResultInterface = show;
    let showInfo:ShowsInterface = {
      id: newShow.id,
      name: newShow.name,
      summary: newShow.summary,
      image: newShow.image?.medium || DEFAULT_IMG,
    }
    console.log("showInfo", showInfo);
    
    showsResult.push(showInfo);
  }
  return showsResult; 


}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowsInterface[]): void {
  $showsList.empty();
  console.log("shows in populate shows", shows);
  for (let show of shows) {
    console.log("show in populate shows", show);
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
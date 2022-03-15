import axios from "axios";
import * as $ from "jquery";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");

const $searchForm = $("#searchForm");
const BASE_URL = "https://api.tvmaze.com/";

const DEFAULT_IMG = "https://tinyurl.com/tv-missing";

interface ShowsInterface {
  id: number;
  name: string;
  summary: string;
  image: string;
}

interface ApiResultInterface {
  id: number;
  name: string;
  summary: string;
  image: { medium: string } | null;
}

interface EpisodesInterface {
  id: number;
  name: string;
  season: string;
  number: string;
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<ShowsInterface[]> {
  const result = await axios.get(`${BASE_URL}search/shows?q=${term}`);
  console.log("result", result.data);
  const shows = result.data;
 
  const showsResult: ShowsInterface[] = [];
  for (let { show } of shows) {
    let newShow: ApiResultInterface = show;
    let showInfo: ShowsInterface = {
      id: newShow.id,
      name: newShow.name,
      summary: newShow.summary,
      image: newShow.image?.medium || DEFAULT_IMG,
    };
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
      `
    );

    $showsList.append($show);
  }
}

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<EpisodesInterface[]> {
  const response = await axios.get(`${BASE_URL}shows/${id}/episodes`);
  let episodes: EpisodesInterface[] = response.data.map(
    (e: EpisodesInterface) => ({
      id: e.id,
      name: e.name,
      season: e.season,
      number: e.number,
    })
  );
  return episodes;
}
/** Given list of episode, contruct list of episodes in DOM */
function populateEpisodes(episodes: EpisodesInterface[]): void {
  const $episodeList = $("<ul>");
  for (let episode of episodes) {
    const $episode = $(
      `<li>${episode.name}(Season: ${episode.season}, Number:${episode.number})</li>`
    );
    $episodeList.append($episode);
  }
  $episodesArea.append($episodeList);

  $episodesArea.show();
}

$showsList.on("click", ".Show-getEpisodes", async function (evt: JQuery.ClickEvent) {
  console.log("evt", $(evt.target).closest(".Show").data("show-id"));
  const id: number = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
});

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = <string>$("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


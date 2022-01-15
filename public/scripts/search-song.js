const songView = (song) => `

<div class="col-12">
    <div class="card">
        <h5 class="card-header"><strong> ${song.title}</strong></h5>
        <div class="card-body">
          <ul class="list-group">
               <li class="list-group-item">Genre: ${song.genre}</li>
                <li class="list-group-item">Artist: ${song.artist}</li>
                <li class="list-group-item">Difficulty: ${song.difficulty}</li>
                <li class="list-group-item">Completion: ${song.completion}</li>
          </ul>
        </div>

      </div>
 </div>
`;

const handleSubmit = async () => {
    const searchVal = document.querySelector("#searchInput").value;
    try {
        const songDomRef = document.querySelector('#songItems');
        const ref = await fetch(`/api/search-songs/?search=${searchVal}`);
        const searchResults = await ref.json();
        let songHtml = [];
        searchResults.forEach(song => {
            songHtml.push(songView(song));
        });
        songDomRef.innerHTML = songHtml.join(""); 
    } catch (e) {
        console.log(e);
        console.log('could not search api');
    }
  
}


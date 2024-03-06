// console.log("yeaa finaaly something dangereous");
let currentsong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let tds = div.getElementsByTagName("a")
    // console.log(tds);

    songs = [];
    for (let index = 0; index < tds.length; index++) {
        const element = tds[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

    //list the songs
    let songURL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songURL.innerHTML = "";
    for (const song of songs) {
        songURL.innerHTML = songURL.innerHTML + `<li>
        <div class ="theme">
            <img class="invert" src="music.svg" alt="music">
            <div class="info">
                <div>${song.replaceAll("%20", " ")} </div>
                <div>song artist</div>
            </div>
        </div>
            <div class="playnow">
                <span>play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
    }


    //on clicking the song will play according to the choice
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            let songname2 = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(songname2);
        })
    });

    return songs;

}

const playmusic = (track, pause = false) => {
    // let audio = new Audio(track);
    currentsong.src = `/${currFolder}/` + track;
    console.log(track);

    if(!pause){
        currentsong.play();
        playthissong.src = "pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){

    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.querySelectorAll("a[href^='/songs/']");

    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(!e.href.includes(".htaccess")){
            let folders = (e.href.split("/").slice(-1)[0])
            let a = await fetch(`/songs/${folders}/info.json`)
            let response = await a.json()
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folders}" class="card">
            <div class="play">
                <svg width="20" height="29" viewBox="0 3 20 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 2 L20 12 L4 22 Z" stroke="#141834" stroke-width="1.7"
                        stroke-linejoin="round" fill="#000" />
                </svg>

            </div>

            <img src="/songs/${folders}/cover.jpg" alt="songs-playlist">
            <h2>${response.title}</h2>
            <p>${response.description}</p>

        </div>`
        }


        ///sdkjcnsdnc kjsncnknfiewfkesbnfnk
    }

       //clicking on the card and the song list cahnges
       Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" ,async items=>{
            let foldername = items.currentTarget.dataset.folder;
            songs = await getSongs(`songs/${foldername}`);
            console.log(songs);


            //play the music on clicking on the card
            playmusic(songs[0])



        })
    })

}

async function main() {
    await getSongs("songs/Angry_(mood)");
    // console.log(songs);

    playmusic(songs[0], true);

    //making the div for cards automatically
    displayAlbums();



    //playing sound with buttons
    playthissong.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play();
            playthissong.src = "pause.svg";
        }else
        {
            currentsong.pause();
            playthissong.src = "play.svg";
        }
    })

    //space key helps to play and pause the song (delete it if you dont need it)
    document.addEventListener("keydown", (event) =>{
        if (event.code === "Space" || event.key === " " || event.keyCode === 32) {
            event.preventDefault(); // Prevent scrolling the page when using the space bar
            if(currentsong.paused){
                currentsong.play();
                playthissong.src = "pause.svg";
            }else
            {
                currentsong.pause();
                playthissong.src = "play.svg";
            }
        }
    });
    

    //updating time checking
    currentsong.addEventListener("timeupdate", ()=>{
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";

        //when seekbar reaches end it start nextsong
        if(parseInt(currentsong.currentTime) == parseInt(currentsong.duration))
        {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

            if((index+1) < songs.length){
                playmusic(songs[index+1])
            }
        }
    })

    //setting up the seekbar to act like a loading
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";

        //updating the song duration
        currentsong.currentTime = (currentsong.duration*percent)/100;
    })

    //adding hamburger event listner
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
        document.querySelector(".closebutton").style.display = "block"
    })

    //adding for closing the hamburger button (event listener)
    document.querySelector(".closebutton").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".closebutton").style.display = "none"
    })

    //add event listner for previous button
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if((index-1) >= 0){
            playmusic(songs[index-1])
        }
    })

    //add event listner for next button
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if((index+1) < songs.length){
            playmusic(songs[index+1])
        }
    })

    //add event listener for the volumn
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        // console.log(e.target.value)
        currentsong.volume = parseInt(e.target.value)/100;
        if(currentsong.volume > 0){
            document.querySelector(".volumebutton img").src = "volume.svg";
        }
    })

    //volumn goes silent on clicking on the volume button
    document.querySelector(".volumebutton>img").addEventListener("click", () => {
        const imgSrc = document.querySelector(".volumebutton img").src;
        
        if (imgSrc.includes("volume.svg")) {
            document.querySelector(".volumebutton img").src = "mute.svg";
            currentsong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            document.querySelector(".volumebutton img").src = "volume.svg";
            currentsong.volume = .1;
            document.querySelector(".range input").value = 10;
        }
    });
    

}

main();

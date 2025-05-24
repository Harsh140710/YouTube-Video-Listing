document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("cardContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const errorMsg = document.getElementById("MessageDisplay");

  let allVideos = [];

  FetchData();

  async function FetchData() {
    try {
      const url = "https://api.freeapi.app/api/v1/public/youtube/videos";
      const response = await fetch(url);
      // console.log(response);

      const data = await response.json();
      // console.log(data);

      const videoData = data.data.data;
      console.log("video", videoData);
      // add all the data into a array
      videoData.forEach((data) => {
        let title = data.items.snippet.title;
        if (title.length > 10) title = `${title.substring(0, 15)}...`;

        // please title keep let beacase of this is change on the condition 
        // it is not working with const
        // const title = data.items.snippet.title;
        // if (title.length > 10) title = `${title.substring(0, 20)}...`;

        const image = data.items.snippet.thumbnails.high.url;
        const channelTitle = data.items.snippet.channelTitle;
        const link = `https://www.youtube.com/watch?v=${data.items.id}`;
        allVideos.push({ title, image, channelTitle, link });

        // allVideos = [...allVideos,{ title, image, channelTitle, link }];
      });

      // display all card
    } catch (url) {
      errorMsg.classList.remove("hidden")
      errorMsg.textContent = "Please Wait...";
      errorMsg.className = "errorMessage";
    }

    showCards(allVideos);
  }

  // displaying all cards
  function showCards(arr) {
    cardContainer.innerHTML = "";

    if (arr.length > 0) errorMsg.classList.add("hidden");

    arr.forEach((video) => {
      const card = showACard({
        title: video.title,
        image: video.image,
        channelTitle: video.channelTitle,
        link: video.link,
      });

      // adding Single card to container to dispaly
      cardContainer.appendChild(card);
    });
  }

  function showACard({ title, image, channelTitle, link }) {
    const card = document.createElement("div");
    card.className = "card";

    const imageDiv = document.createElement("div");
    imageDiv.className = "image";

    const thumbnail = document.createElement("img");
    thumbnail.src = image;
    thumbnail.alt = title;

    const details = document.createElement("div");
    details.id = "details";

    const videoTitle = document.createElement("div");
    videoTitle.className = "title";
    videoTitle.textContent = title;

    const channelHostName = document.createElement("div");
    channelHostName.className = "channelHost";
    channelHostName.textContent = channelTitle;

    const videoBtn = document.createElement("button");
    videoBtn.textContent = "View Video";
    videoBtn.className = "linkBtn";

    videoBtn.onclick = () => {
      window.open(link, "_blank");
    };

    imageDiv.appendChild(thumbnail);

    details.appendChild(videoTitle);
    details.appendChild(channelHostName);
    details.appendChild(videoBtn);

    card.appendChild(imageDiv);
    card.appendChild(details);

    return card;
  }

  //when user input
  searchInput.addEventListener("input", searchBar);

  searchBtn.addEventListener("click", searchBar);

  function searchBar() {
    // get inserted value
    const query = searchInput.value.trim();
    if (!query) {
      //if  nothing is typed then show all videos
      showCards(allVideos);
      return;
    }

    let newVideoArray = [];

    newVideoArray = allVideos.filter((video) => {
      return video.title.toLowerCase().includes(query.toLowerCase());
    });

    if (newVideoArray.length <= 0) {
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = "No Video Found";
    }

    // showing founded videos
    showCards(newVideoArray);
  }
});

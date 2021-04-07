var app = new Vue({
  el: "#app",
  data: {
    audio: "",
    imgLoaded: false,
    currentlyPlaying: false,
    currentlyStopped: false,
    currentTime: 0,
    checkingCurrentPositionInTrack: "",
    trackDuration: 0,
    currentProgressBar: 0,
    isPlaylistActive: false,
    currentSong: 0,
    debug: false,
    musicPlaylist: [
    {
      title: "The Eternal Fascist",
      artist: "CHAPTER 1",
      url: "https://mcdn.podbean.com/mf/web/e7g5c6/Chapter_183trr.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },

    {
      title: "An American Fascist Faith",
      artist: "CHAPTER 2",
      url: "https://mcdn.podbean.com/mf/web/d5dkns/Chapter_2b60gu.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },

    {
      title: "The Apostle of Fascism",
      artist: "CHAPTER 3",
      url: "https://mcdn.podbean.com/mf/web/t3563r/Chapter_36l2ui.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },

    {
      title: "How to Build an Army",
      artist: "CHAPTER 4",
      url: "https://mcdn.podbean.com/mf/web/b9dpfn/Chapter_49sz1j.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },
    
    {
      title: "The Hidden Civil War",
      artist: "CHAPTER 5",
      url: "https://mcdn.podbean.com/mf/web/jpk4nx/Chapter_56ri4e.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },

    {
      title: "The Perfect Soldier",
      artist: "CHAPTER 6",
      url: "https://mcdn.podbean.com/mf/web/9bb7pp/Chapter_66ohol.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" },

    {
      title: "The Digital Reich",
      artist: "CHAPTER 7",
      url: "http://soundbible.com/mp3/creepy-background-daniel_simon.mp3",
      image: "https://i1.sndcdn.com/artworks-000581387126-7o9iw3-t500x500.jpg" }],


    audioFile: "" },

  mounted: function () {
    this.changeSong();
    this.audio.loop = false;
  },
  filters: {
    fancyTimeFormat: function (s) {
      return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
    } },

  methods: {
    togglePlaylist: function () {
      this.isPlaylistActive = !this.isPlaylistActive;
    },
    nextSong: function () {
      if (this.currentSong < this.musicPlaylist.length - 1)
      this.changeSong(this.currentSong + 1);
    },
    prevSong: function () {
      if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
    },
    changeSong: function (index) {
      var wasPlaying = this.currentlyPlaying;
      this.imageLoaded = false;
      if (index !== undefined) {
        this.stopAudio();
        this.currentSong = index;
      }
      this.audioFile = this.musicPlaylist[this.currentSong].url;
      this.audio = new Audio(this.audioFile);
      var localThis = this;
      this.audio.addEventListener("loadedmetadata", function () {
        localThis.trackDuration = Math.round(this.duration);
      });
      this.audio.addEventListener("ended", this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
    },
    isCurrentSong: function (index) {
      if (this.currentSong == index) {
        return true;
      }
      return false;
    },
    getCurrentSong: function (currentSong) {
      return this.musicPlaylist[currentSong].url;
    },
    playAudio: function () {
      if (
      this.currentlyStopped == true &&
      this.currentSong + 1 == this.musicPlaylist.length)
      {
        this.currentSong = 0;
        this.changeSong();
      }
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.play();
      } else {
        this.stopAudio();
      }
      this.currentlyStopped = false;
    },
    stopAudio: function () {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedMusic();
    },
    handleEnded: function () {
      if (this.currentSong + 1 == this.musicPlaylist.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.currentSong++;
        this.changeSong();
        this.playAudio();
      }
    },
    onImageLoaded: function () {
      this.imgLoaded = true;
    },
    getCurrentTimeEverySecond: function (startStop) {
      var localThis = this;
      this.checkingCurrentPositionInTrack = setTimeout(
      function () {
        localThis.currentTime = localThis.audio.currentTime;
        localThis.currentProgressBar =
        localThis.audio.currentTime / localThis.trackDuration * 100;
        localThis.getCurrentTimeEverySecond(true);
      }.bind(this),
      1000);

    },
    pausedMusic: function () {
      clearTimeout(this.checkingCurrentPositionInTrack);
    },
    toggleDebug: function () {
      this.debug = !this.debug;
      document.body.classList.toggle('debug');
    } },

  watch: {
    currentTime: function () {
      this.currentTime = Math.round(this.currentTime);
    } },

  beforeDestroy: function () {
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInTrack);
  } });
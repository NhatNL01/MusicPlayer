const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd')

const player = $('.player')
const header  = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Industry Baby',
            singer: 'Lil Nas X',
            path: './assets/music/Industry Baby - Lil Nas X_ Jack Harlow.mp3',
            image: './assets/img/industryBaby.jpg',
        },
        {
            name: 'Your power',
            singer: 'Billi Ellish',
            path: './assets/music/YourPower-BillieEilish-7013507.mp3',
            image: './assets/img/yourPower.jpg',
        },
        {
            name: 'Star Boy',
            singer: 'The Weekend',
            path: './assets/music/Starboy - The Weeknd_ Daft Punk.mp3',
            image: './assets/img/The_Weeknd_-_Starboy_(Single).jpg',
        },
        {
            name: 'Alaba Trap',
            singer: 'Tommy Teo ft MCK',
            path: './assets/music/AlabaTrap-TommyTeoMCKRPT-6998714.mp3',
            image: './assets/img/mqdefault.jpg',
        },
        {
            name: 'MONTRERO',
            singer: 'Lil Nas X',
            path: './assets/music/MonteroCallMeByYourName-LilNasX-6985349.mp3',
            image: './assets/img/industryBaby.jpg',
        },
        {
            name: 'MONEY',
            singer: 'Lisa',
            path: './assets/music/TaiBaiHat.Net - Money.mp3',
            image: './assets/img/money.jpeg',
        },
        {
            name: 'Lalisa',
            singer: 'Lisa',
            path: './assets/music/Lalisa-LISA-7086697.mp3',
            image: './assets/img/lalisa.jpeg',
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image} ');" >
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currenSong', {
            get: function() {
                return this.songs[this.currenIndex]
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // xu ly xoay cd thumb 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'},
            
        ], {
            duration: 10000,
            interaton: Infinity
        })
        cdThumbAnimate.pause();

        // Xu ly phong to thu nho cd
        document.onscroll = function() {
            const scrollTop = window.scrolly || document.documentElement.scrollTop;
            const newCdWidth =cdWidth - scrollTop
            cd.style.width =  newCdWidth > 0 ?   newCdWidth + 'px' : 0 + 'px'
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xu ly khi click play
        playBtn.onclick = function() {
            //Xu ly khi click play
            if(app.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            };
            // Khi play song
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            };
            // Khi pause song
            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            };

            //Khi song dang chay
            audio.ontimeupdate = function() {
                
                if(audio.duration) {
                    progress.value = Math.floor(audio.currentTime / audio.duration *100) 
                }
            };

            // Xu ly khi tua
            progress.onchange = function(e) {
               const seekTime = e.target.value / 100 * audio.duration 
               audio.currentTime = seekTime
            };
        }

        // Xu ly prev,next bai hat
        prevBtn.onclick = function() {
            
            if (app.isRandom) {
                app.playRandomSong()
            }
            app.prevSong()
            playBtn.click()
            audio.play()
            app.render()
            app.scrollCurrentSong()

        }
        nextBtn.onclick = function() {
            
            if (app.isRandom) {
                app.playRandomSong()
            }
            app.nextSong()
            playBtn.click()
            audio.play()
            app.render()
            app.scrollCurrentSong()
        }

        // random bat/ tat song
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            this.classList.toggle('active',app.isRandom)
        },

        // xu ly repeat song
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }

        //xu ly next song khi song end
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lang nghe click vao playList
        playList.onclick = function(e) {
            const songNode  = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xu ly click vao song 
                if (songNode) {
                    app.currenIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    playBtn.click()
                    audio.play()
                }
                // Xu ly khi clixk vao song option
                if(e.target.closest('.option')) {
                    
                }
            }
        }
    },

    scrollCurrentSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },100)
    },

    loadCurrentSong: function() {
        header.textContent = this.currenSong.name
        cdThumb.style.backgroundImage = `url('${this.currenSong.image}`
        audio.src = this.currenSong.path
    },
    nextSong: function() {
        this.currenIndex++
        if(this.currenIndex >= this.songs.length ) {
            this.currenIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currenIndex--
        if(this.currenIndex < 0 ) {
            this.currenIndex = this.songs.length -1
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex = Math.floor(Math.random() * this.songs.length)
        while (newIndex === app.currenIndex) {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        this.currenIndex = newIndex
    },
   

    start: function() {
        // Dinh nghia thuoc tinh cho object
        this.defineProperties();
        
        // Lang nghe / cu ly cac xu kien Dom events
        this.handleEvents();

        // Tai thong tin bai dau tien vao UI
        this.loadCurrentSong()

        // Render playList
        this.render();
    },
}

app.start();






















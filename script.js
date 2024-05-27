//referencja do canvasa
const canvas = document.querySelector('canvas');
//referencja do kontekstu
const ctx = canvas.getContext('2d');

//przyjecie zmiennych width i height jako rozmiar canvasa
const width = canvas.width;
const height = canvas.height;

//referencja do wyniku
const wynik = document.getElementById('wynik');

//referencja do kontenera - div w ktorym sa elementy
const container = document.getElementById('container');

//referencja do kazdego serca
const serce1 = document.getElementById('serce1');
const serce2 = document.getElementById('serce2');
const serce3 = document.getElementById('serce3');

//nadanie wartosci true kazdemu sercu
//potrzebne pozniej do sprawdzania czy po zaatakowaniu 
//serce jescze sie wyswietla czy juz nie
serce1.jest = true;
serce2.jest = true;
serce3.jest = true;

//zmienna ktora bedzie przechowywac kierunek w ktorym porusza sie postac
let direciton = "down";

//x - polozenie x, y - polozenie y
//pkt - zdobyte punkty, premia - premia za zabicie kosmity
//time czas co ile ma sie pojawiac kosmici - zmienia sie w zaleznosci od zdobytych punktow
let x, y, random, pkt, premia, time;
pkt = 0;
premia = 35;

time = 1000;

//zmienna ktora bedzie przechowywac czas
//potrzebne do zmiany czasu co ile ma sie pojawiac kosmita
let enemyIntervalId;
let lastTime = time;


//tablica w ktorej beda zpisywane pociski
// ile razy nacisniemy klawisz J tyle bedzie elementow w tej tablicy
const bullets = [];
//tablica w ktorej beda zapisywane wybuchy 
//po zniszczeniu kosmity lub po wyjsciu pocisku poza canvas posick zaminia sie na wybuch
const boom = [];
//tablica w ktorej beda zapisywani kosmici zeby potem ich rysowac
const enemies = [];
//tablica w ktorej beda zapisywane klawisze ktore sa wcisniete (true) lub nie (false
const keysPressed = [];

//uzyskanie innych niezbednych referencji
const menu = document.getElementById('menu');
const startButton = document.getElementById('start_button');
const sterowanie = document.getElementById('sterowanie');
const guzik_muzyka = document.getElementById('guzik_muzyka');

//zmienna ktora odpowiada za wlaczenie dzwiekow w grze
let music_in_game = false;

//DZWIEKI I MUZYKA W GRZE - AUDIO

//muzka w tle w menu
const music_menu = new Audio('./music/menu/music_menu.mp3');
music_menu.volume = 0.11;
music_menu.loop = true;

//muzka w tle po zakonczeniu gry
const end_music_menu = new Audio('./music/koniec/music_end.mp3');
end_music_menu.volume = 0.11;
end_music_menu.loop = true;

//muzka w tle podczas graniania
const music_game = new Audio('./music/gra/game_music.mp3');
music_game.volume = 0.11;
music_game.loop = true

//dzwiek startu gry
const start = new Audio('./music/menu/music_start.mp3');
start.volume = 0.12;

//dzwiek strzalu
const strzal = new Audio('./music/strzal/laser.mp3');
strzal.volume = 0.3;

//dzwiek trafienia kosmity
const trafienie_kosmity = new Audio('./music/wybuch/wybuch.mp3');
trafienie_kosmity.volume = 0.25;

//dzwiek gdy nie trafi w kosmite
const pudlo = new Audio('./music/wybuch/trafienie.mp3');
pudlo.volume = 0.14;

//dzwiek gdy postac zostanie uderzona przez kosmite
const hit = new Audio('./music/hit/hit.mp3');
hit.volume = 0.2;

//dzwiek konca gry
const end = new Audio('./music/koniec/melodyjka.mp3');
end.volume = 0.12;


//opcja wlaczenia i wylaczenia muzyki i dziwekow w grze
//przy wlaczeniu gry dzwieki sa autoamtycznie wylaczone
guzik_muzyka.addEventListener('click', () => {
    if(music_in_game == false) {
        music_menu.currentTime = 0;
        guzik_muzyka.innerHTML = "MUZYKA I DZWIEKI W GRZE: ON";
        music_menu.play();
        music_in_game = true;
    }
    else if(music_in_game == true){
        guzik_muzyka.innerHTML = "MUZYKA I DZWIEKI W GRZE: OFF";
        music_menu.pause();
        music_in_game = false;
    }
});

//klikniecie w przycisk startu gry
startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    container.style.display = 'flex';
    //jak majabyc dzwieki w grze 
    if(music_in_game) {
        music_menu.pause();
        start.play();
    }
    //uruchomienie gry
    startGame();
});



//klikniecie w przycisk sterowanie
sterowanie.addEventListener('click', () => {
    //ukrycie menu i dodanie nowego diva w ktorym bedzie pokazane sterowanie - zdj
    menu.style.display = 'none';

    const sterowanie_div = document.createElement('div');
    sterowanie_div.setAttribute('id', 'sterowanie_div');
    document.body.appendChild(sterowanie_div);

    const sterowanie_img = document.createElement('div');
    sterowanie_img.setAttribute('id', 'sterowanie_img');

    sterowanie_div.appendChild(sterowanie_img);

    const powrot = document.createElement('button');
    powrot.innerHTML = "POWROT";
    powrot.setAttribute('id', 'powrot');
    sterowanie_div.appendChild(powrot);

    //gdy klikniemy w przycisk powrotu to usunie sie div ze sterowaniem i pokaze sie znowu menu
    powrot.addEventListener('click', () => {
        sterowanie_div.remove();
        menu.style.display = 'block';
    });
});





//GLOWNA FUNKCJA GRY KTORA JEST WYWOLYWANIA
//PO KLIKNIECIU W PRZYCISK START
function startGame() {
    //kiedy muzyka w menu sie skonczy to zacznie sie muzyka w grze
    //jezeli dzwieki sa wlaczone
    if(music_in_game) {
        start.addEventListener('ended', function() {
            music_game.play();
        });
    }

    //tworze obiekty klasy Sprite_class - tlo

    //frameRate: to ilosc klatek 
    //frameBuffer to spowolnienie animacji im mnijejsza liczba tym szybciej
    const background = new Sprite_class({
        position: {
            x: 0,
            y: 0
        },
        imageSrc:'./images/background-Sheet.png',
        frameRate: 3,
        frameBuffer: 20,
    });


    //twoze obiekt klasy Player_class - postac
    const postac = new Player_class({
        imageSrc: './images/player/postac_down-Sheet.png',
        frameRate: 2,
        frameBuffer: 15,
        animations: {
            Up: {
                imageSrc: './images/player/postac_up-Sheet.png',
                frameRate: 2,
                frameBuffer: 15,
            },
            Down: {
                imageSrc: './images/player/postac_down-Sheet.png',
                frameRate: 2,
                frameBuffer: 15,
            },
            Left: {
                imageSrc: './images/player/postac_left-Sheet.png',
                frameRate: 2,
                frameBuffer: 15,
            },
            Right: {
                imageSrc: './images/player/postac_right-Sheet.png',
                frameRate: 2,
                frameBuffer: 15,
            },
            RunUp: {
                imageSrc: './images/player/run_up-Sheet.png',
                frameRate: 5,
                frameBuffer: 3,
            },
            RunDown: {
                imageSrc: './images/player/run_down-Sheet.png',
                frameRate: 5,
                frameBuffer: 3,
            },
            RunRight: {
                imageSrc: './images/player/run_right-Sheet.png',
                frameRate: 5,
                frameBuffer: 3,  
            },
            RunLeft: {
                imageSrc: './images/player/run_left-Sheet.png',
                frameRate: 5,
                frameBuffer: 3,
            }
        },
    });


    //nasluchiwanie klawiszy
    document.addEventListener("keydown", (e)=> {
        //kiedy nacisniemy klawisz J to zaczne strzelac
        if(e.code == "KeyJ") {
            
            //odtwarzanie dzwieku jesli jest wlaczona muzyka
            if(music_in_game) {
                //resestowanie czasu audio zeby kolejny raz go odtworzyc
                //gdy strzelam kilka razy pod rzad
                strzal.currentTime = 0;
                strzal.play();
            }
            //tworze nowy obiekt klasy Bullet_class
            //i dodaje go do tablicy bullets
            //w zaleznosci od kierunku w ktorym porusza sie postac
            if(direciton == "up") {
                bullets.push(new Bullet_class(postac.position.x+0.38*postac.width, postac.position.y+0.9*postac.height-postac.height, 0, -10, direciton, "./images/bullets/bullet_up.png"));
            }
            else if(direciton == "down") {
                bullets.push(new Bullet_class(postac.position.x+0.38*postac.width, postac.position.y+0.9*postac.height, 0, 10, direciton,"./images/bullets/bullet_down.png"));
            }
            else if(direciton == "right") {
                bullets.push(new Bullet_class(postac.position.x+0.9*postac.width, postac.position.y+0.38*postac.height, 10, 0, direciton,"./images/bullets/bullet_right.png"));
            }
            else if(direciton == "left") {
                bullets.push(new Bullet_class(postac.position.x-30+0.1*postac.width, postac.position.y+0.38*postac.height, -10, 0, direciton,"./images/bullets/bullet_left.png"));
            }
        }
    });

    //nasluchiwanie klawiszy
    //jak klawisz jest wsicniety to "warosc" tego kalwisza jest true
    document.addEventListener('keydown', function(e) {
        keysPressed[e.code] = true;
      });

    //jak nie bedziemy go wciskac to jest na false
    document.addEventListener('keyup', function(e) {
        keysPressed[e.code] = false;
    });


    //funkcja update gry
    function update() {
        //rysoawnie tla i jednoczesne jego animowanie
        background.draw();
        background.updateFrames();

        //rysowanei postaci
        postac.draw();
        //update postaci czyli 
        //okreslenie warynkow brzegowych
        postac.update();
        //poruszanie postacia
        postac.move();

        //rysowanie pociskow
        //iteruje po dlugosci tablicy bullets - czyli tyle ile razy strzelilem
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            //zmieniam polozenie pocisku
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            //i go rysuje
            bullet.draw_shoot();

            //WYKRYCIE KOLIZJI POCISKU Z OBIEKTEM
            //iteruje po dlugosci tablicy enemies - czyli tyle ile jest kosmitow
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                //sprawdzam czy pocisk trafil w kosmite
                //checkCollision zwraca true jesli pocisk trafil w kosmite
                //checkCollision to metoda z klasy Enemy_class
                if (enemy && enemy.hitbox && bullet.checkCollision(enemy)) {
                    //dodaje efekt wybuchu w miejscu kolizji pocisku z kosmita
                    //TYLKO KOSMITA
                    //tworzac nowy obiekt klasy Bullet_class i jednoczenise dodaje go do tablicy boom
                    //obrazek jest inny - wybuch
                    //obrazek jest zalezny od kierunku w ktorym lecial pocisk
                    if (direciton == "up") boom.push(new Bullet_class(bullet.x, bullet.y, 0, 0, bullet.direction, "./images/bullets/boom_up-Sheet.png"));
                    else if (direciton == "down") boom.push(new Bullet_class(bullet.x, bullet.y, 0, 0, bullet.direction, "./images/bullets/boom_down-Sheet.png"));
                    else if (direciton == "right") boom.push(new Bullet_class(bullet.x, bullet.y, 0, 0, bullet.direction, "./images/bullets/boom_right-Sheet.png"));
                    else if (direciton == "left") boom.push(new Bullet_class(bullet.x, bullet.y, 0, 0, bullet.direction, "./images/bullets/boom_left-Sheet.png"));

                    //jezeli sa wlaczone dzwieki to puszczam dzwiek trafienia kosmity
                    if(music_in_game) {
                        trafienie_kosmity.currentTime = 0;
                        trafienie_kosmity.play();
                    }                
                    //dodaje punkty za zabicie kosmity
                    pkt += premia;

                    //usuwam/zastepuje pocisk i kosmite z tablic
                    //za pomoca splice
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    //zmniejszam i oraz j o 1 bo usunalem element z tablicy
                    i--;
                    j--;
                    //przerwanie petli bo ten pocisk juz nie istenije
                    break;
                }
            }

            //sprawdzenie granic canvasa dla posicku
            //dystans od krawędzi canvasa, gdzie pociski maja znikac
            //wizualnie - uderzenie w sciane
            const bulletPadding = 65; 

            if (bullet.x < bulletPadding || bullet.x > width - bulletPadding - bullet.size || bullet.y < bulletPadding || bullet.y > height - bulletPadding - bullet.size) {
                //bedzie dzwiek gdy pocisk uderzy w sciane
                //jezeli dzwieki sa wlaczone
                if(music_in_game) {
                    pudlo.currentTime = 0;
                    pudlo.play();
                }

                //tworze wybuch w miejscu gdzie pocisk uderzyl w sciane
                //TYLKO SCIANA - KOSMITA wyzej
                //pobieraam obecna pozycje pocisku
                x = bullet.x;
                y = bullet.y;

                //i dodaje wybuch do tablicy boom
                //w zaleznosci w ktora sciane uderzyl pocisk

                //prawa krawedz
                if (bullet.x > width - bulletPadding - bullet.size) {   
                    boom.push(new Bullet_class(x, y-11.5, 0, 0, bullet.direction, "./images/bullets/boom_right-Sheet.png"));
                }
                //lew krawedz
                if (bullet.x < bulletPadding) {
                    boom.push(new Bullet_class(x, y-11.5, 0, 0, bullet.direction, "./images/bullets/boom_left-Sheet.png"));
                }
                //gora
                if (bullet.y < bulletPadding) {
                    boom.push(new Bullet_class(x-14, y, 0, 0, bullet.direction, "./images/bullets/boom_up-Sheet.png"));
                }
                //dol
                if (bullet.y > height - bulletPadding - bullet.size) {
                    boom.push(new Bullet_class(x-11, y, 0, 0, bullet.direction, "./images/bullets/boom_down-Sheet.png"));
                }

                //usuwam pocisk z tablicy ktory uderzyl w sciane
                bullets.splice(i, 1);            
                i--;            
            }
        }

        //rysowanie wybuchow
        //iteruje po dlugosci tablicy boom - czyli tyle ile jest wybuchow
        for (let j = 0; j < boom.length; j++) {
            const boom_bullet = boom[j];
            //rysuje i aktualizuje wybuch
            boom_bullet.draw_boom();
            boom_bullet.update_boom();

            //kiedy wybuch osiagnie 5 klatke to go usuwam
            //bo animacja wybuchu ma 5 klatek
            //i wyswietlam ja tylko raz
            if (boom_bullet.currentFrame >= 5) {
                boom.splice(j, 1);
                j--;
            }
        }

        //rysowanie kosmitow
        for (let enemy of enemies) {
            //do enemmy.update() przekazuje postac
            //zeby kosmita mogl sie poruszac w strone postaci i ja "sledzic"
            enemy.update(postac);
            //rysuje postac
            enemy.draw();
            //aktualizuje klatki z animacji
            enemy.updateFrames();
            //WYKRYCIE KOLIZJI KOSMITY Z POSTACIA
            //sprawdzam czy kosmita zderzyl sie z postacia
            //i sprawdzam czy juz minelo odpowiednio duzo czasu od ostatniej kolizji
            //zeby nie bylo tak ze postac zderzy sie z kosmita i od razu straci wszystkie zycia
            if (enemy.checkCollision(postac) && Date.now() - postac.lastCollision > postac.collisionCooldown) {
                //console.log('Kolizja z postacia');
                //jezeli dzwieki sa wlaczone to puszcze dzwiek uderzenia postaci
                if(music_in_game) {
                    hit.currentTime = 0;
                }
                //ustawiam czas ostatniej kolizji na obecny czas
                postac.lastCollision = Date.now();

                //jezeli postac zderzy sie z kosmita to traci jedno zycie
                //odpowiednio zmniejszam ilosc zyc
                //i zabieram pkt z wyniku
                if (serce1.jest == true) {
                    serce1.jest = false;
                    serce1.setAttribute('style', 'background-image: url(./images/puste.png)');
                    pkt -= premia;
                    //jezeli dzwieki sa wlaczone to puszcze dzwiek uderzenia postaci
                    if(music_in_game) {
                        hit.play();
                    }
                    break;
                }
                else if (serce2.jest == true) {
                    serce2.jest = false;
                    serce2.setAttribute('style', 'background-image: url(./images/puste.png)');
                    pkt -= premia;
                    if(music_in_game) {
                        hit.play();
                    }
                    break;
                }
                else if (serce3.jest == true) {
                    serce3.setAttribute('style', 'background-image: url(./images/puste.png)');
                    serce3.jest = false;
                    pkt -= premia;
                    //console.log(pkt);
                    wynik.innerHTML = pkt;
                    if(music_in_game) {
                        music_game.pause();
                        hit.play();
                    }
                    //jezeli postac straci wszystkie zycia to koniec gry
                    canvas.remove();
                    container.remove();
                    //tworze elementy html - ustawiam im odpowiednie style i dodaje je do body
                    //aby stworzyc ekran konca gry
                    const koniec = document.createElement('p');
                    document.body.appendChild(koniec);
                    koniec.style.fontSize = "50px";
                    koniec.style.textAlign = "center";
                    koniec.innerHTML = "<br>KONIEC GRY !<br>TWOJ WYNIK TO: "+ pkt+ "<br>GRATULACJE!!!<br>ABY ZAGRAC PONOWNIE<br>WCISNIJ SPACJE LUB NACISNIJ PONIZEJ";
                    //jezeli dzwieki sa wlaczone to puszcze dzwiek konca gry
                    if(music_in_game) {
                        end.currentTime = 0;
                        end.play();
                        //kiedy muzyka w grze sie skonczy to zacznie sie muzyka po zakonczeniu gry
                        end.addEventListener('ended', function() {
                            end_music_menu.currentTime = 0;
                            end_music_menu.play();
                        });
                    }

                    //tworze guzik ktory pozwoli na ponowne zaladowanie strony
                    const guzik = document.createElement('button');
                    guzik.setAttribute('id', 'guzik');
                    guzik.innerHTML = "POWROT";
                    document.body.appendChild(guzik);
                    //po kliknieciu w guzik strona sie zaladuje ponownie
                    //czyli mozemy zaczac nowa gre
                    guzik.addEventListener('click', () => {
                        //PONOWNE ZALADOWANIE STRONY CZYLI POKAZE SIE ZNOWU CALE MENU
                        location.reload();
                    });
                    //rowniez po wcisnieciu spacji strona sie zaladuje ponownie
                    document.addEventListener('keydown', function(e) {
                        if (e.code === 'Space') {
                            //PONOWNE ZALADOWANIE STRONY CZYLI POKAZE SIE ZNOWU CALE MENU
                            location.reload();
                        }
                    });
                }
            }
        }
        
        //aktualizacja wyniku
        //zaleznie od zdobytych punktow
        //zmienia sie czas co ile ma sie pojawiac kosmita
        //i premia za zabicie kosmity
        if (pkt >= 250 && pkt < 500) {
            time = 900;
            premia = 40;
        }
        else if (pkt >= 500 && pkt < 1000) {
            time = 750;
            premia = 45;
        }
        else if (pkt >= 1000 && pkt < 1500) {
            time = 500;
            premia = 50;
        }
        else if (pkt >= 1500 && pkt < 2000) {
            time = 400;
            premia = 55;
        }
        else if (pkt >= 2000) {
            time = 350;
            premia = 100;
        }
        //jezeli czas sie zmienil to zmieniam resetuje interwal
        //odpowadajacy za czas pojawiania sie kosmitow
        if (time !== lastTime) {
            //funkcja changeInterval() opisana jest na dole
            changeInterval();
            //ustawiam lastTime na obecny czas
            lastTime = time;
        }
        //window.requestAnimationFrame(update);




    }//KONIEC UPDATE


    function changeInterval() {
        // zatrzymaj poprzedni interwał, jeśli istnieje
        if (enemyIntervalId) {
            //"zatrzymuje" interwal
            clearInterval(enemyIntervalId);
        }
        //uruchom nowy interwal z aktualnym opoznieniem
        //wywoluj funkcje createEnemy co time 
        //PRZYPOMNIENIE 
        //time to zmienna ktora sie zmienia w zaleznosci od zdobytych punktow
        enemyIntervalId = setInterval(createEnemy, time);
    }

    //w tym miejscu to sie wykonuje tylko raz - na poczatku gry 
    changeInterval(); 

    //console.log("time "+ time);
    //ustawiam wynik zeby sie zmienial co sekunde
    //co sekunde dodaje 10 pkt do wyniku
    setInterval(() => {
        pkt += 10;
        wynik.innerHTML = pkt;
    }, "1000");



    //funkcja update() bedzie wywolywana co 1/60 sekundy
    //zamiast window.requestAnimationFrame(update);
    setInterval(update, 1000/60);

}//KONIEC FUNKCJI STARTGAME()


//TAKIE POWINNY BYC RESPY PRZECIWNIKOW
// drzwi lewa gora 120, 25
// drzwi prawa gora width-40-120, 25

// drzwi lewy dol 120, 375 (height-65)
// drzwi prawy dol width-40-120, 375 (height-65)

//funkcja ktora tworzy przeciwnikow
function createEnemy() {    
    //losuje liczbe od 0 do 3
    //i w zaleznosci od tej liczby tworze kosmitow
    //w jednym z 4 mozliwych wejsc na canvas
    random = Math.floor(Math.random() * 100)%4;
    //kiedy random = 0 to tworze kosmite w lewym gornym rogu itd
    if(random == 0) {
        //console.log(time)
        enemies.push(new Enemy_class({
            position: {
                x: 120,
                y: 25
            },
            imageSrc: './images/enemy/kosmita.png',
        }));
    }
    else if(random == 1) {
        //console.log(time)
        enemies.push(new Enemy_class({
            position: {
                x: width-40-120,
                y: 25
            },
            imageSrc: './images/enemy/kosmita.png',
        }));
    }
    else if(random == 2) {
        //console.log(time)
        enemies.push(new Enemy_class({
            position: {
                x: 120,
                y: height-65
            },
            imageSrc: './images/enemy/kosmita.png',
        }));
    }
    else if(random == 3) {
        //console.log(time)
        enemies.push(new Enemy_class({
            position: {
                x: width-40-120,
                y: height-65
            },
            imageSrc: './images/enemy/kosmita.png',
        }));
    }
}
//KONIEC PLIKU

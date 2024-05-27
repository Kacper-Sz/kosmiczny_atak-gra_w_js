//PLIK Z KLASA GRACZA
//klasa dziedziczy po klasie sprite - extends Sprite_class
//dzieki czemu mozemy uzyc metod z klasy sprite
class Player_class extends Sprite_class{
    //konstruktor klasy gracza
    constructor({imageSrc, frameRate, frameBuffer, animations}) {
        //wywolanie konstruktora klasy sprite
        super({imageSrc, frameRate, frameBuffer});
        //dodanie pozycji gracza
        this.position = {
            x: 487-25,
            y: 288-25
        }
        //dodajemy nowa wlasnosc do zapisywania otatniego czasu kolizji
        this.lastCollision = 0; 
        //dodajemy czas jaki musi uplynac przed wykryciem kolejnej kolizji
        this.collisionCooldown = 1000;
        //animacje czyli wszystkie zdjecia z postacia
        this.animations = animations;
        //iteruje po obiektach w animations i tworze nowy obiekt image
        for(let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;            
            this.animations[key].image = image;
        }
    }
    //sluzy do aktualizacji hitboxa
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x+12,
                y: this.position.y+2
            },
            width: 28,
            height: 58
        };
    }
    //key jest danym elementem z obiektu animations ktory zawieta obrazek i dane o animacji
    swapAnimation(key) {
        //jezeli obrazek jest taki sam jak obrazek z obiektu animations to nie rob nic
        if(this.image === this.animations[key].image || !this.loaded) return;
        //jezeli obrazek jest inny to zmieniamy obrazek na obrazek z obiektu animations    
        this.frameRate = this.animations[key].frameRate;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.image = this.animations[key].image;
    }
    //poruszanie sie postacia
    move() {
        //poruszanie postacia
        //kiedy wcisniemy klawisz W to zmieniamy pozycje gracza w gore itd
        if (keysPressed["KeyW"]) {
            this.position.y -= 5;
            direciton = "up";
            this.swapAnimation('RunUp');
        }
        if (keysPressed["KeyS"]) {
            this.position.y += 5;
            direciton = "down";
            this.swapAnimation('RunDown');
        }
        if (keysPressed["KeyD"]) {
            this.position.x += 5;
            direciton = "right";
            this.swapAnimation('RunRight');
        }
        if (keysPressed["KeyA"]) {
            this.position.x -= 5;
            direciton = "left";
            this.swapAnimation('RunLeft');
        }

        //jezeli nie wcisniemy zadnego klawisza to zmieniamy animacje na stojaca
        //animacja wyglada roznie w zaleznosci od kierunku w ktorym patrzy postac
        if (!keysPressed["KeyW"] && direciton == "up" || keysPressed["KeyW"] && keysPressed["KeyS"] && direciton == "up") {
            this.swapAnimation('Up');
        }
        else if (!keysPressed["KeyS"] && direciton == "down" || keysPressed["KeyW"] && keysPressed["KeyS"] && direciton == "down") {
            this.swapAnimation('Down');
        }
        else if (!keysPressed["KeyD"] && direciton == "right" || keysPressed["KeyD"] && keysPressed["KeyA"] && direciton == "right") {
            this.swapAnimation('Right');
        }
        else if (!keysPressed["KeyA"] && direciton == "left" || keysPressed["KeyD"] && keysPressed["KeyA"] && direciton == "left") {
            this.swapAnimation('Left');
        }       
    }
    update() {
        //aktualizacja klatki animacji i hitboxa
        this.updateFrames();
        this.updateHitbox();
        //ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ////hitboxy
        ////ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ////ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        ////this.draw();
        
        //warunki zeby nie wyjsc poza ekran
        if (this.position.x -5 < 64) {
            this.position.x = 65;
        }
        else if (this.position.x + this.width >= width - 64)
        {
            this.position.x = width - this.width - 65;
        }

        if (this.position.y <= 64) {
            this.position.y = 65;
        }
        else if (this.position.y + this.height >= height - 64) {
            this.position.y = height - this.height - 65;
        }
    }
} 	

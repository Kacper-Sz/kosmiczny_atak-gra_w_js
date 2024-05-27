//klasa przeciwnika z dziedziczeniem po klasie sprite
//dziedziczenie po klasie sprite - extends Sprite_class
class Enemy_class extends Sprite_class{
    //konstruktor klasy przeciwnika
    constructor({position, imageSrc}) {
        //wywolanie konstruktora klasy sprite
        super({position, imageSrc, frameRate: 5, frameBuffer: 4});
        this.position = position
        this.size = 40;
        this.speed = 1;
    }
    //aktualizacja hitboxa
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x+12,
                y: this.position.y+4.5
            },
            width: 29,
            height: 45
        };
    }
    //aktualizacja przeciwnika
    update(postac) {
        //aktualizacja hitboxa
        this.updateHitbox();
        /*
        //rysowanie hitboxa
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        */

        //poruszanie sie przeciwnika w kierunku gracza
        //"sledzenie" srodka gracza
        if (this.hitbox.position.x > postac.position.x+0.5*postac.width-0.5*this.size) this.position.x -= this.speed;
        if (this.hitbox.position.x < postac.position.x+0.5*postac.width-0.5*this.size) this.position.x += this.speed;
        if (this.hitbox.position.y > postac.position.y+0.5*postac.height-0.5*this.size) this.position.y -= this.speed;
        if (this.hitbox.position.y < postac.position.y+0.5*postac.height-0.5*this.size) this.position.y += this.speed;
    }
    //sprawdzanie kolizji z graczem
    checkCollision(player) {
        //zwaraca true jezeli kolizja nastapila
        //sprawdza kolizje pomiedzy hitboxami przeciwnika i gracza
        return (
            this.hitbox.position.x < player.hitbox.position.x + player.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width > player.hitbox.position.x &&
            this.hitbox.position.y < player.hitbox.position.y + player.hitbox.height &&
            this.hitbox.position.y + this.hitbox.height > player.hitbox.position.y
        );
    }
}

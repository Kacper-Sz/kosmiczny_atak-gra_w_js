//klasa pociskow 
class Bullet_class{
  //konstruktor klasy pociskow
  constructor(x, y, vx, vy, direciton, imageSrc) {
      this.vx = vx;
      this.vy = vy;
      this.direction = direciton;
      this.image = new Image();
      this.image.src = imageSrc;
      this.size = 30;
      this.x = x;
      this.y = y;
      this.frameRate = 6;
      this.currentFrame = 0;
      this.frameBuffer = 1;
      this.elapsedFrames = 0;
    }
    //sprawdzanie kolizji z przeciwnikiem
    checkCollision(enemy) {
      //zwaraca true jezeli kolizja nastapila
      //sprawdza kolizje pomiedzy pociskiem a hitboxami przeciwnikiem
      //czyli obszarem ktory jest "cialem" przeciwnika
      return (
          this.x < enemy.hitbox.position.x + enemy.hitbox.width &&
          this.x + this.size > enemy.hitbox.position.x &&
          this.y < enemy.hitbox.position.y + enemy.hitbox.height &&
          this.y + this.size > enemy.hitbox.position.y
      );
    }
    //rysowanie pocisku wystrzelonego przez gracza
    //bez animacji
    draw_shoot() {
      ctx.drawImage(this.image, this.x, this.y);
    }
    //tysowanie pocisku wystrzelonego przez przeciwnika
    //ktory ma animacje - wybuch
    draw_boom() { 
      //jezeli obrazek jest zaladowany to rysujemy go
      this.image.onload = () => {
        this.width = this.image.width / this.frameRate;
        this.height = this.image.height;
      }
      //bedziemy "wycinac" obrazek z obrazka "wybuch"
      //zeby moc narysowac poszczeegolne klatki animacji
      const box = {
        position: {
            x: this.currentFrame * (this.image.width/this.frameRate),
            y: 0
        },
        width: this.image.width/this.frameRate,
        height: this.image.height
      }
      ctx.drawImage(
          this.image,
          box.position.x,
          box.position.y,
          box.width,
          box.height,
          this.x,
          this.y,
          this.width,
          this.height
      );
    }
    //aktualizacja klatki animacji wybuchu
    update_boom() {
      //jezeli minelo odpowiednio duzo klatek to zmieniamy klatke
      //zeby animacja wygladala jak wybuch
      //i nie byla zbyt szybka
      this.elapsedFrames++;
      if (this.elapsedFrames%this.frameBuffer === 0) {
          if(this.currentFrame < this.frameRate - 1) this.currentFrame++;
          else this.currentFrame = 0;
      }
    }
  }
  
  
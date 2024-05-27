//klasa sprite sluzy do rysowania tla i animacji
class Sprite_class {
    //konstruktor klasy sprite
    constructor({position, imageSrc, frameRate, frameBuffer}) {
        this.position = position;
        this.image = new Image();
        this.loaded = false;
        this.image.onload = () => {
            this.width = this.image.width / this.frameRate;
            this.height = this.image.height;
            this.loaded = true;//zdj jest zaladowane
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0;
         
    }
    //rysowanie tla
    draw() {
        if(!this.image) return;
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
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
    //aktualizacja klatek
    updateFrames() {
        this.elapsedFrames++;
        if (this.elapsedFrames%this.frameBuffer === 0) {
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else this.currentFrame = 0;
        }
    }        
}

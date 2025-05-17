import sceneManager from "../utils/SceneManager";


export default class NavigationController{
    constructor(scene){
        this.scene = scene;
        this.escKey = null;
        this.init();
    }    

    init(){
        this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.scene.events.on('update',this.update, this);

        this.scene.events.once('shutdown', this.shutdown, this)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.escKey)){
            this.handleEscapeKey();
        }
    }

    handleEscapeKey(){
        const success = sceneManager.goBack(this.scene);
        if(!success){
            console.log("No other Scene to Go to");
        }
        // sceneManager.navigateToScene(this, "MainScene", this.player);
    }

    shutdown(){
        this.scene.events.off('update', this.update, this);
        if (this.escKey){
            this.escKey.reset();
        }
    }
}
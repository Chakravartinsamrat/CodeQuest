class SceneManager{
    constructor(){
        this.sceneHistory = [];
        this.currentScene = [];
    }

    navigateToScene(scene, targetSceneKey){

        if(scene.scene.key){
            this.sceneHistory.push(scene.scene.key);
        }
        this.currentScene = targetSceneKey;
        scene.scene.start(targetSceneKey);
    }

    goBack(scene){
        if(this.sceneHistory.length > 0){
            const  previousScene = this.sceneHistory.pop();
            this.currentScene =  previousScene;
            scene.scene.start(previousScene);
            return true;
        }
        return false;
    }

    getCurrentScene(){
        return this.currentScene;
    }
}


const sceneManager = new SceneManager();
export default sceneManager ;

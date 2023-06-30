import Config from '../../../data/config';
import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class IronSourceGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.INIT;

    this.soundsController = new SoundsController();

    /* -------------------------------DAPI------------------------------------ */
    //LOAD the game, but don't start it until the ad is visible

    const onLoad = () => {
      console.log("On load called");
      (dapi.isReady()) ? this.onReadyCallback() : dapi.addEventListener("ready", () => this.onReadyCallback());
    }

    window.addEventListener('load', () => onLoad());
  }

  onReadyCallback() {
    // console.log('%c READY ', 'background: #0095ff; color: #ffffff');
    //no need to listen to this event anymore
    dapi.removeEventListener("ready", this.onReadyCallback);
    console.log("On ready callback called");

    let isAudioEnabled = !!dapi.getAudioVolume();

    if (dapi.isViewable()) {
      this.adVisibleCallback({ isViewable: true });
      // console.log('%c Check if visible TRUE ', 'background: #0095ff; color: #ffffff');
    }

    dapi.addEventListener("viewableChange", () => { this.adVisibleCallback({ isViewable: dapi.isViewable() }) });
    dapi.addEventListener("adResized", () => { this.adResizeCallback(dapi.getScreenSize()) });
    dapi.addEventListener("audioVolumeChange", () => { this.audioVolumeChangeCallback() });
  }

  startGame() {
    console.log("Start game called");

    let screenSize = dapi.getScreenSize();
    this.screenSize = screenSize;
  }

  pauseGame() {
    console.log("Pause game called");

    //pause your game here(add your own code here)
  }

  adVisibleCallback(event) {
    // console.log('%c VISIBLE ' + event.isViewable, 'background: #0095ff; color: #ffffff');
    console.log("adVisibleCallback called");
    console.log("isViewable " + event.isViewable);

    if (event.isViewable) {
      if (event.startGame) event.startGame();
      this.startGame();
    } else {
      if (event.pauseGame) event.pauseGame();
      this.pauseGame();
    }
  }

  adResizeCallback(event) {
    this.screenSize = event
    console.log("adResizeCallback called");

    // console.log('%c RESIZE: width:' + this.screenSize.width +' height: '+ this.screenSize.height, 'background: #0095ff; color: #ffffff');
  }

  //When user clicks on the download button - use openStoreUrl function
  userClickedDownloadButton(event) {
    dapi.openStoreUrl();
  }

  audioVolumeChangeCallback(volume) {
    // console.log('%c VALUE CHANGE to '+volume, 'background: #0095ff; color: #ffffff');
    let isAudioEnabled = !!volume;

    if (isAudioEnabled) {
      //START or turn on the sound
      Model.mute = true;
    } else {
      //PAUSE the turn off the sound
      Model.mute = false;
    }
  }

  /* -------------------------------DAPI------------------------------------ */
  onDown(event, x, y) { }

  goToStore() {
    console.log("Go to store");
    this.userClickedDownloadButton();
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) {
    this.delta = delta;

    if (Model.gameStep === Model.gameSteps.INIT) {
      try {
        if (dapi && dapi.isViewable()) {
          Model.gameStep = Model.gameSteps.LOAD;
        }
      } catch (error) {
      }
    }
  }
}  
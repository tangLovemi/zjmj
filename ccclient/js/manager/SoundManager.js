/**
 * Created with JetBrains WebStorm.
 * User: luobo
 * Date: 13-11-13
 * Time: 下午7:56
 * To change this template use File | Settings | File Templates.
 */
jsclient.MusicState = "MusicState";
jsclient.SoundState = "SoundState";

jsclient.MIN_INTERVAL_GROUP_SOUND = 200;  // 同一组的声音的默认播放时间

jsclient.SoundManager = (function () {
    var PlayingSound = function(audioID, priority){
        this.audioID = audioID;
        this.priority = priority;
        this.startTime = jsclient.getCurrentMillSeconds();
    };

    PlayingSound.prototype.isExpired = function(){
        return jsclient.getCurrentMillSeconds() - this.startTime >= jsclient.MIN_INTERVAL_GROUP_SOUND;
    };

    var SoundManager = function () {
        this.soundPath = jsclient.SoundConfig.SOUND_FILE_PATH || "res/sounds/";
        this.isEnabledMusic = jsclient.StorageUtils.getBoolForKey(jsclient.MusicState, true);
        this.isEnabledEffect = jsclient.StorageUtils.getBoolForKey(jsclient.SoundState, true);
        this._lastPlayMusicId = -1;

        this._soundGroupMembers = {};

        jsclient.StorageUtils.setBoolForKey(jsclient.MusicState, this.isEnabledMusic);
        jsclient.StorageUtils.setBoolForKey(jsclient.SoundState, this.isEnabledEffect);
    };

    SoundManager.instance = null;
    SoundManager.getInstance = function () {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
//            cc.AudioEngine.getInstance().preloadSound(this.soundPath+"10005.mp3");
        }
        return SoundManager.instance;
    };

    SoundManager.prototype.getEnabledMusic = function(){
        return this.isEnabledMusic;
    };

    SoundManager.prototype.setEnabledMusic = function(enabled){
        this.isEnabledMusic = enabled;
        if (!this.isEnabledMusic) {
            this.stopMusic();
        }
        jsclient.StorageUtils.setBoolForKey(jsclient.MusicState, this.isEnabledMusic);
    };

    SoundManager.prototype.switchEnabledMusic = function(){
        this.isEnabledMusic = !this.isEnabledMusic;
        if (!this.isEnabledMusic) {
            this.stopMusic();
        }
        jsclient.StorageUtils.setBoolForKey(jsclient.MusicState, this.isEnabledMusic);
    };

    SoundManager.prototype.getEnabledEffect = function(){
        return this.isEnabledEffect;
    };

    SoundManager.prototype.setEnabledEffect = function(enabled){
        this.isEnabledEffect = enabled;
        jsclient.StorageUtils.setBoolForKey(jsclient.SoundState, this.isEnabledEffect);
    };

    SoundManager.prototype.switchEnabledEffect = function(){
        this.isEnabledEffect = !this.isEnabledEffect;
        jsclient.StorageUtils.setBoolForKey(jsclient.SoundState, this.isEnabledEffect);
    };


    SoundManager.prototype.playEffectWithID = function(id, group, priority){
        if (this.isEnabledEffect){
            var config = jsclient.CsvConfigParser.getConfig(jsclient.SoundConfig.SOUND_CONFIG_CSV_NAME, {"id": id});

            if (config){
                this.playEffectWithSoundName(config["sound"], group, priority);
            }else{
                Log("playEffectWithID-->found not sound config:" + id);
            }
        }
    };

    SoundManager.prototype.playEffectWithSoundName = function(soundName, group, priority){
        if (this.isEnabledEffect){
            priority = priority || 0;
            var playingSound = group ? this._soundGroupMembers[group] : null;
            if (!playingSound || playingSound.priority < priority || playingSound.isExpired()){
                if (playingSound){
                    // Log("playEffectWithSoundName-->stopSound:" + soundName);
                    this.stopEffect(playingSound.audioID);
                }

                var soundFile = this.soundPath + soundName;
                var audioID = cc.AudioEngine.getInstance().playEffect(soundFile, false);
                if (group){
                    this._soundGroupMembers[group] = new PlayingSound(audioID, priority);
                }
            }
        }
    };

    SoundManager.prototype.stopEffect = function(audioID){
        if (this.isEnabledEffect){
            cc.AudioEngine.getInstance().stopEffect(audioID);
        }
    };

    SoundManager.prototype.playMusicWithID = function(id){
        if (id <= 0){
            return;
        }

        // Log("playMusicWithID-->isEnabledMusic:" + this.isEnabledMusic);
        if (this.isEnabledMusic){
            var config = jsclient.CsvConfigParser.getConfig(jsclient.SoundConfig.SOUND_CONFIG_CSV_NAME, {"id": id});

            if (config){
                if (config["id"] != this._lastPlayMusicId){
                    var soundFile = this.soundPath + config["sound"];
                    cc.AudioEngine.getInstance().playMusic(soundFile, true);
                    this._lastPlayMusicId = config["id"];
                }else{
                    Log("playMusicWithID-->same music:" + id);
                }
            }else{
                Log("playMusicWithID-->found not sound config:" + id);
            }
        }
    };

    SoundManager.prototype.playMusicWithSceneName = function(sceneName){
        if (this.isEnabledMusic){
            var config = jsclient.CsvConfigParser.getConfig(jsclient.SoundConfig.SOUND_CONFIG_CSV_NAME, {"scene": sceneName, "type": "1"});

            if (config){
                if ( config["id"] != this._lastPlayMusicId){
                    var soundFile = this.soundPath + config["sound"];
                    cc.AudioEngine.getInstance().playMusic(soundFile, true);
                    this._lastPlayMusicId = config["id"];
                }else{
                    Log("playMusicWithID-->same music:" + config["id"]);
                }
            }else{
                Log("playMusicWithID-->found not sound config:" + sceneName);
            }
        }
    };

    SoundManager.prototype.stopMusic = function(){
        if (cc.AudioEngine.getInstance().isMusicPlaying()){
            cc.AudioEngine.getInstance().stopMusic(true);
            this._lastPlayMusicId = -1;
        }
    };

    return SoundManager;

})();
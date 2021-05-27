import { enableDebugs, isEnabled } from "./utils/debug/debug.js";
import { print } from "./utils/debug/print.js";
import Performance from "./utils/debug/performance.js";
import fileType from "./utils/fileType.js";
import isInRange from "./utils/range.js";
import EventManager from "./event/eventManager.js";
import State from "./state/state.js";
import Display from "./display/display.js";
import ResourceManager from "./resource/resourceManager.js";

/**
 * This is the engine namespace (fe = frosting engine)
 * We use this namespace to access our game engine
 * @const {Object} fe - creates namespace for all engine features
 */
const fe = {
    /**
     * Container for debug utilities
     * @name debugs
     * @memberof fe
     */
    "debugs": {
        /**
         * Enables/ Disables debugs
         * @name enableDebugs
         * @memberof fe.debugs
         * @param {boolean} value - Value to enable or disable the debugs
         */
        "enableDebugs": enableDebugs,
        /**
         * check if debugs are enabled
         * @name isEnabled
         * @memberof fe.debugs
         */
        "isEnabled": isEnabled,
        /**
         * Logs a value to the console
         * @name log
         * @memberof fe.debugs
         * @param {any} value - Value to be logged to the console
         */
        "print": print,
        /**
         * logs performance metrics table to console
         * @name 
         * @memberof fe.debugs
         */
        "performance": Performance
    },
    "utils": {
        /**
         * returns the file extension of a file type
         * @name fileType
         * @memberof fe.utils
         */
        "fileType": fileType,
        /**
         * checks if a value is within range
         * @name isInRange
         * @memberof fe.debugs
         * @param {number} value - value to check
         * @param {number} min - minimum range value
         * @param {number} max - maximum range value
         */
        "isInRange": isInRange
    },
    /**
     * Event System - Allows objects and features publish events or subscribe to listen for them
     * @name event
     * @memberof fe
     */
    "event": EventManager,
    /**
     * State System - Game state system controls the entire system
     * @name state
     * @memberof fe
     */
    "state": State,
    /**
     * Display System - Used to render onto the screen, runs webGL by default with canvasAPI fall back
     * @name display
     * @memberof fe
     */
    "display": Display,
    /**
     * Resource System - Used to preload resources into the game, objects access resources from the manager,
     * this optimises the amount of loading and memory needed when the game is running.
     * @name resource
     * @memberof fe
     */
    "resource": ResourceManager,
}

export default fe;
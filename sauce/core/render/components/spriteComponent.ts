import ResourceManager from "../../resource/resourceManager.js";
import EventManager from "../../event/eventManager.js";
import { print } from "../../utils/debug/print.js";
import Camera from "../../camera/camera.js";
import Renderer from "../renderer.js";
import lerp from "../../utils/math/lerp.js";

/**
 * Sprite Component
 * @class
 * @classdesc can be added to an entity class for static sprite rendering 
 */
export default class SpriteComponent {

    /**
     * fileURL - backup in case sprite isn't loaded into resource manager
     * @private
     * @property
     * @name _fileURL
     * @type { string }
     */
    private _fileURL: string;
    /**
     * resourceName - used to access sprite from resource manager
     * @private
     * @property
     * @name _resourceName
     * @type { string }
     */
    private _resourceName: string;
    /**
     * sx - starting x axis point to draw from the image
     * @private
     * @property
     * @name _sx
     * @type { number }
     */
    private _sx: number | undefined;
    /**
     * sy - starting y axis point to draw from the image
     * @private
     * @property
     * @name _sy
     * @type { number }
     */
    private _sy: number | undefined;
    /**
     * sw - width from x axis to draw from the image
     * @private
     * @property
     * @name _sx
     * @type { number }
     */
    private _sw: number | undefined;
    /**
     * sh - height from xyaxis to draw from the image
     * @private
     * @property
     * @name _sx
     * @type { number }
     */
    private _sh: number | undefined;
    /**
     * dx - x axis point on the canvas to start drawing the image 
     * @private
     * @property
     * @name _dx
     * @type { number }
     */
    private _dx: number;
    /**
     * dy - y axis point on the canvas to start drawing the image 
     * @private
     * @property
     * @name _dy
     * @type { number }
     */
    private _dy: number;
    /**
     * scale - used to scale the image on the canvas. a scale of 1 draws the image at it's native size 
     * @private
     * @property
     * @name _scale
     * @type { number }
     */
    private _scale: number | undefined;
    /**
     * previous x - stores the last x position, used to lerp between previous and current x coord
     * @private
     * @property
     * @name _px
     * @type { number }
     */
    private _px: number;
    /**
     * previous y - stores the last y position, used to lerp between previous and current y coord
     * @private
     * @property
     * @name _py
     * @type { number }
     */
    private _py: number;
    /**
     * x - used to place the sprite in the game world using world units
     * @private
     * @property
     * @name _X
     * @type { number }
     */
    private _x: number;
    /**
     * y - used to place the sprite in the game world using world units
     * @private
     * @property
     * @name _y
     * @type { number }
     */
    private _y: number;
    /**
     * isAssetLoaded - flag to check if the asset is loaded into the resource manager before we start drawing it to the screen
     * @private
     * @property
     * @name _isAssetLoaded
     * @type { boolean }
     */
    private _isAssetLoaded: boolean;

    constructor(fileURL: string, resourceName: string, sx?: number, sy?: number, sw?: number, sh?: number, scale?: number) {
        this._fileURL = fileURL;
        this._resourceName = resourceName;
        this._sx = sx;
        this._sy = sy;
        this._sh = sh;
        this._sw = sw;
        this._x = 0;
        this._y = 0;
        this._px = 0;
        this._py = 0;
        this._dx = 0;
        this._dy = 0;
        this._scale = scale;
        this._isAssetLoaded = false;

        this.checkAssetLoaded();
    }

    /**
     * checkAssetLoaded - checks if the asset is already loaded into the resource manager and if not, starts to load it in
     * @private
     * @method
     * @name checkAssetLoaded
     * @memberof SpriteComponent
     */
    private checkAssetLoaded(): void {
        const isLoaded: boolean = ResourceManager.request(this._resourceName) ? true : false;
        
        if (isLoaded === false) {
            print("SpriteComponent: Asset not preloaded, loading into Resource Manager now");

            this._isAssetLoaded = false;
            EventManager.subscribe(`resource-image-${this._resourceName}`, this.eventListener.bind(this));
            ResourceManager.addResource(this._resourceName, this._fileURL);
        }
        else {
            this._isAssetLoaded = true;
        }
    }

    /**
     * eventListener - callback when asset is loaded into the resource manager
     * @private
     * @method
     * @name eventListener
     * @memberof SpriteComponent
     */
    private eventListener(): void {
        print("SpriteComponent: Asset now loaded into Resource Manager");

        this._isAssetLoaded = true;
        EventManager.unsubscribe(`resource-image-${this._resourceName}`, this.eventListener.bind(this));
    }

    /**
     * coordsToPixels - converts an entities game coords to pixel coords
     * @private
     * @method
     * @name coords_to_pixels
     * @memberof SpriteComponent
     */
    private coordsToPixels(delta: number): void {
        const x = lerp(this._px, this._x, delta);
        const y = lerp(this._py, this._y, delta);
        const screenCoordinates = Camera.toScreenSpace(x, y);
        this._dx = screenCoordinates.x;
        this._dy = screenCoordinates.y;
    }

    /**
     * update - called by the base entity class on an update loop,
     * @public
     * @method
     * @name update
     * @memberof SpriteComponent
     */
    public update(parent: this): void {
        this._px = this._x;
        this._py = this._y;
        this._x = parent.x;
        this._y = parent.y;
    }

    /**
     * draw - called by the world system to update its drw info and queue up in the renderer
     * @public
     * @method
     * @name draw
     * @memberof SpriteComponent
     * @param { number } delta
     */
    public draw(delta: number): void {
        this.coordsToPixels(delta);

        if (this._isAssetLoaded) {
            let data: imageData = {
                "sx": this._sx || undefined,
                "sy": this._sy || undefined,
                "sw": this._sw || undefined,
                "sh": this._sh || undefined,
                "dx": this._dx,
                "dy": this._dy,
                "scale": this._scale || 1
            };

            Renderer.addToQueue(data, "image", this._resourceName);
        }
    }

    get x(): number {   //returns x postion in game world
        return this._dx;
    }

    get y(): number {   //returns y position in game world
        return this._dy;
    }
}
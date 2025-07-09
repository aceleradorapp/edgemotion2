import BehaviorContainer from "../utils/behavior/BehaviorContainer.js";
import Util from "../utils/helpers/Util.js";
import Object from "./Object.js";

class DisplayObject extends Object {
    /**
        A classe DisplayObject representa um objeto exibido na tela. Ela contém propriedades para definir a posição, 
        tamanho, rotação e transparência do objeto.
        Ela também possui métodos para controlar a visibilidade do objeto, 
        para desenhar gráficos e para gerenciar a interação com o mouse.
    */
    constructor() {
        super();

        this._context = null;
        this._util = new Util();
        this._behavior = new BehaviorContainer();

        this._guid = this._util.generateGuid(15);
        this._type = 'interactiveObject';
        this._shape = 'rectangle';
        this._instance = null;        
        this._physical = false;
        this._interactive = true;

        this._alpha = 1;
        this._alphaTemp = 1;
        this._blendMode = "normal";
        this._cacheAsBitmap = false;
        this._color = '#000000';
        this._debug = false;
        this._filters = null;
        this._height = 0;
        this._mask = null;
        this._name = null;
        this._offsetX = 0;
        this._offsetY = 0;
        this._opaqueBackground = null;
        this._parent = null;
        this._pivotX = 0;
        this._pivotY = 0;
        this._radius = 0;
        this._rotation = 0;
        this._rotate = 0;
        this._scale9Grid = null;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleGlobal = 1;
        this._scrollRect = null;
        this._stage = null;
        this._startDrag = false;
        this._transform = null;
        this._visible = true;
        this._width = 0;
        this._x = 0;
        this._y = 0;

        this._parentContainerX = 0;
        this._parentContainerY = 0;
    }

    get guid() {
        return this._guid;
    }

    /**
     * Propriedade que armazena o typo de objeto, ex: type = 'circle'.
     */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    /**
     * Propriedade que armazena o typo de calculo de colisão do objeto, ex: shape = 'collisionCircle'.
     */
    get shape() {
        return this._shape;
    }
    set shape(value) {
        this._shape = value;
    }

    /**
     * Propriedade que cria um nome de instância para o object
     */
    get instance() {
        return this._instance;
    }
    set instance(value) {
        this._instance = value;
    }

    /**
     * Recebe um valor boleano indicando se o objeto terá interação com física.
     */
    get physical() {
        return this._physical;
    }
    set physical(value) {
        this._physical = value;
    }

    get interactive() {
        return this._interactive;
    }

    set interactive(value) {
        this._interactive = value;
    }

    /**
     * Propiedade referente a posição no eixo X da área de desenho.
     */
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }

    /**
     * Propiedade referente a posição no eixo Y da área de desenho.
     */
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }

    /**
     * Deslocamento do objeto em seu eixo X.
     */
    get offsetX() {
        return this._offsetX;
    }
    set offsetX(value) {
        this._offsetX = value;
    }
    /**
     * Deslocamento do objeto em seu eixo Y.
     */
    get offsetY() {
        return this._offsetY;
    }
    set offsetY(value) {
        this._offsetY = value;
    }

    /**
     * Ponto de referencia do objeto em sua área que é usado para calculo de animação, rotação no eixo X.
     */
    get pivotX() {
        return this._pivotX;
    }
    set pivotX(value) {
        this._pivotX = value;
    }

    /**
     * Ponto de referencia do objeto em sua área que é usado para calculo de animação, rotação no eixo Y.
     */
    get pivotY() {
        return this._pivotY;
    }
    set pivotY(value) {
        this._pivotY = value;
    }

    /**
     * Propriedade que armazena a posição X do objeto pai, sada como referência para calculo do posição x do filho.
     */
    get parentContainerX() {
        return this._parentContainerX;
    }
    set parentContainerX(value) {
        this._parentContainerX = value;
    }

    /**
     * Propriedade que armazena a posição X do objeto pai, sada como referência para calculo do posição y do filho.
     */
    get parentContainerY() {
        return this._parentContainerY;
    }
    set parentContainerY(value) {
        this._parentContainerY = value;
    }

    /**
     * Propriedade referente a largura do objeto.
     */
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this._calculatePivot();
    }

    /**
     * Propriedade referente a altura do objeto.
     */
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this._calculatePivot();
    }

    /**
     * Pripriedade que faz com que o objeto gire no seu eixo para uma terminada direção, -1 esquerda e 1 direita
     */
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
    }

    /**
     * Propriedade que rotaciona o objeto em seu eixo usando como valor de angulo, ex: 33°.
     */
    get rotate() {
        return this._rotate;
    }
    set rotate(value) {
        this._rotate = value;
    }
    /**
     * Propriedade relacionada a escala do objeto no eixo X.
     */
    get scaleX() {
        return this._scaleX;
    }
    set scaleX(value) {
        this._scaleX = value;
    }

    /**
     * Propriedade relacionada a escala do objeto no eixo Y.
     */
    get scaleY() {
        return this._scaleY;
    }
    set scaleY(value) {
        this._scaleY = value;
    }

    /**
     * Proriedade referente a tranparência do objeto;
     */
    get alpha() {
        return this._alpha;
    }
    set alpha(value) {
        this._alpha = value;
        this._alphaTemp = value;
    }

    /**
     * Propriedade que deixa o objeto visivel ou invisivel;
     */
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }

    /**
     * ????
     */
    get blendMode() {
        return this._blendMode;
    }
    set blendMode(value) {
        this._blendMode = value;
    }

    /**
     * Proriedade que armazena um bitmap em cache para não ser necesário recarregar o bitmap.
     */
    get cacheAsBitmap() {
        return this._cacheAsBitmap;
    }
    set cacheAsBitmap(value) {
        this._cacheAsBitmap = value;
    }

    /**
     * Propriedade para armazenar um nome de referência para o objeto.
     */
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    /**
     * Propriedade que armazena dos os dados do objeto pai.
     */
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }

    /**
     * Propriedade que armazena todos os dados do componente Stage.
     */
    get stage() {
        return this._stage;
    }
    set stage(value) {
        this._stage = value(value);
    }

    /**
     * Propriedade que indica se o objeto é uma mascara ou não, valor boleano.
     */
    get mask() {
        return this._mask;
    }
    set mask(value) {
        this._mask = value;
    }

    /**
     * propriedade de referência para qualquer tipo de transfomação que o objeto receber;
     */
    get transform() {
        return this._transform;
    }
    set transform(value) {
        this._transform = value;
    }

    /**
     * Propriedade responsável em alterar a escala de um objeto de forma complexas, ex: Objeto shape em forma de balão.
     */
    get scale9Grid() {
        return this._scale9Grid;
    }
    set scale9Grid(value) {
        this._scale9Grid = value;
    }

    /**
     * Propriedade que determina se o objeto tera um backgrouns opaco ou transparent
     */
    get opaqueBackground() {
        return this._opaqueBackground;
    }
    set opaqueBackground(value) {
        this._opaqueBackground = value;
    }

    /**
     * ???
     */
    get scrollRect() {
        return this._scrollRect;
    }
    set scrollRect(value) {
        this._scrollRect = value;
    }

    /**
     * Propriedade que recebe filtros para o objeto;
     */
    get filters() {
        return this._filters;
    }
    set filters(value) {
        this._filters = value;
    }

    /**
     * Propriedade de cor do objeto, valor em hexDecimal
     */
    get color() {
        return this._color;
    }
    set color(colorHex) {
        this._color = colorHex;
    }

    /**
     * pripriedade que recebe o volar em raio de um objeto
     */
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }

    /**
     * Propriedade que ativa o modo debug do objeto
     */
    get debug() {
        return this._debug;
    }

    set debug(value) {
        this._debug = value;
    }

    /**
     * Propriedade que ativa a interação com o mouse, permitindo que o objeto possa ser clicado e arrastado na área de desenho.
     */
    get startDrag() {
        return this._startDrag;
    }
    set startDrag(value) {
        this._startDrag = value;
    }

    /**
     * Retorna o Centro do Objeto
     * @returns Number
     */
    centerX() {
        return this._x + this.halfWidth();
    }

    /**
     * Retorna o Centro do Objeto
     * @returns Number
     */
    centerY() {
        return this._y + this.halfHeight();
    }

    /**
     * Retorna o valor da metade do objeto
     * @returns number
     */
    halfWidth() {
        return this._width / 2;
    }

    /**
     * Retorna o valor da metade do objeto
     * @returns number
     */
    halfHeight() {
        return this._height / 2;
    }

    addBehavior(name, behavior) {
        if (!name && !behavior) return;

        this._behavior.add(name, behavior)
    }

    /**
     * Método privado que é chamado antes do objeto ser desenhado.
     * @param {context2d} context2d 
     */
    beginUpdate(context2d) {
        context2d.globalAlpha = this._alpha;
        this.rotation(context2d);
        this._applyScale(context2d);
    }

    /**
     * Método privado que é chamado depois que o objeto foi desenhado.
     * @param {context2d} context2d 
     */
    endUpdate(context2d) {
        this._debugCalculation(context2d);

        this._behavior.execute(this);
    }

    /**
     * Método privato para ser chamado para desenhar o objeto.
     * Método que será sobrescrito nas clases dos componentes.
     * @param {context2d} context2d 
     */
    draw(context2d) {
        // regra p desenhar 
    }

    /**
     * Método que retorna um objeto com os parâmetros do objeto: x, y, width e height.
     * @returns Object
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 
     * @param {Interactive} otherObject 
     * @returns 
     */
    hitTestObject(otherObject) {
        if (!otherObject) return false;

        const rect1 = new Rectangle(this.x, this.y, this.width, this.height);
        const rect2 = new Rectangle(otherObject.x, otherObject.y, otherObject.width, otherObject.height);
        return rect1.intersects(rect2);
    }

    /**
     * Método privado responsável em calcular a rotação do objeto.
     * @param {context2d} context2d 
     */
    rotation(context2d) {
        //if(this.type == 'stage') return;

        var calculatePosition = this._calculatePosition();

        const objectX = calculatePosition.x;
        const objectY = calculatePosition.y;

        context2d.translate(objectX, objectY);
        context2d.rotate(this.rotate * Math.PI / 180);
        context2d.translate(-objectX, -objectY);
    }

    /**
     * Método resnonsável em redimensionar o objeto 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(width = null, height = null) {
        if (width && height) {
            this._width = width;
            this._height = height;
        } else if (width) {
            const ratio = this._height / this._width;
            this._width = width;
            this._height = width * ratio;
        } else if (height) {
            const ratio = this._width / this._height;
            this._width = height * ratio;
            this._height = height;
        }

        this._calculatePivot();
    }

    /**
    * Deleta a instância do objeto;
    */
    delete() {
        delete this;
    }

    /**
     * Método privado responsável em calcular a scala do objeto;
     * @param {context2d} context2d 
     */
    _applyScale(context2d) {
        var calculatePosition = this._calculatePosition();
        const objectX = calculatePosition.x;
        const objectY = calculatePosition.y;

        context2d.translate(objectX, objectY);
        context2d.scale(this._scaleX, this._scaleY);
        context2d.translate(-objectX, -objectY);
    }

    /**
     * Método privado que refaz os calculor de todos as propriedades do objeto;
     */
    _recalculateParameters() {
        if (!this._parent) return;

        this._parentContainerX = this._parent._parentContainerX + this.x;
        this._parentContainerY = this._parent._parentContainerY + this.y;
    }

    /**
     * Método privado que calcula a posição central de um objeto;
     */
    _calculatePivot() {
        this._pivotX = this._width / 2;
        this._pivotY = this._height / 2;
    }

    /**
     * Método privado que calcula a posição do objeto usando como referência todos os objetos pais. x: x, y: y,width: width, height: height, pivotX:pivotX, pivotY: pivotY
     * @returns Object
     */
    _calculatePosition() {
        var x = (this.pivotX) + this._parentContainerX;
        var y = (this.pivotY) + this._parentContainerY;
        var width = this._width * this.scaleX;
        var height = this._height * this.scaleY;
        var pivotX = x - Math.abs(this.pivotX); // verificar se tem q tirar essa parte
        var pivotY = y - Math.abs(this.pivotY);

        return { x: x, y: y, width: width, height: height, pivotX: pivotX, pivotY: pivotY }
    }

    /**
     * Método q gera os graficos utilizado para o debug dos objetos
     * @param {context2d} context2d 
     */
    _debugCalculation(context2d) {
        if (!this._debug) {
            this._alpha = this._alphaTemp; 
            return;
        };

        this._alpha = 0.6;


        // cria um ponto com as coordenadas do pivot
        context2d.beginPath();
        context2d.arc(this._parentContainerX + this._pivotX, this._parentContainerY + this._pivotY, 5, 0, 2 * Math.PI, false);
        context2d.fillStyle = '#000';
        context2d.fill();
        context2d.strokeStyle = '#000';
        context2d.stroke();
        context2d.closePath();

        context2d.beginPath();
        context2d.moveTo(this._parentContainerX + this._pivotX, this._parentContainerY + this._pivotY);
        context2d.lineTo(this._parentContainerX + this._pivotX, this._parentContainerY + this._pivotY - 20);
        context2d.lineWidth = 2;
        context2d.strokeStyle = '#000';
        context2d.stroke();
        context2d.closePath();

        //cria um retangulo com os limites do objeto
        if (this.type == 'circle') this._width = this._height = this._radius * 2;

        context2d.beginPath();
        context2d.strokeStyle = '#000'
        context2d.lineWidth = 2;
        context2d.strokeRect(this._parentContainerX - this._radius, this._parentContainerY - this._radius, this._width, this._height);
        context2d.closePath();
        
        context2d.beginPath();
        context2d.strokeStyle = '#fff'
        context2d.lineWidth = 2;
        context2d.strokeRect((this._parentContainerX - this._radius-1), (this._parentContainerY - this._radius)-1, this._width+2, this._height+2);
        context2d.closePath();
    }

    /**
     * Método que converte um valor hexa decimal em RGB.
     * @param {HexDecimal} hex 
     * @returns 
     */
    hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    /**
     * Método que recebe uma cor em hexa decimal e converte em uma cor inversa.
     * @param {HexDecimal} hex 
     * @returns 
     */
    inverseColor(hex) {
        var rgb = this.hexToRgb(hex);
        var r = 255 - rgb[0];
        var g = 255 - rgb[1];
        var b = 255 - rgb[2];
        return "#" + r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0');
    }

    /**
     * Método que valida de o objeto é um InteractiveObject;
     * @param {Object} object 
     * @returns 
     */
    _isValid(object) {
        if (object.toString != '[object Object]') return false;

        return true;
    }
}

export default DisplayObject;

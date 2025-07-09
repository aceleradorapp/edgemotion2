class Packer {
    constructor(width, height) {
        this.root = { x: 0, y: 0, w: width, h: height };
    }

    insert(w, h) {
        const node = this.findNode(this.root, w, h);
        if (!node) {
            return null;
        }

        if (node.w === w && node.h === h) {
            return node;
        }

        if (node.w - w > node.h - h) {
            node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
            node.bottom = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
        } else {
            node.right = { x: node.x + w, y: node.y, w: node.w - w, h: node.h };
            node.bottom = { x: node.x, y: node.y + h, w: w, h: node.h - h };
        }

        return node;
    }

    findNode(node, w, h) {
        if (node.used) {
            return this.findNode(node.right, w, h) || this.findNode(node.bottom, w, h);
        } else if (w <= node.w && h <= node.h) {
            return node;
        } else {
            return null;
        }
    }
}

export default Packer;
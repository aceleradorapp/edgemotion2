class PathResolver{
    constructor(){
        this.basePath = window.location.origin;
    }

    resolve(relativePath) {
        return `${this.basePath}/${relativePath}`
    }
}

export default PathResolver;

export class Route{
    public path :PropertyKey;
    public method :PropertyKey;
    public controller :String;
    public action :PropertyKey;
    
    constructor(method :PropertyKey, path :PropertyKey, controller :String, action :PropertyKey){
        this.method = method.toString().toLocaleLowerCase();
        this.path = path;
        this.controller = controller;
        this.action = action;
    }
}
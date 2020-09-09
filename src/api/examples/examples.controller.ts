import {Controller} from "../Controller";
import { ExampleService } from './example.service';

export class ComplexExample extends Controller{
    private service :ExampleService;

    constructor(){
        super();
        this.service = new ExampleService();
    }

    public index() :void{
        try{
            this.responses.responseObject(200, this.service.getExample());
        }
        catch(e){
            this.next(e);
        }
    }
}
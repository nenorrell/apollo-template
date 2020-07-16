import { Apollo } from '../../config/App';
import {Controller} from "../Controller";
import { ExampleService } from './example.service';

export class ComplexExample extends Controller{
    private service :ExampleService;

    constructor(Apollo :Apollo){
        super(Apollo);
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
import { Apollo } from '../config/App';
import { DB } from '../modules/db/db';

export class Service{
    protected db ?:DB;
    constructor(private Apollo ?:Apollo){
        if(Apollo){
            this.db = this.Apollo.db;
        }
    }
}
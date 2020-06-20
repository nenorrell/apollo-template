import {Service} from "../Service";

export class ExampleService extends Service{
    public getExample() :string{
        return "Something complicated"
    }
}
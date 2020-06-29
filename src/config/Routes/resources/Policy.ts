export class Policy{
    public name :string;
    public conditional :Function;

    constructor(name :string, conditional :Function){
        this.name = name;
        this.conditional = conditional;
    }

    public passesCheck() :boolean{
        return this.conditional();
    }
}
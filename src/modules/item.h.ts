type name = "Sprite" | "Cocacola" | "Twix";

//define the item class
export class item {
    itemName:name;
    price:number;
    selected:boolean;
    bought:boolean;

    constructor(_name:name, _price:number) {
        this.itemName = _name;
        this.price = _price;
        this.selected = false;
        this.bought = false;
    }
}
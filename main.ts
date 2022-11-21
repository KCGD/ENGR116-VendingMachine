/* 
    "I pledge that I have abided by the Stevens honor pledge"
*/

import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import { item } from "./src/modules/item.h";
import * as readline from 'readline';

//create interfact
const rl = readline.createInterface({
    'input': process.stdin,
    'output':process.stdout
})

//setup stdin
require('keypress')(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

//main function
Main();
function Main(): void {
    //selection
    let selected:number = 0;
    let money:number = 20;
    let inventory:item[] = [];

    //register keybinds
    process.stdin.on('keypress', function(char:any, key:any): void {
        switch(key.name) {
            //down, up, left and right change the position of the current selection
            case "down":
                vendingMachine[selected].selected = false;
                if(selected + 4 < vendingMachine.length) {
                    selected += 4;
                }
                vendingMachine[selected].selected = true;
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
            case "up":
                vendingMachine[selected].selected = false;
                if(selected - 4 > -1) {
                    selected -= 4;
                }
                vendingMachine[selected].selected = true;
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
            case "left":
                vendingMachine[selected].selected = false;
                if(selected - 1 > -1) {
                    selected -= 1;
                }
                vendingMachine[selected].selected = true;
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
            case "right":
                vendingMachine[selected].selected = false;
                if(selected + 1 < vendingMachine.length) {
                    selected += 1;
                }
                vendingMachine[selected].selected = true;
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
            //ctrl + c exits the program
            case "c":
                if(key.ctrl) {
                    process.exit(0);
                }
            break;
            //as does escape
            case "escape":
                process.exit(0);
            break;
            //return buys the current item, and removes it from the vending machine.
            //if you do not have enough money to buy the item, the program gives you the option to "go into debt"
            //if you chose yes, your money amount goes negative
            //if not, the program exits.
            case "return":
                if(money - vendingMachine[selected].price < 0 && money > 0) {
                    console.clear();
                    rl.question("You cannot afford this purchace! Are you willing to go into debt? [y/n]: ", function(answer): void {
                        if(answer.toLocaleLowerCase() === "y") {
                            _buy();
                        } else {
                            process.exit(0);
                        }
                    })
                } else {
                    _buy();
                }

                function _buy() {
                    if(!vendingMachine[selected].bought) {
                        console.clear();
                        console.log(`You bought a ${vendingMachine[selected].itemName} for $${vendingMachine[selected].price}`);
                        money -= vendingMachine[selected].price;
                        vendingMachine[selected].bought = true;
                        inventory.push(vendingMachine[selected]);
                        setTimeout(function(){
                            renderVendingMachine(vendingMachine, vendingMachine[selected], money);
                        }, 1500);
                    }
                }
            break;
            //prints your current inventory
            case "i":
                console.clear();
                console.log("You currently have");
                let sumObject:any = {};

                for(let i = 0; i < inventory.length; i++) {
                    if(sumObject[inventory[i].itemName]) {
                        sumObject[inventory[i].itemName]++;
                    } else {
                        sumObject[inventory[i].itemName] = 1;
                    }
                }

                let keys = Object.keys(sumObject);
                for(let i = 0; i < keys.length; i++) {
                    console.log(`${sumObject[keys[i]]} ${keys[i]}`);
                }

                console.log("\nPress backspace to leave");
            break;
            case "backspace":
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
            //restocks the vending machine
            case "r":
                //reset all vending machine entries
                for(let i = 0; i < vendingMachine.length; i++) {
                    vendingMachine[i].bought = false;
                }
                renderVendingMachine(vendingMachine, vendingMachine[selected], money);
            break;
        }
    })

    //initialize vending machine with semi-random items
    let vendingMachine:item[] = [
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),        
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),        
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),
        new item("Twix", 2.5),
        new item("Twix", 2.5),
        new item("Twix", 2.5),
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),        
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),        
        new item("Cocacola", 10), 
        new item("Sprite", 5), 
        new item("Twix", 2.5),
        new item("Twix", 2.5),
        new item("Twix", 2.5),
        new item("Twix", 2.5),
    ];

    vendingMachine[selected].selected = true;
    renderVendingMachine(vendingMachine, vendingMachine[selected], money);
}

//renders the vending machine to the screen
function renderVendingMachine(vendingMachine:item[], itemForStats:item, money:number): void {
    console.clear();
    console.log("Move selection: arrow keys, buy: enter, View inventory: i, Refill: r, Exit: ctrl + c\n");
    let itemStatsLine:number = 0;
    let itemStats = [
        `Item: ${itemForStats.itemName}`,
        `Price: ${itemForStats.price}`,
        `You have: $${money}`
    ];

    process.stdout.write("|");
    for(let i = 0; i < vendingMachine.length; i++) {
        let thisItem:item = vendingMachine[i];
        let sorrounding:string[] = (thisItem.selected)? ["[", "]"] : [" ", " "];

        process.stdout.write(`${sorrounding[0]}${((!thisItem.bought)? "⬜" : "  ")}${sorrounding[1]}`);

        if((i+1) % 4 === 0 && i !== 0) {
            process.stdout.write("|");
            if(itemStats[itemStatsLine]) {
                process.stdout.write(`\t${itemStats[itemStatsLine]}`);
                itemStatsLine++;
            }
            process.stdout.write("\n|");
        }
    }
}
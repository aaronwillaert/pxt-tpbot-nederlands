/** Minimale localisatietest voor MakeCode */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot TEST"
namespace TPBot {
    export enum DriveDirection {
        //% block="Forward"
        Forward = 0,
        //% block="Backward"
        Backward = 1
    }

    //% block="Go %direc"
    //% weight=100
    export function testRijden(direc: DriveDirection): void { }

    //% block="Stop the car"
    //% weight=90
    export function testStop(): void { }

    //% block="Turn off the headlights"
    //% weight=80
    export function testKoplampen(): void { }
}

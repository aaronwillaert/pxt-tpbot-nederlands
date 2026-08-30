/**
 * Nederlandstalige TPBot-extensie voor micro:bit.
 * Gebaseerd op de officiële ELECFREAKS TPBot-extensie.
 */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot"
namespace TPBot {
    export enum DriveDirection {
        //% block="vooruit"
        Forward = 0,
        //% block="achteruit"
        Backward = 1,
        //% block="links"
        Left = 2,
        //% block="rechts"
        Right = 3
    }

    export enum TrackingState {
        //% block="● ●" enumval=0
        L_R_line,
        //% block="◌ ●" enumval=1
        L_unline_R_line,
        //% block="● ◌" enumval=2
        L_line_R_unline,
        //% block="◌ ◌" enumval=3
        L_R_unline
    }

    export enum SonarUnit {
        //% block="cm"
        Centimeters,
        //% block="inch"
        Inches
    }

    export enum Sonarjudge {
        //% block="<"
        Less,
        //% block=">"
        Greater
    }

    export enum ServoList {
        //% block="S1"
        S1 = 0,
        //% block="S2"
        S2 = 1,
        //% block="S3"
        S3 = 2,
        //% block="S4"
        S4 = 3
    }

    export enum LineState {
        //% block="zwart" enumval=0
        Black,
        //% block="wit" enumval=1
        White
    }

    export enum LineSide {
        //% block="links" enumval=0
        Left,
        //% block="rechts" enumval=1
        Right
    }

    export enum MbEvents {
        //% block="zwart"
        Black = DAL.MICROBIT_PIN_EVT_FALL,
        //% block="wit"
        White = DAL.MICROBIT_PIN_EVT_RISE
    }

    export enum MbPins {
        //% block="links"
        Left = DAL.MICROBIT_ID_IO_P13,
        //% block="rechts"
        Right = DAL.MICROBIT_ID_IO_P14
    }

    export enum MelodyCMDList {
        //% block="afspelen"
        Play = 0x03,
        //% block="stoppen"
        Stop = 0x16
    }

    export enum MelodyList {
        //% block="vrolijk"
        Happy = 0x01
    }

    export enum TPBotColorList {
        //% block="rood"
        red,
        //% block="groen"
        green,
        //% block="blauw"
        blue,
        //% block="cyaan"
        cyan,
        //% block="magenta"
        magenta,
        //% block="geel"
        yellow,
        //% block="wit"
        white
    }

    export enum ServoTypeList {
        //% block="180°"
        S180 = 0,
        //% block="360°"
        S360 = 1
    }

    /** Stel de snelheid van het linker- en rechterwiel in. */
    //% weight=99
    //% block="stel linkerwiel in op %lspeed\\% | rechterwiel op %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function setWheels(lspeed: number = 50, rspeed: number = 50): void {
        TPBotV1.setWheels(lspeed, rspeed);
        TPBotV2.motorControl(lspeed, rspeed);
    }

    /** Laat de TPBot gedurende een bepaalde tijd rijden. */
    //% weight=95
    //% block="rijd %direc met snelheid %speed\\% gedurende %time seconden"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelTime(direc: DriveDirection, speed: number, time: number): void {
        TPBotV1.setTravelTime(direc, speed, time);
        TPBotV2.setTravelTime(direc, speed, time);
        basic.pause(time * 1000);
        stopCar();
    }

    /** Laat de TPBot rijden met een bepaalde snelheid. */
    //% weight=90
    //% block="rijd %direc met snelheid %speed\\%"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelSpeed(direc: DriveDirection, speed: number): void {
        TPBotV1.setTravelSpeed(direc, speed);
        TPBotV2.setTravelSpeed(direc, speed);
    }

    /** Stop de TPBot onmiddellijk. */
    //% weight=80
    //% block="stop"
    export function stopCar(): void {
        TPBotV1.stopCar();
        TPBotV2.stopCar();
    }

    /** Controleer wat één lijnsensor ziet. */
    //% weight=70
    //% block="%side lijnsensor detecteert %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackSide(side: LineSide, State: LineState): boolean {
        return TPBotV2.trackSide(side, State);
    }

    /** Controleer de toestand van beide lijnsensoren. */
    //% weight=60
    //% block="lijnsensoren zijn %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackLine(state: TrackingState): boolean {
        return TPBotV2.trackLine(state);
    }

    /** Laat code uitvoeren wanneer een lijnsensor een bepaalde kleur detecteert. */
    //% block="wanneer %side lijnsensor %state detecteert"
    //% weight=50
    export function trackEvent(side: MbPins, state: MbEvents, handler: () => void): void {
        TPBotV2.trackEvent(side, state, handler);
    }

    /** Meet de afstand tot een voorwerp. */
    //% weight=40
    //% block="meet afstand in %unit"
    export function sonarReturn(unit: SonarUnit): number {
        return TPBotV2.sonarReturn(unit);
    }

    /** Controleer of een voorwerp dichterbij of verder weg is dan een bepaalde afstand. */
    //% weight=39
    //% block="is de afstand %judge %dis cm?"
    export function sonarJudge(judge: Sonarjudge, dis: number): boolean {
        return TPBotV2.sonarJudge(judge, dis);
    }

    /** Zet de koplampen uit. */
    //% weight=35
    //% block="zet koplampen uit"
    export function headlightClose(): void {
        TPBotV1.headlightClose();
        TPBotV2.headlightClose();
    }

    /** Geef de koplampen een kleur. */
    //% weight=34
    //% block="stel koplampkleur in op %color"
    export function headlightColor(color: TPBotColorList): void {
        TPBotV1.headlightColor(color);
        TPBotV2.headlightColor(color);
    }

    /** Stel een servo in op een hoek. */
    //% weight=30
    //% block="stel servo %servo in op %angle°"
    //% angle.min=0 angle.max=180
    export function setServo(servo: ServoList, angle: number): void {
        TPBotV1.setServo(servo, angle);
        TPBotV2.setServo(servo, angle);
    }
}

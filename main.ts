/**
 * De slimme programmeerauto TPBot, geproduceerd door ELECFREAKS Co.ltd
 */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot"
namespace TPBot {
    export enum DriveDirection {
        //% block="Vooruit"
        Forward = 0,
        //% block="Achteruit"
        Backward = 1,
        //% block="Links"
        Left = 2,
        //% block="Rechts"
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
        //% block="Zwart" enumval=0
        Black,
        //% block="Wit"enumval=1
        White
    }

    export enum LineSide {
        //% block="Links" enumval=0
        Left,
        //% block="Rechts" enumval=1
        Right
    }

    export enum MbEvents {
        //% block="Zwart"
        Black = DAL.MICROBIT_PIN_EVT_FALL,
        //% block="Wit"
        White = DAL.MICROBIT_PIN_EVT_RISE
    }

    export enum MbPins {
        //% block="Links"
        Left = DAL.MICROBIT_ID_IO_P13,
        //% block="Rechts"
        Right = DAL.MICROBIT_ID_IO_P14
    }

    export enum MelodyCMDList {
        //% block="Afspelen"
        Play = 0x03,
        //% block="Stoppen"
        Stop = 0x16
    }

    export enum MelodyList {
        //% block="Vrolijk"
        Happy = 0x01
    }

    /////////////////////////color/////////////////////////
    export enum TPBotColorList {
        //% block="Rood"
        red,
        //% block="Groen"
        green,
        //% block="Blauw"
        blue,
        //% block="Cyaan"
        cyan,
        //% block="Magenta"
        magenta,
        //% block="Geel"
        yellow,
        //% block="Wit"
        white
    }

    export enum ServoTypeList {
        //% block="180°"
        S180 = 0,
        //% block="360°"
        S360 = 1
    }

    export enum VersionList {
        //% block="TPBot"
        TPBot = 0,
        //% block="TPBot_Pro"
        TPBot_Pro = 1
    }

    const TPBotAdd = 0X10
    let Buff = pins.createBuffer(4);
    let _initEvents = true

    const TPbotColor_ADDR = 0x39
    const TPbotColor_ENABLE = 0x80
    const TPbotColor_ATIME = 0x81
    const TPbotColor_CONTROL = 0x8F
    const TPbotColor_STATUS = 0x93
    const TPbotColor_CDATAL = 0x94
    const TPbotColor_CDATAH = 0x95
    const TPbotColor_RDATAL = 0x96
    const TPbotColor_RDATAH = 0x97
    const TPbotColor_GDATAL = 0x98
    const TPbotColor_GDATAH = 0x99
    const TPbotColor_BDATAL = 0x9A
    const TPbotColor_BDATAH = 0x9B
    const TPbotColor_GCONF4 = 0xAB
    const TPbotColor_AICLEAR = 0xE7
    let TPbotColor_init = false

    let version = 2;

    /**
     * Stel de snelheid van het linker- en rechterwiel in.
     * @param lspeed Snelheid linkerwiel
     * @param rspeed Snelheid rechterwiel
     */
    //% weight=99
    //% block="Zet snelheid linkerwiel op %lspeed\\%| snelheid rechterwiel op %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function setWheels(lspeed: number = 50, rspeed: number = 50): void {
        TPBotV1.setWheels(lspeed, rspeed);
        TPBotV2.motorControl(lspeed, rspeed);
    }

    /**
     * Stel de rijrichting en rijtijd in.
     * @param direc Rijrichting
     * @param speed Rijsnelheid
     * @param time Rijtijd in seconden
     */
    //% weight=95
    //% block="Rijd %direc met snelheid %speed\\% gedurende %time seconden"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelTime(direc: DriveDirection, speed: number, time: number): void {
        TPBotV1.setTravelTime(direc, speed, time);
        TPBotV2.setTravelTime(direc, speed, time);
        basic.pause(time * 1000)
        stopCar()
    }

    /**
     * Stel de rijrichting en rijsnelheid in.
     * @param direc Rijrichting
     * @param speed Rijsnelheid
     */
    //% weight=90
    //% block="Rijd %direc met snelheid %speed\\%"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelSpeed(direc: DriveDirection, speed: number): void {
        TPBotV1.setTravelSpeed(direc, speed)
        TPBotV2.setTravelSpeed(direc, speed);
    }

    /**
     * Stop de auto.
     */
    //% weight=80
    //% block="Stop de auto onmiddellijk"
    export function stopCar(): void {
        TPBotV1.stopCar();
        TPBotV2.stopCar();
    }

    /**
     * Controleer één kant van de lijnsensor.
     * @param side Welke kant (links/rechts)
     * @param State Status van de lijnsensor
     */
    //% weight=70
    //% block="%side lijnsensor ziet %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackSide(side: LineSide, State: LineState): boolean {
        return TPBotV2.trackSide(side, State);
        //return TPBotV1.trackSide(side, State);
    }

    /**
     * Bepaal de huidige status van de lijnvolgmodule.
     * @param state Eén van de vier standen van de lijnsensor
     */
    //% weight=60
    //% block="Status van lijnsensor is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackLine(state: TrackingState): boolean {
        return TPBotV2.trackLine(state);
        //return TPBotV1.trackLine(state);
    }

    /**
     * Wordt uitgevoerd zodra de lijnsensor een lijn vindt of verliest.
     */
    //% weight=50
    //% block="Als %side| lijnsensor %state ziet"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function trackEvent(side: MbPins, state: MbEvents, handler: Action) {
        TPBotV1.trackEvent(side, state, handler);
        basic.pause(5);
        TPBotV2.trackEvent(side, state, handler);
        basic.pause(5);
    }

    /**
     * Meet de afstand met de ultrasone sensor (sonar), bijvoorbeeld om botsingen te voorkomen.
     * @param unit Eenheid voor de afstand (cm of inch)
     */
    //% weight=40
    //% block="Afstand sonar in %unit"
    //% unit.fieldEditor="gridpicker"
    //% unit.fieldOptions.columns=2
    export function sonarReturn(unit: SonarUnit, maxCmDistance = 500): number {
        return TPBotV2.sonarReturn(unit, maxCmDistance);
        //return TPBotV1.sonarReturn(unit, maxCmDistance);
    }

    /**
     * Vergelijk de sonarafstand met een ingestelde waarde.
     * @param judge Vergelijking (kleiner dan / groter dan)
     * @param dis Afstand in cm
     */
    //% weight=35
    //% block="Afstand sonar %judge %dis cm"
    //% dis.min=1 dis.max=400
    //% judge.fieldEditor="gridpicker" judge.fieldOptions.columns=2
    export function sonarJudge(judge: Sonarjudge, dis: number): boolean {
        return TPBotV2.sonarJudge(judge, dis);
        //return TPBotV1.sonarJudge(judge, dis);
    }

    /**
     * Kies een kleur voor de koplampen.
     */
    //% block="Zet kleur koplamp op $color"
    //% weight=30
    //% color.shadow="colorNumberPicker"
    export function headlightColor(color: number) {
        TPBotV1.headlightColor(color);
        TPBotV2.headlightColor(color);
    }

    /**
     * Stel de kleur van de koplampen in met RGB-waarden.
     * @param r Roodwaarde (0-255)
     * @param g Groenwaarde (0-255)
     * @param b Blauwwaarde (0-255)
     */
    //% weight=25
    //% inlineInputMode=inline
    //% block="Zet kleur koplamp op R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    export function headlightRGB(r: number, g: number, b: number): void {
        TPBotV1.headlightRGB(r, g, b);
        TPBotV2.headlightRGB(r, g, b);
    }

    /**
     * Zet de koplampen uit.
     */
    //% block="Zet koplampen uit"
    //% weight=20
    export function headlightClose(): void {
        TPBotV1.headlightClose();
        TPBotV2.headlightClose();
    }

    /**
     * Stel de snelheid van een 360°-servo in.
     * @param servo Welke servo (S1 t/m S4)
     * @param speed Snelheid van de servo
     */
    //% weight=14
    //% block="Zet snelheid van 360°-servo %servo op %speed \\%"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    //% speed.min=-100 speed.max=100
    export function setServo360(servo: ServoList, speed: number = 100): void {
        TPBotV1.setServo360(servo, speed);
        TPBotV2.setServo360(servo + 1, speed);
    }

    /**
     * Stel de hoek van een servo in.
     * @param servoType Type servo (180° of 360°)
     * @param servo Welke servo (S1 t/m S4)
     * @param angle Hoek van de servo
     */
    //% weight=15
    //% block="Zet hoek van %servoType-servo %servo op %angle °"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    export function setServo(servoType: ServoTypeList, servo: ServoList, angle: number = 0): void {
        TPBotV1.setServo(servoType, servo, angle);
        TPBotV2.setServo(servoType, servo + 1, angle);
    }

    /***********************************************************************************************
     * PID-besturing
     ***********************************************************************************************/
    export enum SpeedUnit {
        //%block="cm/s"
        Cm_s,
        //%block="inch/s"
        Inch_s
    }

    export enum Direction {
        //%block="Vooruit"
        Forward,
        //%block="Achteruit"
        Backward
    }

    export enum DistanceUnit {
        //%block="cm"
        Cm,
        //%block="inch"
        Inch
    }

    export enum Wheel {
        //%block="Linkerwiel"
        WheelLeft = 0,
        //%block="Rechterwiel"
        WheelRight = 1,
        //%block="Beide wielen"
        WheelALL = 2
    }

    export enum AngleUnits {
        //%block="Hoek"
        Angle,
        //%block="Cirkel"
        Circle
    }

    export enum TurnUnit {
        //%block="Links sturen"
        Leftsteering = 0,
        //%block="Rechts sturen"
        Rightsteering = 1,
        //%block="Ter plekke linksom draaien"
        Stay_Leftsteering = 2,
        //%block="Ter plekke rechtsom draaien"
        Stay_Rightsteering = 3
    }

    export enum TurnAngleUnit {
        //% block="45°"
        T45 = 45,
        //% block="90°"
        T90 = 90,
        //% block="135°"
        T135 = 135,
        //% block="180°"
        T180 = 180
    }

    //
    /**
     * Laat de auto rijden met een specifieke snelheid (min. 20 cm/s, max. 50 cm/s).
     * @param lspeed Snelheid linkerwiel
     * @param rspeed Snelheid rechterwiel
     * @param unit Eenheid van de snelheid
     */
    //% subcategory="PID"
    //% block="zet snelheid linkerwiel %lspeed, snelheid rechterwiel %rspeed %unit"
    //% weight=210
    export function pidSpeedControl(lspeed: number, rspeed: number, unit: SpeedUnit): void {
        TPBotV2.pidSpeedControl(lspeed, rspeed, unit);
    }

    /**
     * Laat de auto een specifieke afstand rijden (0 tot 6000 cm).
     * @param direction Rijrichting
     * @param distance Afstand
     * @param unit Eenheid van de afstand
     */
    //% subcategory="PID"
    //% weight=200
    //% block="rijd %Direction %distance %DistanceUnit"
    export function pidRunDistance(direction: Direction, distance: number, unit: DistanceUnit): void {
        TPBotV2.pidRunDistance(direction, distance, unit);
    }

    /**
     * Stel de lengte van één vakje in.
     * @param length Lengte van een vakje
     * @param distanceUnit Eenheid van de lengte
     */
    //% subcategory="PID"
    //% weight=180
    //% block="zet lengte van de vakjes op %length %DistanceUnit"
    export function pidBlockSet(length: number, distanceUnit: DistanceUnit): void {
        TPBotV2.pidBlockSet(length, distanceUnit);
    }

    /**
     * Laat de auto een bepaald aantal vakjes vooruit rijden.
     * @param cnt Aantal vakjes
     */
    //% subcategory="PID"
    //% weight=170
    //% block="rijd %cnt vakjes vooruit"
    export function pidRunBlock(cnt: number): void {
        TPBotV2.pidRunBlock(cnt);
    }

    /**
     * Laat de auto draaien over een bepaalde hoek.
     * @param turn Manier van draaien
     * @param angle Hoek in graden
     */
    //% subcategory="PID"
    //% weight=190
    //% block="zet auto %TurnUnit voor hoek %angle"
    //% angle.min=0 angle.max=360
    export function pidRunSteering(turn: TurnUnit, angle: number): void {
        TPBotV2.pidRunSteering(turn, angle);
    }

    /**
     * Stel de snelheid van de PID-besturing in (20 tot 50 cm/s).
     * @param speed Snelheid, bijvoorbeeld 25
     * @param unit Eenheid van de snelheid
     */
    //% subcategory="PID"
    //% weight=215
    //% block="zet de snelheid van de pid-besturing op %speed %unit"
    export function pidSetSpeed(speed: number , unit: SpeedUnit): void {
        TPBotV2.pidSetSpeed(speed,unit);
    }

    export function readPidStopFlag(): number {
        return TPBotV2.readPidStopFlag();
    }

    //% subcategory="PID"
    //% weight=10
    //% block="Pas motorsnelheid aan"
    export function adjustMotorSpeed(): void {
        TPBotV2.adjustMotorSpeed();
    }

    //% subcategory="PID"
    //% weight=9
    //% block="Herstel motoraanpassing"
    export function resetMotorAdjust(): void {
        TPBotV2.resetMotorAdjust();
    }
}

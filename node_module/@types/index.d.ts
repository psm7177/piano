interface Midi{
    header: {
        format: number;
        numTracks: number;
        framesPerSecond?: number;
        ticksPerFrame?: number ;
        ticksPerBeat?: number;
    };
    tracks: {
        deltaTime: number;
        type: string;
        meta?: boolean;
        number?: number;
        text?: string;
        channel?: number;
        port?: number;
        microsecondsPerBeat?: number;
        frameRate?: number;
        hour?: number;
        min?: number;
        sec?: number;
        frame?: number;
        subFrame?: number;
        numerator?: number;
        denominator?: number;
        metronome?: number;
        thirtyseconds?: number;
        key?: number;
        scale?: number;
        data?: number[];
        metatypeByte?: number;
        running?: boolean;
        noteNumber?: number;
        velocity?: number;
        amount?: number;
        controllerType?: number;
        value?:number;s
        programNumber?: number;
    }[][]
};
declare module 'midi-file'{ 
    export default Midi;
}
export function parseMidi(data: Buffer): Midi;

import React, { useEffect, useImperativeHandle ,useRef, useState} from 'react';
import {Midi} from 'midi-file';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { defaultMaxListeners } from 'events';
import { isBreakOrContinueStatement } from 'typescript';

export interface PianoProps{
    midi: Midi | undefined;
    width: number;
    height: number;
}

interface NoteEvent{
  time:number;
  noteNumber: number;
  key: boolean;
};

export interface DrawPiano{
  track: Array<Array<NoteEvent>>;
  keyDown: number[];
  startTime: number;
  point: number[];
  drawingNote: (context: CanvasRenderingContext2D, now: number)=>void;
  drawingPiano: ()=>void;
  drawingWhiteKey: (context: CanvasRenderingContext2D)=>void;
  drawingWhiteKeyDown: (context: CanvasRenderingContext2D)=>void;
  drawingBlackKey: (context: CanvasRenderingContext2D)=>void;
  drawingBlackKeyDown: (context: CanvasRenderingContext2D)=>void;
};

const Piano: React.FC<PianoProps> = ({midi, width,height}:PianoProps) => {

  const canvasRef:React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [drawHandle,setHandle] = useState<NodeJS.Timeout>();

  const piano:DrawPiano = {
    track: [],
    keyDown:[],
    startTime: 0,
    point: [],
    drawingNote: function(context : CanvasRenderingContext2D, now: number){
      context.fillStyle = "#e9642a";
      for(let i = 0; i < this.track.length; i++){
        for(let j = 0; j < this.track[i].length; j++){
          const {noteNumber, key,time}=  this.track[i][j];
            if(key){
              for(let k = j; k < this.track[i].length; k++){
                if(!this.track[i][k].key && noteNumber == this.track[i][k].noteNumber){
                  if( now > this.startTime + this.track[i][k].time){break;}
                  const heldTime = this.track[i][k].time - this.track[i][j].time;
                  const y:number = now - this.startTime - time - heldTime + 760;
                  const octave = Math.floor(noteNumber / 12);
                  const code = noteNumber % 12;
                  let w:number = 0;
                  let x:number = 0;
                  switch(code){
                    case 0:
                      w = 20;
                      x = 5 + (octave-1) * 140 -100;
                      break;
                    case 2:
                      w = 20;
                      x = 5 + (octave-1) * 140 -80;
                      break;
                    case 4:
                      w = 20;
                      x = 5 + (octave-1) * 140 -60;
                      break;
                    case 5:
                      w = 20;
                      x = 5 + (octave-1) * 140 -40;
                      break;
                    case 7:
                      w = 20;
                      x = 5 + (octave-1) * 140 -20;
                      break;
                    case 9:
                      w = 20;
                      x = 5 + (octave-1) * 140;
                      break;
                    case 11:              
                      w = 20;
                      x = 5 + (octave-1) * 140+20;
                      break;
                    case 1:
                      w = 15;
                      x = 17 + (octave-1) * 140 -100;
                      break;
                    case 3:
                      w = 15;
                      x = 17 + (octave-1) * 140 -80;
                      break;
                    case 6:
                      w = 15;
                      x = 17 + (octave-1) * 140 -40;
                      break;
                    case 8:
                      w = 15;
                      x = 17 + (octave-1) * 140 -20;
                      break;
                    case 10:
                      w = 15;
                      x = 17 + (octave-1) * 140;
                      break;
                  }
                  context.fillRect(x,y,w,heldTime);
                  break;
                }
              }
            }
        }
      }
    },
    drawingPiano: function (){
      if(!canvasRef.current){return;}
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext('2d');
      if(context){
        context.clearRect(0,0,900,900);

        const now = Date.now();
        for(let i = 0; i < this.track.length; i++){
          let point = this.point[i];
          if(point >= this.track[i].length){continue;}
          while(this.startTime + this.track[i][point].time <= now){
            const {key, noteNumber} = this.track[i][point];
            if(key){
              if(this.keyDown.indexOf(noteNumber)==-1){
                this.keyDown.push(noteNumber);
              }
            } else {
              if(this.keyDown.indexOf(noteNumber)!=-1){
                this.keyDown.splice(this.keyDown.indexOf(noteNumber),1);
              }
            }
            point++;
            if(point >= this.track[i].length){break;}
          }
          this.point[i] = point;
        }
        this.drawingNote(context, now);

        this.drawingWhiteKeyDown(context);
        this.drawingWhiteKey(context);
        this.drawingBlackKey(context);
        this.drawingBlackKeyDown(context);
      }
    },
    drawingWhiteKey: function (context: CanvasRenderingContext2D){
      context.strokeStyle = '#000';
      context.lineWidth = 3;
      for(let i = 0; i < 59  ; i++){
        context.strokeRect(5 + i * 20,760,20,70);
      }
    },
    drawingWhiteKeyDown: function (context: CanvasRenderingContext2D){
      context.fillStyle = "#F00";
      for(let i = 0; i < this.keyDown.length; i++){
        const noteNumber = this.keyDown[i];
        if(noteNumber >= 21 && noteNumber <= 108){
          const octave = Math.floor(noteNumber / 12);
          const code = noteNumber % 12;
          switch(code){
            case 0:
              context.fillRect(5 + (octave-1) * 140 -100,760,20,70);
              break;
            case 2:
              context.fillRect(5 + (octave-1) * 140 -80,760,20,70);
              break;
            case 4:
              context.fillRect(5 + (octave-1) * 140 -60,760,20,70);
              break;
            case 5:
              context.fillRect(5 + (octave-1) * 140 -40,760,20,70);
              break;
            case 7:
              context.fillRect(5 + (octave-1) * 140 -20,760,20,70);
              break;
            case 9:
              context.fillRect(5 + (octave-1) * 140,760,20,70);
              break;
            case 11:              
            context.fillRect(5 + (octave-1) * 140 + 20,760,20,70);
            break;
          }
        }
      }
    },
    drawingBlackKey: function (context: CanvasRenderingContext2D){
      context.fillStyle = "#000";
      context.fillRect(17, 760,15,35);
        for(let i = 0; i < 8; i++){
          context.fillRect(17 + 40 + 140 * i, 760,15,35);
          context.fillRect(17 + 60 + 140 * i, 760,15,35);
          context.fillRect(17 + 100 + 140 * i, 760,15,35);
          context.fillRect(17 + 120 + 140 * i, 760,15,35);
          context.fillRect(17 + 140 + 140 * i, 760,15,35);
        }
    },
    drawingBlackKeyDown: function (context: CanvasRenderingContext2D){
      context.fillStyle = "#F00";
      for(let i = 0; i < this.keyDown.length; i++){
        const noteNumber = this.keyDown[i];
        if(noteNumber >= 21 && noteNumber <= 108){
          const octave = Math.floor(noteNumber / 12);
          const code = noteNumber % 12;
          switch(code){
            case 1:
              context.fillRect(17 + (octave-1) * 140 -100,760,15,35);
              break;
            case 3:
              context.fillRect(17 + (octave-1) * 140 -80,760,15,35);
              break;
            case 6:
              context.fillRect(17 + (octave-1) * 140 -40,760,15,35);
              break;
            case 8:
              context.fillRect(17 + (octave-1) * 140 -20,760,15,35);
              break;
            case 10:
              context.fillRect(17 + (octave-1) * 140 ,760,15,35);
              break
          }
        }
      }
    },
  };

  useEffect(()=>{
    if(midi){
      const {format, numTracks} = midi.header;
      switch(format){
        case 1:
          piano.point = new Array(numTracks);
          for(let i = 0; i < numTracks; i++){
            piano.point[i] = 0;
          }
      }
      for(let i = 0; i < midi.tracks.length; i++){
        let time: number = 0;
        let arr:Array<NoteEvent> = Array<NoteEvent>();
        for(let j = 0; j < midi.tracks[i].length; j++){
          time += midi.tracks[i][j].deltaTime;
          if(midi.tracks[i][j].type == "noteOn" ){
              arr.push({
                time:time,
                noteNumber: Number(midi.tracks[i][j].noteNumber),
                key: true
              });
          } else if(midi.tracks[i][j].type == "noteOff") {
            arr.push({
              time:time,
              noteNumber: Number(midi.tracks[i][j].noteNumber),
              key: false
            });
          }
        }
        piano.track.push(arr);
      }
      
      piano.startTime = Date.now();
      if(drawHandle){
        clearInterval(drawHandle);
      }
    
      setHandle(setInterval(()=>{
        piano.drawingPiano();
      },20));
    }
  },[midi]);

  return (
    <canvas ref={canvasRef} width={width} height={height}>
    </canvas>
  );
}

export default Piano;
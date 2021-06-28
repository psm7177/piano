import React, { useEffect, useState,useRef } from 'react';
import {parseMidi,Midi} from 'midi-file';
import Piano,{PianoProps} from './components/piano';

const App: React.FC = () => {
  
  const midiFileRef:React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);

  const [midi,setMidi] = useState<Midi>();

  const convertfromArrayBuffertoBuffer = (arrBuf: ArrayBuffer):Buffer =>{
    const buffer:Buffer = Buffer.from(arrBuf);
    let view:Uint8Array = new Uint8Array(arrBuf);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }

  const play:React.MouseEventHandler<HTMLButtonElement> = ()=>{
    if(midiFileRef.current?.files?.length){
      const midiFile:File = midiFileRef.current?.files[0];

      
      midiFile.arrayBuffer().then(arrBuf => {
        const buffer:Buffer = convertfromArrayBuffertoBuffer(arrBuf);
        const parsedData:Midi = parseMidi(buffer);
        setMidi(parsedData);
      }).catch(e=>{
        console.error(e);
      })
    } else{
      alert("upload file");
    }
  }

  return (
    <div className="App">
      <input type="file" accept=".mid" ref={midiFileRef}/>
      <button onClick={play}>play</button> 
      <Piano midi={midi} width={1800} height={900}></Piano>
    </div>
  );
}

export default App;
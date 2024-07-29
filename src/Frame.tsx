import { useEffect, useState } from "react";
import '../src/styles.scss'
type player=1|2
const Frame = () => {
    const [player,setplayer]=useState<player>(1);
    const [size,setsize]=useState(3);
    const [target,settarget]=useState(3);
    const [result,setresult]=useState<number[][]>(Array.from({ length: size }, () => Array(size).fill(0)));
    const [winner, setWinner] = useState<number | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [gameLocked, setGameLocked] = useState(false);
    const cellSize = 40 / size;
    const final = (won: number) => {
        setWinner(won);
        setShowOverlay(true);
        setGameLocked(true);
        setTimeout(()=>{
            setresult(Array.from({ length: size }, () => Array(size).fill(0)));
        },1500)
        setTimeout(() => {
            setShowOverlay(false);
            setWinner(null);
            setGameLocked(false);
        }, 2000); 
    }
    const checkconsecutive=()=>{
            const hasThreeConsecutive = (arr:number[]) => {
                let count = 1;
                for (let i = 1; i < arr.length; i++) {
                    if (arr[i] === arr[i - 1] && arr[i] !== 0) {
                        count++;
                        if (count === target) return arr[i];
                    } else {
                        count = 1;
                    }
                }
                return 0;
            };
            for (let i = 0; i < result.length; i++) {
                const rowResult = hasThreeConsecutive(result[i]);
                if (rowResult)return rowResult;
            }
            
            for (let j = 0; j < result.length; j++) {
                const column = result.map(row => row[j]);
                const colResult = hasThreeConsecutive(column);
                if (colResult) return colResult;
            }
            for (let i = 0; i <= result.length - target; i++) {
                for (let j = 0; j <= result.length - target; j++) {
                    const diagonal = [];
                    for (let k = 0; k < target; k++) {
                        diagonal.push(result[i + k][j + k]);
                    }
                    const diagResult = hasThreeConsecutive(diagonal);
                    if (diagResult) return diagResult;
                }
            }
            for (let i = 0; i <= result.length - target; i++) {
                for (let j = target - 1; j < result.length; j++) {
                    const diagonal = [];
                    for (let k = 0; k < target; k++) {
                        diagonal.push(result[i + k][j - k]);
                    }
                    const diagResult = hasThreeConsecutive(diagonal);
                    if (diagResult) return diagResult;
                }
            }
            return 0;
    }
    const anyoneWon = () => {
        const winner = checkconsecutive();
        if (winner) {
            final(winner);
        } else if (!result.flat().includes(0)) {
            setWinner(0); 
            setGameLocked(true);
            setTimeout(()=>{
                setresult(Array.from({ length: size }, () => Array(size).fill(0)));
            },1500)
            setShowOverlay(true);
            setTimeout(() => {
                setGameLocked(false);
                setShowOverlay(false);
            }, 2000);
        }
    }
    const handleClick=(rowindex:number,colindex:number)=>{
        if (gameLocked ||result[rowindex][colindex] !== 0) return;
        if(player===1)
        {
            setplayer(2);
            const newresult=result;
            newresult[rowindex][colindex]=1;
            setresult(newresult);
        }
        if(player===2)
            {
                setplayer(1);
                const newresult=result;
                newresult[rowindex][colindex]=2;
                setresult(newresult);
            }
            anyoneWon();
    }

    const handlesize=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setsize(e.target.valueAsNumber);
        if(e.target.valueAsNumber<target)
            settarget(e.target.valueAsNumber)
    }
    useEffect(() => {
        setresult(Array.from({ length: size }, () => Array(size).fill(0)));
    }, [size,target]);
     const gridTemplateColumns = `repeat(${size}, auto)`
    const handletarget=(event: React.ChangeEvent<HTMLInputElement>)=>{
        settarget(event.target.valueAsNumber);
    }
    const handleReset=()=>{
        if(gameLocked)return
        setresult(Array.from({ length: size }, () => Array(size).fill(0)));
    }
  return (<div className="maindiv">
    <div className="sidebar">
    
    <div className="slider">
    Size
    <div><input type="range" 
    min="3"
    max="7"
    onChange={handlesize}
    value={size}
    style={{width:"80%",marginLeft:"5%"}}
    />
    <span style={{ marginLeft: '10px' }}>{size}</span></div>
    </div>
    
    <div className="slider">
    Target
    <div>
    <input type="range" 
    min="3"
    max={size}
    onChange={handletarget}
    value={target}
    style={{width:"80%",marginLeft:"5%"}}
    />
    <span style={{ marginLeft: '10px' }}>{target}</span>
    </div>
    </div>
    <button onClick={handleReset} type="button" className="btn btn--green">
	<span className="btn__txt">Reset</span>
	<i className="btn__bg" aria-hidden="true"></i>
	<i className="btn__bg" aria-hidden="true"></i>
	<i className="btn__bg" aria-hidden="true"></i>
	<i className="btn__bg" aria-hidden="true"></i>
     </button>
    </div>
    
    {showOverlay && (
                <div
                    className={`overlay animate-overlay`}
                    style={{ 
                        '--winner-color': winner === 1 ? '#059212' : winner === 2 ? '#FF204E' : '#808080' 
                    } as React.CSSProperties}
                />
            )}
    <div style={{gridTemplateColumns:gridTemplateColumns}} className='frame'>
        {result.map((row,rowindex)=>
            (row.map((item,colindex)=>
            (<div  key={`${rowindex}-${colindex}`} style={{width: `${cellSize}svw`,
                height: `${cellSize}svw`,borderRadius:`${cellSize}svw`,
                backgroundColor: item === 0 ? 'white' : item === 1 ? '#06D001' : '#FF204E'}} onClick={()=>handleClick(rowindex,colindex)} className="boxes">
            {item===0?<></>:item===1?<img src="circle.svg" alt="circle"/>:<img src="cross.svg" alt="cross"/>}
        </div>))))}
    </div>
    </div>
  )
}

export default Frame
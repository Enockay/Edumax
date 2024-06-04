import React, { useState } from 'react';
import axios from 'axios';
import "../css/promoteStudent.css";

const PromotionForm = () => {
    const [currentStream, setCurrentStream] = useState('');
    const [nextStream, setNextStream] = useState('');
    const [graduatingStream, setGraduatingStream] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [message, setMessage] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [graduating , setGraduating] = useState(false);
    const [error, setError] = useState('');

    const handlePromotion = async () => {
       
        try {
            setLoading(true);
            const response = await axios.post('https://edumax.fly.dev/students/api/promotion/promote', {
                currentStream,
                nextStream
            });
            setMessage(response.data.message);
            setLoading(false);
        } catch (error) {
            setMessage('Error promoting students');
            setLoading(false);
        }
    };

    const handleGraduation = async () => {
        if(!graduatingStream || graduationYear){
            setError("all Fields Must Be Field");
            return;
        }
        try {
            setGraduating(true)
            const response = await axios.post('https://edumax.fly.dev/students/api/promotion/graduate', {
                graduatingStream,
                year: graduationYear
            });
            setMessage(response.data.message);
            setGraduating(false)
        } catch (error) {
            setMessage('Error graduating students');
           setGraduating(false)
        }
    };

    const handleConfirmPromotion = () => {
        if(!currentStream || !nextStream){
            setError("All fields must be field");
            return;
        }
        setConfirmation(`Are you sure you want to promote all students from ${currentStream} to ${nextStream}?`);
    };

    return (
        <>
        <div className='promotion-container'>
            <div className='alert'>
                <p>--This part of the system is very crucial and sensitive. Always be keen while dealing with it.
                    It can cause entire student data loss or even system crashes due to inconsistency. Make sure you carry out transitional processes carefully.
                </p>
                <hr></hr>
            </div>
            <div className='inform'>
                <h5 style={{margin:0,textDecoration:"underline"}}>USE CASE</h5>
                <ol>
                    <li>Fast Graduate Last Stream</li>
                    <p style={{margin:0,fontStyle:"italic",fontSize:"0.65rem"}}>This will help create space for other students </p>
                    <li>Follow The Process Downward Till Last stream is empty </li>
                    <li>Can Now Admit New Form Ones To the System</li>
                    <center> <p style={{margin:0,fontStyle:"italic",fontSize:"0.8rem"}}>N/BYou supposed to transition One stream at a Time</p></center> 
                </ol>
                <hr></hr>
            </div>
            <div className='promotion-form'>
                <div className='promotion-section'>
                    <h3 className="form-title">Promote Students</h3>  
                    <label>
                        Current Stream:
                        <select value={currentStream} onChange={(e) => setCurrentStream(e.target.value)} className='inputs'>
                            <option value="">Select</option>
                            <option value="1East">1 East</option>
                            <option value="1West">1 West</option>
                            <option value="2East">2 East</option>
                            <option value="2West">2 West</option>
                            <option value="3East">3 East</option>
                            <option value="3West">3 West</option>
                            <option value="4East">4 East</option>
                            <option value="4West">4 West</option>
                        </select>
                    </label>
                    <label>
                        Next Stream:
                        <select value={nextStream} onChange={(e) => setNextStream(e.target.value)} className='inputs'>
                            <option value="">Select</option>
                            <option value="2East">2 East</option>
                            <option value="2West">2 West</option>
                            <option value="3East">3 East</option>
                            <option value="3West">3 West</option>
                            <option value="4East">4 East</option>
                            <option value="4West">4 West</option>
                        </select>
                    </label>
                    <center>
                        <button onClick={handleConfirmPromotion} className='button-confirm'>Confirm Promotion</button>
                        {confirmation && (
                            <div className='confirmation'>
                                <p>{confirmation}</p>
                                {loading ? <div className='spinner'></div> : <button onClick={handlePromotion} className='button-graduate'>Promote Students</button>}
                            </div>
                        )}
                    </center>
                </div>
                <div className='promotion-section'>
                    <h3 className="form-title">Graduate Stream</h3>  
                    <label>
                        Graduating Stream:
                        <select value={graduatingStream} onChange={(e) => setGraduatingStream(e.target.value)} className='inputs'>
                            <option value="">Select</option>
                            <option value="4East">4 East</option>
                            <option value="4West">4 West</option>
                        </select>
                    </label>
                    <label>
                        Graduation Year:
                        <input type="Number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} id="inputs"className='inputs' />
                    </label>
                    <center>
                        {graduating? <div className='spinner'></div> : <button onClick={handleGraduation} className='button-graduate'>Graduate Stream</button>}
                    </center>
                </div>  
            </div>
           
        </div>
        {error &&<center><div className='error'>{error}</div> </center>  }  
        {message && <p className='message'>{message}</p>}
        </>  
    );
};

export default PromotionForm;

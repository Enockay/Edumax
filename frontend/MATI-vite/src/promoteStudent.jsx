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

    const handlePromotion = async () => {
        try {
            const response = await axios.post('https://edumax.fly.dev/api/promotion/promote', {
                currentStream,
                nextStream
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error promoting students');
        }
    };

    const handleGraduation = async () => {
        try {
            const response = await axios.post('https://edumax.fly.dev/api/promotion/graduate', {
                graduatingStream,
                year: graduationYear
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error graduating students');
        }
    };

    const handleConfirmPromotion = () => {
        setConfirmation(`Are you sure you want to promote all students from ${currentStream} to ${nextStream}?`);
    };

    return (
        <div className='promotion-container'>
            <div className='alert'>
                <p>--This part of the system is very crucial and sensitive.Always be keen while dealing with it.
                    It can cause entire student data loss or even system crashes due to inconsistency. Make sure you carry out transitional proccess carefully.
                </p>
                <hr></hr>
                </div>
                <div className='inform'>
                <h5 style={{margin:0,textDecoration:"underline"}}>USE CASE</h5>
                <ol>
                    <li>Fast Graduate Last Stream</li>
                    <p style={{margin:0,fontStyle:"italic",fontSize:"0.7rem"}}>This will help create space for other students </p>
                    <li>Follow The Process Downward Till Last stream is empty </li>
                    <li>Can Now Admit New Form Ones To the System</li>
                  <center> <p style={{margin:0,fontStyle:"italic",fontSize:"0.8rem"}}>N/BYou supposed to transition One stream at a Time</p></center> 
                </ol>
                <hr></hr>
            </div>
            <div className='promotion-form'>
                <div>
                    <center><p className="form-title">Promote Students</p></center>  
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
                                <button onClick={handlePromotion} className='button-graduate'>Promote Students</button>
                            </div>
                        )}
                    </center>
                </div>
                <div>
                    <center><p className="form-title">Graduate Stream</p></center>  
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
                        <button onClick={handleGraduation} className='button-graduate'>Graduate Stream</button>
                    </center>
                </div>  
            </div>
            {message && <p className='message'>{message}</p>}
        </div>
    );
};

export default PromotionForm;

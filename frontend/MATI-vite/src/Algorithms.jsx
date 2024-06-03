import React from 'react';
import '../css/Algorithms.css';

const GradeAlgorithm = () => {
    return (
        <div className='algorithm-container'>
          <center><h4>Algorithms for Computing Student Grades </h4></center>  
            <div className='algorithm-section'>
                <h3>Introduction</h3>
                <p>This section describes the algorithm used to compute student grades and points for science subjects. The algorithm considers different streams and subjects, calculates total marks, assigns grades and points, and selects the best subjects based on specific rules.</p>
            </div>
            <div className='algorithm-section'>
                <h3>Step 1: Calculating Marks and Points</h3>
                <p>The marks for each unit are calculated based on the stream and subject:</p>
                <h4>For Upper Classes (Form 3 and Form 4)</h4>
                <ul>
                    <li>For <strong>sciences (Chemistry, Biology, Physics)</strong>, the total marks are calculated by the formula: <code>(P1 + P2) / 160 * 60 + P3</code>.</li>
                    <li>For <strong>Math</strong>, the total marks are calculated by averaging P1 and P2 marks: <code>(P1 + P2) / 2</code>.</li>
                    <li>For <strong>English and Kiswahili</strong>, the total marks are calculated by summing up P1, P2, and P3 marks: <code>P1 + P2 + P3</code>.</li>
                    <li>For <strong>other subjects</strong> (e.g., Agriculture, Business, History, CRE, Geography), the total marks are calculated by averaging P1 and P2 marks: <code>(P1 + P2) / 2</code>.</li>
                </ul>
                <h4>For Lower Classes (Form 1 and Form 2)</h4>
                <ul>
                    <li>The total marks for all subjects are calculated from P1 marks: <code>P1</code>.</li>
                </ul>
                <p>The points and grades are assigned based on the total marks:</p>
                <table className='grade-table'>
                    <thead>
                        <tr>
                            <th>Total Marks</th>
                            <th>Points</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>75+</td><td>12</td><td>A</td></tr>
                        <tr><td>70-74</td><td>11</td><td>A-</td></tr>
                        <tr><td>66-69</td><td>10</td><td>B+</td></tr>
                        <tr><td>60-65</td><td>9</td><td>B</td></tr>
                        <tr><td>53-59</td><td>8</td><td>B-</td></tr>
                        <tr><td>46-52</td><td>7</td><td>C+</td></tr>
                        <tr><td>40-45</td><td>6</td><td>C</td></tr>
                        <tr><td>35-39</td><td>5</td><td>C-</td></tr>
                        <tr><td>30-34</td><td>4</td><td>D+</td></tr>
                        <tr><td>25-29</td><td>3</td><td>D</td></tr>
                        <tr><td>20-24</td><td>2</td><td>D-</td></tr>
                        <tr><td>0-19</td><td>1</td><td>E</td></tr>
                    </tbody>
                </table>
            </div>
            <div className='algorithm-section'>
                <h3>Step 2: Selecting Best Subjects</h3>
                <p>The algorithm selects the best 7 subjects based on specific rules:</p>
                <ul>
                    <li><strong>Rule 1 (3-3-1-0):</strong> 3 languages, 3 sciences, and 1 humanity.</li>
                    <li><strong>Rule 2 (3-2-1-1):</strong> 3 languages, 2 sciences, 1 humanity, and 1 technical.</li>
                    <li><strong>Rule 3 (3-2-2-0):</strong> 3 languages, 2 sciences, and 2 humanities.</li>
                </ul>
                <p>If no rule matches, the algorithm selects the top 7 subjects based on points, regardless of type.</p>
            </div>
            <div className='algorithm-section'>
                <h3>Step 3: Calculating Total Points and Grade</h3>
                <p>The total points are calculated by summing up the points of the selected units. The overall grade is determined based on the total points.</p>
            </div>
        </div>
    );
};

export default GradeAlgorithm;

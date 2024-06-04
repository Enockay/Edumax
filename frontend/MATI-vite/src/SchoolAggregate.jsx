import React, { useEffect, useState } from 'react';
import "../css/App.css";
import { ClipLoader } from 'react-spinners'; // Import the spinner component

const SchoolAggregate = () => {
    const [data, setData] = useState({
        totalMales: 0,
        totalFemales: 0,
        totalStudents: 0,
        forms: {
            form4: { easts: 0, wests: 0 },
            form3: { easts: 0, wests: 0 },
            form2: { easts: 0, wests: 0 },
            form1: { easts: 0, wests: 0 }
        },
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const [empty, setEmpty] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch('https://edumax.fly.dev/api/aggregate');
                const data = await response.json();
                    setData(data);
                    setEmpty('');
            } catch (error) {
                setEmpty("Error occurred while aggregating students");
                console.log(error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchItem();
    }, []);

    return (
        <div className="aggregate-container">
            <center><h2 className="h2">The School Aggregate</h2></center>
            {loading ? (
                <center>
                    <ClipLoader color={"#123abc"} loading={loading} size={50} />
                    <p>Aggregating students...</p>
                </center>
            ) : (
                <div className="aggregate-details">
                    <div className="aggregate-gender">
                        <h3>Total Males: {''}</h3>
                        <h3>Total Females: {''}</h3>
                    </div>
                    <h3>Total Students: {data.totalStudents}</h3>
                    <div className="more-d">More On Wide Screen</div>
                    <div className="form-d">
                        {Object.keys(data.forms).map(form => (
                            <div key={form} className="form">
                                <h4>{form.toUpperCase()}</h4>
                                <p>East: {data.forms[form].easts}</p>
                                <p>West: {data.forms[form].wests}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <center><p style={{ color: "green", }}>{empty}</p></center>
        </div>
    );
};

export default SchoolAggregate;

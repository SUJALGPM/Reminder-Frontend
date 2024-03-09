import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from 'moment';
import { message } from "antd";



const Home = () => {

    //Configure all state....
    const [reminderMsg, setReminderMsg] = useState("");
    const [remindAt, setRemindAt] = useState("");
    const [time, setTime] = useState("");
    const [reminderList, setReminderList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    // Fetch remainderList Response....
    useEffect(() => {
        const fetchReminderList = async () => {
            try {
                const response = await axios.get("http://192.168.1.8:7300/api/remind/get-all-reminder");
                console.log("Respoonse data :", response);
                setReminderList(response.data);
            } catch (error) {
                console.error("Error fetching reminders:", error);
            }
        };

        fetchReminderList();
        console.log(reminderList)
    }, [refresh]);

    // Add New Remainder...
    const addReminder = async () => {
        console.log("msg :", reminderMsg);
        console.log("Date :", remindAt);
        console.log("Time :", time);

        // Make sure both date and time are provided
        if (!reminderMsg || !remindAt || !time) {
            message.error("Please provide reminder message, date, and time");
            return;
        }

        // Combine date and time into a single DateTime string
        const combinedDateTime = moment(remindAt + ' ' + time, 'YYYY-MM-DD HH:mm').toISOString();
        console.log("Post Payload : ", combinedDateTime);

        //Send the data to backend....
        const response = await axios.post("http://192.168.1.8:7300/api/remind/add-new-reminder", {
            reminderMsg: reminderMsg,
            reminderAt: combinedDateTime
        });

        //Check data send or not...
        if (response) {
            message.success("New Reminder add successfully...");
            setRefresh(refresh + 1);
        } else {
            message.error("Failed to add new reminder..!!!");
        }

        // Reset input fields
        setReminderMsg("");
        setRemindAt("");
        setTime("");
    };

    //Update the Reminder...
    const updateReminder = async (id) => {
        try {
            const response = await axios.put("http://192.168.1.8:7300/api/remind/delete-reminder", {
                remindId: id,
                reminderMsg,
                reminderAt
            })
        } catch (err) {
            console.log(err);
        }
    }
    // Delete Remainder...
    const deleteReminder = async (id) => {
        const response = await axios.post("http://192.168.1.8:7300/api/remind/delete-reminder", {
            id: id
        });

        //Check the reminder delete or not...
        if (response) {
            message.success("Reminder Successfully delete...");
            setRefresh(refresh + 1);
        } else {
            message.error("Failed to delete the remainder..!!!");
        }

    };

    return (
        <div className="App">
            <div className="homepage">
                <div className="homepage_header">
                    <h1>Remind Me 🙋‍♂️</h1>
                    <input type="text" placeholder="Reminder notes here..." value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
                    <input
                        type="date"
                        value={remindAt}
                        onChange={e => setRemindAt(e.target.value)}
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                    <div className="button" onClick={addReminder}>Add Reminder</div>
                </div>

                <div className="homepage_body">
                    {reminderList.map(reminder => (
                        <div className="reminder_card" key={reminder._id}>
                            <h2>{reminder.reminderMsg}</h2>
                            <h3>Remind Me On: {new Date(reminder.reminderAt).toLocaleDateString('en-GB')}</h3>
                            <h3>Remind Me At:  {new Date(reminder.reminderAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</h3>
                            <div className="button" onClick={() => updateReminder(reminder._id)}>Update</div>
                            <div className="button" onClick={() => deleteReminder(reminder._id)}>Delete</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

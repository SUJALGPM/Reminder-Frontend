import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from 'moment';
import { message } from "antd";
import { Divider } from "antd";

const Home = () => {
    const [reminderMsg, setReminderMsg] = useState("");
    const [remindAt, setRemindAt] = useState("");
    const [time, setTime] = useState("");
    const [reminderList, setReminderList] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [updatedReminderMsg, setUpdatedReminderMsg] = useState(""); // New reminder message
    const [updatedRemindAt, setUpdatedRemindAt] = useState(""); // New reminder date
    const [updatedTime, setUpdatedTime] = useState(""); // New reminder time

    //Fetch data from server list of reminder...
    useEffect(() => {
        const fetchReminderList = async () => {
            try {
                const response = await fetch("https://reminder-backend-1qmb.onrender.com/api/remind/get-all-reminder");
                const data = await response.json();
                setReminderList(data);
            } catch (error) {
                console.error("Error fetching reminders:", error);
            }
        };

        fetchReminderList();
    }, [refresh]);

    //Add new reminder...
    const addReminder = async () => {
        if (!reminderMsg || !remindAt || !time) {
            message.error("Please provide reminder message, date, and time");
            return;
        }

        const combinedDateTime = moment(remindAt + ' ' + time, 'YYYY-MM-DD HH:mm').toISOString();

        try {
            const response = await fetch("https://reminder-backend-1qmb.onrender.com/api/remind/add-new-reminder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reminderMsg: reminderMsg,
                    reminderAt: combinedDateTime
                }),
            });

            if (response.ok) {
                message.success("New Reminder added successfully...");
                setRefresh(refresh + 1);
            } else {
                message.error("Failed to add new reminder..!!!");
            }

            setReminderMsg("");
            setRemindAt("");
            setTime("");
        } catch (error) {
            console.error("Error adding reminder:", error);
        }
    };

    //Update reminder...
    const updateReminder = async (id) => {
        try {

            //Check the field is empty or not....
            if (!updatedReminderMsg || !updatedRemindAt || !updatedTime) {
                message.error("Please provide updated reminder message, date, and time");
                return;
            }

            //Format the new date...
            const combinedDateTime = moment(updatedRemindAt + ' ' + updatedTime, 'YYYY-MM-DD HH:mm').toISOString();

            //Send formated to server...
            try {
                const response = await fetch("https://reminder-backend-1qmb.onrender.com/api/remind/update-reminder", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        remindId: id,
                        reminderMsg: updatedReminderMsg,
                        reminderAt: combinedDateTime
                    }),
                });

                if (response.ok) {
                    message.success("Reminder updated successfully...");
                    setRefresh(refresh + 1);
                } else {
                    message.error("Failed to update the reminder..!!!");
                }

                //Empty after work done...
                setUpdatedReminderMsg("");
                setUpdatedRemindAt("");
                setUpdatedTime("");
            } catch (error) {
                console.error("Error updating reminder:", error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Delete reminder...
    const deleteReminder = async (id) => {
        try {
            const response = await fetch("https://reminder-backend-1qmb.onrender.com/api/remind/delete-reminder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });

            if (response.ok) {
                message.success("Reminder Successfully deleted...");
                setRefresh(refresh + 1);
            } else {
                message.error("Failed to delete the reminder..!!!");
            }
        } catch (error) {
            console.error("Error deleting reminder:", error);
        }
    };

    return (
        <div className="App">
            <div className="homepage">
                <div className="homepage_header">
                    <h1>Remind Me 🙋‍♂️</h1>
                    <input type="text" placeholder="Reminder notes here..." value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
                    <input type="date" value={remindAt} onChange={e => setRemindAt(e.target.value)} />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                    <div className="button" onClick={addReminder}>Add Reminder</div>
                </div>

                <div className="homepage_body">
                    {reminderList.map(reminder => (
                        <div className="reminder_card" key={reminder._id}>
                            <h2>{reminder.reminderMsg}</h2>
                            {/* <Divider style={{ color: "red" }} /> */}
                            <h3>Remind Me On: {new Date(reminder.reminderAt).toLocaleDateString('en-GB')}</h3>
                            <h3>Remind Me At:  {new Date(reminder.reminderAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</h3>
                            <input type="text" placeholder="New Reminder Msg" value={updatedReminderMsg} onChange={e => setUpdatedReminderMsg(e.target.value)} style={{ width: '100%' }} />
                            <input type="date" value={updatedRemindAt} onChange={e => setUpdatedRemindAt(e.target.value)} style={{ width: '100%', marginTop: '10px' }} />
                            <input type="time" value={updatedTime} onChange={e => setUpdatedTime(e.target.value)} style={{ width: '100%', marginTop: '10px' }} />
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

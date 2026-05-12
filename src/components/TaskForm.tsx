import { useState } from "react";

type TaskFormProps = {
    onAddTask: (title: string) => void;
};

function TaskForm({onAddTask}: TaskFormProps){
    const [title, setTitle] = useState("");
    const handleSubmit = () =>{
        if(!title.trim()) return;
        onAddTask(title);
        setTitle("");
    }

    return (
        <>
        <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Please enter task title.'
        />
        <button onClick={handleSubmit}>Add</button>
        </>
    )
}

export default TaskForm;
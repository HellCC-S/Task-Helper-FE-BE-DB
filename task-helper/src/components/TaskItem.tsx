import type {Task} from '../types'

type TaskItemProps = {
    task:Task;
    onChangeStatus: (id:string)=>void;
    onDelete: (id:string) => void;
};

function TaskItem({task, onChangeStatus, onDelete}: TaskItemProps){
    return (
        <li>
            {task.title} - {task.status}
            <button onClick={() => onChangeStatus(task.id)}>Next State</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
    )
}

export default TaskItem;
import type {Task} from '../types'
import TaskItem from './TaskItem';

type TaskListProps = {
    tasks:Task[];
    onChangeStatus: (id:string)=>void;
    onDelete: (id:string) => void;
};

function TaskList({tasks, onChangeStatus, onDelete}: TaskListProps){
    return (
        <ul>
            {
                tasks.map((task)=> (
                <TaskItem
                key={task.id}
                task={task}
                onChangeStatus={onChangeStatus}
                onDelete={onDelete} 
                />))
            }
        </ul>
    )
}

export default TaskList;
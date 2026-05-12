import type { TaskFilter } from "../types";

type FilterProps = {
    filterStatus:TaskFilter
    setFilterStatus: (filter:TaskFilter)=>void
};

function StatusFilter({filterStatus,setFilterStatus}: FilterProps){
    return (
        <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value as TaskFilter)}>
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
        </select>
    )
}

export default StatusFilter;
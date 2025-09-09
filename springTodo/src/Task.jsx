import { ImCross } from "react-icons/im";
import api from "./api/api";
const Task = ({ task , setTasks}) => {
  const filterDate = (date) => {
    let current = new Date();

    let month = parseInt(date.substring(5, 7));
    let day = parseInt(date.substring(8, 10));
    let year = parseInt(date.substring(0, 4));
    if (
      current.getFullYear() == year &&
      current.getMonth() == month &&
      current.getDate() == day
    )
      return date.substring(11, 17);
    else return date.substring(0, 10) + " " + date.substring(11, 17);
  };

  const handleDelete = async (id) => {
  try {
    await api.delete("/post/" + id);
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  } catch (err) {
    console.error("Failed to delete:", err);
  }
};

  return (
    <div onClick={()=>handleDelete(task.id)} className="bg-stone-950 rounded text-slate-600 p-2 px-3 duration-200 mb-2 relative group hover:bg-rose-950">
      <div className="flex text-lg font-bold">
        <div className="grow">{task.title}</div>
        <div>{filterDate(task.due)}</div>
      </div>
      <div>{task.body}</div>
      <ImCross className="absolute left-1/2 top-1/2 text-2xl hidden group-hover:text-red-900 group-hover:block -translate-1/2"/>
    </div>
  );
};

export default Task;

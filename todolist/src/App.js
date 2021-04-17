import { useState } from "react";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  const [listFilter, setListFilter] = useState([]);
  const [isOnlyPending, setIsOnlyPending]= useState([]);
  const [isEditando, setIsEditando] = useState("");

  return (
    <div classNome="App">
      <form onSubmit={onSubmit}>
        <input name="task" id="tarefas" />
        <button type="submit">Adicionar</button>
      </form>

      <div>
        <a href="#" onClick={filter}>
          {isOnlyPending ? "Todos" : "Pendentes"} </a>
      </div>

      <ul>
        {list.map((item, index) => {
          return (
            <li style={item.status === "feito" ? { textDecoration: "line-through" } : {}} key={index}>
              <span>
                {isEditando === item.id ? (
                  <input defaultValue={item.name} onBlur={(e) => onBlur(e, item)} onKeyDown={(e) => onKeyDown(e, item)}/> 
                ) : (
                  <b onClick={() => setIsEditando(item.id)}>{item.name}</b>                  
                )}
              </span>
              <button onClick={() => toggle(item)}>
                {item.status === "feito" ? 
                  <FaRegCheckSquare /> : 
                  <FaRegSquare />}
              </button>
            </li>
          );

        })}
      </ul>
    </div>
  );

  function onSubmit(e) {
    e.preventDefault();
    console.log(e.target.task.value);
    const task = {
      id: new Date(),
      name: e.target.task.value,
      status: "pendente",
    };
    setList([...list, task]);
    setListFilter([...list, task]);
    document.getElementById("tarefas").value = "";
  }

  function toggle(item) {
    const statusToUpdate = item.status === "pendente" ? "feito" : "pendente";
    const newList = list.map((t) => {
      if (t.id === item.id) t.status = statusToUpdate;
      return t;
    });
    setList(newList);
  }

  function filter(){
    const listToFilter = listFilter.filter(item => {
      return !isOnlyPending ? item.status === "pendente" : true;
    })
    setList(listToFilter);
    setIsOnlyPending(!isOnlyPending);
  }

  function save(newName, item){
    const newList = list.map((t) => {
      if (t.id === item.id) t.name = newName;
      return t;
    });
    setList(newList);
    setIsEditando("");
}

  function onKeyDown(e, item){
    if (e.charCode === 13 || e.keyCode === 13) save(e.target.value, item);
  }

  function onBlur(e, item){
      save(e.target.value, item);
  }

}

export default App;

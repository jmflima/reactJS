import { useEffect, useState } from "react";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { useParams, useLocation } from "react-router";
import axios from "axios";
import { Form, Input, Button, Row, Col, Divider } from "antd";

const endpoint = "http://localhost:3004";

const Tasks = () => {

    const params = useParams();
    const location = useLocation();
    const [list, setList] = useState([]);
    const [lista, setLista] = useState([]);
    const [isOnlyPending, setIsOnlyPending]= useState([]);
    const [isEditando, setIsEditando] = useState("");

    async function getTasks(id) {
        const res = await axios.get(`${endpoint}/tasks?list_id=${id}`);
        if ( res.status === 200 ) {
            setList(res.data);
        }
    }

    //lista a terfa mãe
    async function getList(id) {
        const res = await axios.get(`${endpoint}/lists/${id}`);
        if ( res.status === 200 ) {
            setLista(res.data);
        }
    }

    useEffect(() => {
        console.log(params);
        if (params.id) {
            getTasks(params.id);
            getList(params.id);
        }
    }, [location])

    return (
        <div className="App">

            <h1>{lista && lista.name}</h1>
            <Divider />

            <Form onFinish={onSubmit}>
                <Row>
                    <Col sm={20}>
                        <Form.Item name="task">
                            <Input name="task" id="tarefa" />
                        </Form.Item>
                    </Col>
                    <Col sm={4}>
                        <Button htmlType="submit">Adicionar</Button>
                    </Col>
                </Row>
            </Form>

            <div>
            <Button type="link" onClick={filter}>
                {isOnlyPending ? "Todos" : "Pendentes"} 
            </Button>
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

    // criando sub tarefas no banco de dados
    async function onSubmit(values) {
        console.log(values.task);
        const task = {
          id: new Date(),
          list_id: params.id,
          name: values.task,
          status: "pendente",
        };

        await axios.post(`${endpoint}/tasks`, task);
        getTasks(params.id);    //mostra a lista novamente
    }
    
    //alterando status da subtarefa
    async function toggle(item) {
        item.status = item.status === "pendente" ? "feito" : "pendente";
        await axios.put(`${endpoint}/tasks/${item.id}`, item)
        getTasks(params.id);

    }
    
    async function filter(){
        let url = `${endpoint}/tasks`;
        if (!isOnlyPending) {
            url = url + `?status=pendente`;
        }

        const res = await axios.get(url);
        if (res.status === 200) setList(res.data);
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

export default Tasks;
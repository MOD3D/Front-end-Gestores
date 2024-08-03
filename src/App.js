import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl="https://localhost:44309/api/gestores";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [gestorSeleccionado, setGestorSeleccionado]=useState({
    id: '',
    nombre: '',
    stock: '',
    descripcion: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    });
    console.log(gestorSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.id;
    gestorSeleccionado.stock=parseInt(gestorSeleccionado.stock);
    await axios.post(baseUrl, gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    gestorSeleccionado.stock=parseInt(gestorSeleccionado.stock);
    await axios.put(baseUrl+"/"+gestorSeleccionado.id, gestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.id===gestorSeleccionado.id){
          gestor.nombre=respuesta.nombre;
          gestor.stock=respuesta.stock;
          gestor.descripcion=respuesta.descripcion;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+gestorSeleccionado.id)
    .then(response=>{
     setData(data.filter(gestor=>gestor.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App" >
      <div class="main">
        <h1 class="text">Productos MOD.3D</h1>  
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success" class="button">Nuevo Producto</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {data.map(gestor=>(
          <tr key={gestor.id}>
            <td>{gestor.id}</td>
            <td>{gestor.nombre}</td>
            <td>{gestor.stock}</td>
            <td>{gestor.descripcion}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre"  onChange={handleChange}/>
          <br />
          <label>Stock: </label>
          <br />
          <input type="text" className="form-control" name="stock" onChange={handleChange}/>
          <br />
          <label>Descripcion: </label>
          <br />
          <input type="text" className="form-control" name="descripcion" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={gestorSeleccionado && gestorSeleccionado.id}/>
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre}/>
          <br />
          <label>Stock: </label>
          <br />
          <input type="text" className="form-control" name="stock" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.stock}/>
          <br />
          <label>Descripcion: </label>
          <br />
          <input type="text" className="form-control" name="descripcion" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.descripcion}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el producto {gestorSeleccionado && gestorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
      </div>
    </div>
  );
}

export default App;

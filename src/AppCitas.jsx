import React from "react";
import {firebase} from './firebase'



function AppCitas() {

  const [citas, setCitas] = React.useState([]);
  const [cita, setCita] = React.useState('');
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [id, setId] = React.useState('');


// Cada vez que se recarga la pagina captura los datos de firebase
  React.useEffect(()=>{

    const obtenerDatos = async () => {

      try {
        
        const db = firebase.firestore();
        const data = await db.collection('citas').get();
        
        //console.log(data.docs);

        // Extraer datos
        const arrayDatos = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        
        // console.log(arrayDatos);
        setCitas(arrayDatos);

      } catch (error) {
        
        console.log(error);

      }
    
    }

    obtenerDatos()

  }, []);

// Agregar una cita
  const agregar = async (e) => {
    e.preventDefault();

    // Comprobar que esta vacio
    // Si no tiene nada seria false (comprobando lo contrario)
    if(!cita.trim()){
      console.log('esta vacio');
      return
    }

    try {
      const db = firebase.firestore();
      const nuevaCita = {
        name: cita, 
        fecha: Date.now()
      }

      /* Agregar tanto en la BBDD como en ejecucion */
      const data = await db.collection('citas').add(nuevaCita);
      setCitas([
        ...citas, 
        {...nuevaCita, id: data.id}
      ])

      // console.log(citas);
      setCita('');

    } catch (error) {
      console.log(error);
    }

    console.log(cita);
  }

  // Eliminar una cita
  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('citas').doc(id).delete();

      const arrayFiltrado = citas.filter(item => item.id !== id);
      setCitas(arrayFiltrado);

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setCita(item.name);
    setId(item.id);
  }

  const editar = async (e) => {
    e.preventDefault();

    if(!cita.trim()){
      console.log('vacio');
      return
    }

    try {
      const db = firebase.firestore();
      await db.collection('citas').doc(id).update({
        name: cita
      })

      const arrayEditado = citas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: cita}: item
      ))

      setCitas(arrayEditado);
      setModoEdicion(false);
      setCita('');
      setId('');

    } catch (error) {
      console.log(error);
    }

  }

  return (

   <>
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
            <h3>Citas pendientes</h3>
            <ul className="list-group">
                {
                  citas.map(item => (
                    <li className="list-group-item" key={item.id}>
                     {item.name}
                      <button 
                      className="btn btn-danger btn-sm float-right"
                      onClick={()=> eliminar(item.id)}
                      >
                        Eliminar
                      </button>

                      <button 
                      className="btn btn-warning btn-sm float-right mr-2"
                      onClick={()=> activarEdicion(item)}
                      >
                        Editar
                      </button>
                    </li>
                  ))
                }
            </ul>
        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Cita':'Agregar Cita'
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
                <input 
                  type="text"
                  placeholder="Nombre, hora y servicio" 
                  className="form-control mb-2"
                  onChange={ e => setCita(e.target.value)}
                  value={cita}
                />

                <button 
                className={
                  modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
                }
                type="submit"
                >
                  {
                    modoEdicion ? 'Editar':'Agregar'
                  }
                  </button>
          </form>
          
        </div>
      </div>
    </div>
    </>
  );
}

export default AppCitas;

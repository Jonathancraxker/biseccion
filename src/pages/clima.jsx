import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/clima.css';

const Clima = () => {
  const [tasaAprendizaje, setTasaAprendizaje] = useState(0.03);
  const [numIteraciones, setNumIteraciones] = useState(100); 

  const [iteracionParaPredecir, setIteracionParaPredecir] = useState(1);
  const [horaParaPredecir, setHoraParaPredecir] = useState(1);
  const [prediccionActiva, setPrediccionActiva] = useState(null);

  const [datosBase] = useState({
    horas: [0, 3, 6, 9, 12, 15, 18, 21],
    temperaturas: [18, 17, 16, 20, 26, 18, 24, 20],
  });

  const [iteracionesData, setIteracionesData] = useState([
    { iteracion: 0, w: 0, b: 0, temperaturas: datosBase.temperaturas },
  ]);
  
  const [isTraining, setIsTraining] = useState(false);

  
  // --- LÓGICA DEL PROGRAMA ---
  const handleEntrenar = () => {
    setIsTraining(true);
    setPrediccionActiva(null);
    
    setTimeout(() => {
        const x = datosBase.horas;
        const y_verdaderas = datosBase.temperaturas;
        const n_puntos = x.length;
        const resultados = [{ iteracion: 0, w: 0, b: 0, temperaturas: y_verdaderas }];
        let w_actual = 0;
        let b_actual = 0;

        for (let i = 1; i <= numIteraciones; i++) {
            let suma_error_w = 0, suma_error_b = 0;
            
            for (let j = 0; j < n_puntos; j++) {
                const error = (w_actual * x[j] + b_actual) - y_verdaderas[j];
                suma_error_w += x[j] * error;
                suma_error_b += error;
            }

            const dL_dw = (2 / n_puntos) * suma_error_w;
            const dL_db = (2 / n_puntos) * suma_error_b;

            const w_nueva = w_actual - tasaAprendizaje * dL_dw;
            const b_nueva = b_actual - tasaAprendizaje * dL_db;
            
            const temperaturas_predichas = x.map(hora => w_nueva * hora + b_nueva);

            resultados.push({ iteracion: i, w: w_nueva, b: b_nueva, temperaturas: temperaturas_predichas });
            
            w_actual = w_nueva;
            b_actual = b_nueva;
        }

        setIteracionesData(resultados);
        setIsTraining(false);
    }, 50);
  };

  // --- LÓGICA DE LA PREDICCIÓN PUNTUAL ---

  // Función para obtener un ícono y descripción según la temperatura
  const getIconoClima = (temp) => {
    if (temp < 10) return { icono: '🥶', descripcion: 'Muy Frío' };
    if (temp < 18) return { icono: '☁️', descripcion: 'Fresco / Nublado' };
    if (temp < 25) return { icono: '🌤️', descripcion: 'Clima Agradable' };
    if (temp < 30) return { icono: '☀️', descripcion: 'Día Soleado' };
    return { icono: '🔥', descripcion: 'Extremadamente Caluroso' };
  };

  const handlePredecir = () => {
    const modelo = iteracionesData.find(iter => iter.iteracion === iteracionParaPredecir) || iteracionesData[iteracionesData.length - 1];
    
    if (!modelo) return;

    const { w, b } = modelo;
    const temperaturaCalculada = w * horaParaPredecir + b;
    const infoClima = getIconoClima(temperaturaCalculada);

    setPrediccionActiva({
      temperatura: temperaturaCalculada,
      ...infoClima
    });
  };

  const handleNumIteracionesChange = (e) => {
    const valor = parseInt(e.target.value, 10) || 0;
    setNumIteraciones(valor);
    setIteracionParaPredecir(valor); 
  };

  return (
    <div className="contenedor-clima">
      <h1 className="titulo-clima">Regresión lineal con gradiente descendente</h1>
      <br />
      <Link to="/biseccion" className="btn btn-warning">
        Bisección
      </Link>
      {/* --- Panel de Entrenamiento --- */}
      <div className="panel-control">
        <div className="control-item">
          <label htmlFor="tasa-input">Tasa de aprendizaje (n): </label>
          <input id="tasa-input" type="number" value={tasaAprendizaje} onChange={(e) => setTasaAprendizaje(parseFloat(e.target.value))} step="0.0001"/>
        </div>
        <div className="control-item">
          <label htmlFor="iteraciones-input">Número de iteraciones: </label>
          <input id="iteraciones-input" type="number" value={numIteraciones} onChange={handleNumIteracionesChange} />
        </div>
        <button onClick={handleEntrenar} className="boton-entrenar" disabled={isTraining}>
          {isTraining ? 'Entrenando...' : 'Entrenar Modelo'}
        </button>
      </div>
      
      {/* --- Panel de Predicción --- */}
      <div className="panel-prediccion">
        <div className="control-item">
            <label htmlFor="iter-pred-input">Usar Iteración N°:</label>
            <input id="iter-pred-input" type="number" value={iteracionParaPredecir} onChange={(e) => setIteracionParaPredecir(parseInt(e.target.value, 10))} />
        </div>
        <div className="control-item">
            <label htmlFor="hora-pred-input">Predecir para la Hora:</label>
            <input id="hora-pred-input" type="number" value={horaParaPredecir} onChange={(e) => setHoraParaPredecir(parseFloat(e.target.value))} step="0.5" />
        </div>
        <button onClick={handlePredecir} className="boton-predecir" disabled={iteracionesData.length <= 1}>
            Predecir Temperatura
        </button>
      </div>

      {/* --- Tarjeta de Resultado de la Predicción --- */}
      {prediccionActiva && (
        <div className="tarjeta-prediccion-final">
            <h2>Predicción para Querétaro</h2>
            <div className="hora-prediccion">a las {horaParaPredecir}h</div>
            <div className="icono-clima-final">{prediccionActiva.icono}</div>
            <div className="temperatura-final">{prediccionActiva.temperatura.toFixed(1)}°C</div>
            <div className="descripcion-final">{prediccionActiva.descripcion}</div>
        </div>
      )}

      {isTraining && <div className="loader">Calculando...</div>}

      {/* --- Tabla de Evolución del Modelo --- */}
      <div className="contenedor-iteraciones">
        <h3>Iteraciones</h3>
        <div className="tabla-responsive">
            <table className="tabla-clima">
            <thead>
                <tr>
                  <th>Iteración</th>
                  <th>(w)</th>
                  <th>(b)</th>
                  {datosBase.horas.map((hora) => <th key={`h-${hora}`}>{hora}h</th>)}
                </tr>
            </thead>
            <tbody>
                {iteracionesData.map((iter) => (
                  <tr key={iter.iteracion}>
                      <td className="columna-iteracion">{iter.iteracion}</td>
                      <td className="columna-param">{iter.w.toFixed(4)}</td>
                      <td className="columna-param">{iter.b.toFixed(4)}</td>
                      {iter.temperaturas.map((temp, tempIndex) => (
                      <td key={tempIndex}>{temp.toFixed(1)}°C</td>
                      ))}
                  </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Clima;
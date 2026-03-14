import { useState } from "react";
import Swal from 'sweetalert2';
import '../assets/clima.css'; 

export default function Biseccion() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [tolerancia, setTolerancia] = useState("0.01");
  const [iteraciones, setIteraciones] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // f(x) = x² - 2 es la función objetivo para encontrar la raíz (raíz cuadrada de 2)
  const f = (x) => Math.pow(x, 2) - 2;

  const handleCalcular = () => {
    let ai = parseFloat(a);
    let bi = parseFloat(b);
    let tol = parseFloat(tolerancia);

    // Validación con SweetAlert2
    if (isNaN(ai) || isNaN(bi)) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor, introduce valores numéricos para a y b.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    if (f(ai) * f(bi) >= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Intervalo no válido',
        html: 'La condición <b>f(a) * f(b) < 0</b> no se cumple.<br>Intenta con valores que encierren la raíz (ej. 1 y 3).',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      let resultados = [];
      let c = 0;
      let cAnterior = 0;
      let error = 100;
      let i = 1;
      const MAX_ITER = 50;

      while (error > tol && i <= MAX_ITER) {
        c = (ai + bi) / 2;
        if (i > 1) {
          error = Math.abs((c - cAnterior) / c) * 100;
        }

        resultados.push({
          iter: i,
          a: ai.toFixed(4),
          b: bi.toFixed(4),
          c: c.toFixed(4),
          fc: f(c).toFixed(4),
          error: i === 1 ? "---" : error.toFixed(4)
        });

        if (f(ai) * f(c) < 0) {
          bi = c;
        } else {
          ai = c;
        }
        cAnterior = c;
        i++;
      }

      setIteraciones(resultados);
      setIsCalculating(false);

      Swal.fire({
        icon: 'success',
        title: 'Cálculo Finalizado',
        text: `Se encontró la raíz aproximada en ${resultados.length} iteraciones.`,
        timer: 2000,
        showConfirmButton: false
      });
    }, 400);
  };

  return (
    <div className="contenedor-clima">
      <h1 className="titulo-clima">Método de Bisección</h1>
      <p style={{textAlign: 'center', color: '#666'}}>Función Objetivo: f(x) = x² - 2</p>
      
      <br />
      {/* <Link to="/clima" className="btn btn-warning">
        Volver a Clima
      </Link> */}

      {/* Panel de Control */}
      <div className="panel-control">
        <div className="control-item">
          <label>Límite Inferior (a):</label>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="Ej. 1" />
        </div>
        <div className="control-item">
          <label>Límite Superior (b):</label>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="Ej. 3" />
        </div>
        <div className="control-item">
          <label>% Tolerancia:</label>
          <input type="number" value={tolerancia} onChange={(e) => setTolerancia(e.target.value)} step="0.0001" />
        </div>
        <button onClick={handleCalcular} className="boton-entrenar" disabled={isCalculating}>
          {isCalculating ? 'Calculando...' : 'Iniciar Bisección'}
        </button>
      </div>

      {iteraciones.length > 0 && (
        <div className="contenedor-iteraciones">
          <h3>Evolución de la Búsqueda de Raíz</h3>
          <div className="tabla-responsive">
            <table className="tabla-clima">
              <thead>
                <tr>
                  <th>Iteración</th>
                  <th>a</th>
                  <th>b</th>
                  <th>c (Raíz aprox.)</th>
                  <th>f(c)</th>
                  <th>Error Relativo</th>
                </tr>
              </thead>
              <tbody>
                {iteraciones.map((it) => (
                  <tr key={it.iter}>
                    <td className="columna-iteracion">{it.iter}</td>
                    <td className="columna-param">{it.a}</td>
                    <td className="columna-param">{it.b}</td>
                    <td style={{fontWeight: 'bold', color: '#2c3e50'}}>{it.c}</td>
                    <td>{it.fc}</td>
                    <td style={{color: it.error < 1 ? '#27ae60' : '#e67e22'}}>
                        {it.error === "---" ? "---" : `${it.error}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCalculating && <div className="loader">Procesando...</div>}
    </div>
  );
}
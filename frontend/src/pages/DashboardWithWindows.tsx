
import WindowFrame from '../components/WindowFrame';

export default function DashboardWithWindows() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#008080' }}>
      <WindowFrame title="Meu Computador" initialX={100} initialY={100}>
        <p>Conteúdo da janela 1.</p>
      </WindowFrame>
      <WindowFrame title="Lixeira" initialX={400} initialY={200}>
        <p>Conteúdo da janela 2.</p>
      </WindowFrame>
    </div>
  );
}

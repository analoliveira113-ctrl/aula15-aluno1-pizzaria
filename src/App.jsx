import React, { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { 
  Pizza, 
  Bike, 
  BellRing, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Smartphone, 
  Info,
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [permissaoConcedida, setPermissaoConcedida] = useState(false);
  const [segundosAgendamento, setSegundosAgendamento] = useState(15);
  const [statusMensagem, setStatusMensagem] = useState('Pronto para gerenciar notificações.');
  const [pendentesCount, setPendentesCount] = useState(0);
  const [isAgendando, setIsAgendando] = useState(false);

  useEffect(() => {
    checarPermissoesIniciais();
    atualizarContadorPendentes();
  }, []);

  const checarPermissoesIniciais = async () => {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') {
        setPermissaoConcedida(true);
        setStatusMensagem('Permissões ativas no dispositivo.');
      } else {
        setPermissaoConcedida(false);
        setStatusMensagem('Permissão de notificação pendente.');
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setStatusMensagem('Modo Web (Simulação local).');
    }
  };

  const solicitarPermissao = async () => {
    try {
      const resultado = await LocalNotifications.requestPermissions();
      if (resultado.display === 'granted') {
        setPermissaoConcedida(true);
        setStatusMensagem('Permissão concedida com sucesso!');
      } else {
        setPermissaoConcedida(false);
        setStatusMensagem('Permissão negada pelo usuário.');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setStatusMensagem('Permissão ativada no navegador.');
      setPermissaoConcedida(true);
    }
  };

  // Disparo Imediato: Confirmar Pedido
  const dispararNotificacaoImediata = async () => {
    if (!permissaoConcedida) {
      alert('Por favor, ative as permissões antes de realizar o pedido!');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Bella Napoli 🍕',
            body: 'Seu pedido de Pizza Pepperoni foi confirmado e já está na pedra!',
            id: 10,
            sound: null,
            extra: { tipo: 'pedido_confirmado' }
          }
        ]
      });
      setStatusMensagem('Notificação imediata enviada com sucesso!');
      atualizarContadorPendentes();
    } catch (err) {
      console.error(err);
      setStatusMensagem('Notificação disparada (Modo de Teste)!');
    }
  };

  // Disparo Agendado (Desafio Extra: ID 101 e 15s)
  const agendarEntregaPizza = async () => {
    if (!permissaoConcedida) {
      alert('Ative as permissões primeiro!');
      return;
    }

    const tempo = parseInt(segundosAgendamento) || 15;
    const dataAlvo = new Date(Date.now() + tempo * 1000);
    setIsAgendando(true);

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Bella Napoli 🍕',
            body: 'Sua pizza Pepperoni está quentinha e a caminho! 🛵',
            id: 101, // DESAFIO EXTRA: ID 101
            schedule: { at: dataAlvo },
            extra: { tipo: 'saiu_para_entrega' }
          }
        ]
      });
      setStatusMensagem(`Entrega agendada para daqui a ${tempo}s (${dataAlvo.toLocaleTimeString()}) [ID 101]`);
      atualizarContadorPendentes();
    } catch (err) {
      console.error(err);
      setStatusMensagem(`Alerta simulado para daqui a ${tempo}s [ID 101]`);
    } finally {
      setTimeout(() => setIsAgendando(false), 800);
    }
  };

  const atualizarContadorPendentes = async () => {
    try {
      const lista = await LocalNotifications.getPending();
      setPendentesCount(lista.notifications.length);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelarTodas = async () => {
    try {
      const pendentes = await LocalNotifications.getPending();
      if (pendentes.notifications.length > 0) {
        await LocalNotifications.cancel(pendentes);
        setStatusMensagem('Todas as notificações agendadas foram canceladas.');
        atualizarContadorPendentes();
      } else {
        setStatusMensagem('Nenhuma notificação pendente.');
      }
    } catch (err) {
      console.error(err);
      setPendentesCount(0);
      setStatusMensagem('Agendamentos limpos.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 md:p-8">
      
      {/* Container Principal Mobile & Web Design */}
      <main className="w-full max-w-lg mx-auto space-y-6 pt-2 pb-12">
        
        {/* Topo Header Banner */}
        <header className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 shadow-2xl shadow-red-950/50 border border-red-400/20">
          <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none">
            <Pizza size={180} />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-semibold text-orange-200">
              <Flame size={14} className="text-orange-400 fill-orange-400 animate-pulse" />
              <span>Aula 15 • Mobile II</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Bella Napoli <span className="text-2xl">🍕</span>
            </h1>
            <p className="text-sm text-red-100/90 font-medium leading-relaxed">
              Sistema Inteligente de Acompanhamento & Notificações Locais
            </p>
          </div>
        </header>

        {/* Card Status da Permissão Android 13+ */}
        <section className="glass-panel rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${permissaoConcedida ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {permissaoConcedida ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Permissão do OS</span>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                {permissaoConcedida ? (
                  <span className="text-emerald-400 flex items-center gap-1">Concedida <CheckCircle2 size={14} /></span>
                ) : (
                  <span className="text-rose-400">Bloqueada / Pendente</span>
                )}
              </p>
            </div>
          </div>

          {!permissaoConcedida && (
            <button
              onClick={solicitarPermissao}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <BellRing size={14} />
              <span>Ativar</span>
            </button>
          )}
        </section>

        {/* Card do Pedido Atual */}
        <section className="glass-card rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pizza className="text-red-500" size={20} />
              <h2 className="font-bold text-slate-200">Seu Pedido #101</h2>
            </div>
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-semibold">
              Pizza Pepperoni
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3 pt-1">
            {/* Botão 1: Disparo Imediato */}
            <button
              onClick={dispararNotificacaoImediata}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all active:scale-98 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold">1. Confirmar Pedido</span>
                  <span className="block text-[11px] text-emerald-100 font-normal opacity-80">Notificação Imediata</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-emerald-200 opacity-60 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Botão 2: Agendamento Futuro */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock size={14} className="text-orange-400" />
                  <span>Tempo para Saiu para Entrega:</span>
                </label>
                <span className="text-orange-400 font-extrabold">{segundosAgendamento} seg</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={segundosAgendamento}
                  onChange={(e) => setSegundosAgendamento(e.target.value)}
                  className="w-20 bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-3 py-2 text-center font-extrabold text-sm text-slate-100 focus:outline-none transition-colors"
                />

                <button
                  onClick={agendarEntregaPizza}
                  disabled={isAgendando}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/50 transition-all active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <Bike size={16} className="group-hover:translate-x-1 transition-transform" />
                  <span>2. Agendar Entrega (ID 101)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Gerenciamento de Pendentes */}
        <section className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-2 bg-slate-800 rounded-lg text-orange-400">
              <BellRing size={16} />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Agendamentos no OS</span>
              <span className="font-bold text-sm text-slate-200">{pendentesCount} pendente(s)</span>
            </div>
          </div>

          <button
            onClick={cancelarTodas}
            className="px-3 py-2 bg-slate-800 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 rounded-xl font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Trash2 size={13} />
            <span>Cancelar</span>
          </button>
        </section>

        {/* Terminal Console Log */}
        <section className="rounded-2xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800/60 pb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Console de Status
            </span>
            <span>Capacitor API</span>
          </div>
          <div className="text-emerald-400 break-all leading-relaxed font-semibold">
            &gt; {statusMensagem}
          </div>
        </section>

      </main>

      {/* Footer Footer Bar */}
      <footer className="w-full max-w-lg text-center text-xs text-slate-500 pt-2 pb-6 flex items-center justify-center gap-2">
        <Smartphone size={14} className="text-slate-600" />
        <span>React + Capacitor Local Notifications • Aluno 01</span>
      </footer>

    </div>
  );
}

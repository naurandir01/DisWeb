import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const SSHTerminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddon = new FitAddon();

  useEffect(() => {
    // Initialiser le terminal xterm.js
    const xterm = new Terminal();
    xterm.loadAddon(fitAddon);
    if (terminalRef.current) {
      xterm.open(terminalRef.current);
    }
    fitAddon.fit();

    xtermRef.current = xterm;

    // Établir une connexion WebSocket avec le backend
    const socket = new WebSocket('ws://localhost:8000/ws/ssh/');

    socket.onopen = () => {
      // Envoyer les informations d'identification SSH au backend
      socket.send(JSON.stringify({
        hostname: 'votre_hôte',
        username: 'votre_utilisateur',
        password: 'votre_mot_de_passe',
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Afficher les données reçues dans le terminal
      xterm.write(data.output);
      if (data.error) {
        xterm.writeln(`\x1b[31m${data.error}\x1b[0m`); // Afficher les erreurs en rouge
      }
    };

    socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };

    return () => {
      socket.close();
      xterm.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '500px' }} />;
};

export default SSHTerminal;

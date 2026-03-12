import { useCallback, useEffect, useRef, useState } from "react";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

interface UseWebSocketOptions<T = unknown> {
  onMessage: (data: T) => void;
  protocols?: string | string[];
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
}

// Simple hook with automatic reconnection and generic message type
export function useWebSocket<T = unknown>(
  url: string,
  options: UseWebSocketOptions<T>
) {
  const { onMessage, protocols, onOpen, onClose, onError } = options;
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>(0);

  // track last time status changed and debounce rapid transitions
  const statusTimer = useRef<number | null>(null);
  const lastStatusChange = useRef<number>(0);
  const statusRef = useRef<ConnectionStatus>(status);

  // set initial timestamp once
  useEffect(() => {
    lastStatusChange.current = Date.now();
  }, []);

  const enqueueStatus = useCallback(
    (
      newStatus:
        | ConnectionStatus
        | ((prev: ConnectionStatus) => ConnectionStatus)
    ) => {
      const now = Date.now();
      const minInterval = 500; // ms between visible changes

      const apply = () => {
        const resolved =
          typeof newStatus === "function"
            ? newStatus(statusRef.current)
            : newStatus;
        setStatus(resolved);
        statusRef.current = resolved;
        lastStatusChange.current = Date.now();
        statusTimer.current = null;
      };

      if (now - lastStatusChange.current < minInterval) {
        // schedule if a timer isn't already pending
        if (statusTimer.current == null) {
          statusTimer.current = window.setTimeout(apply, minInterval);
        }
      } else {
        apply();
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      enqueueStatus((s) => (s === "disconnected" ? "reconnecting" : "connecting"));
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;

      ws.onopen = () => {
        enqueueStatus("connected");
        reconnectRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as T;
          onMessage(data);
        } catch {
          // if not JSON, pass raw
          onMessage(ev.data as unknown as T);
        }
      };

      ws.onclose = (ev) => {
        enqueueStatus("disconnected");
        onClose?.(ev);
        if (cancelled) return;
        const timeout = Math.min(10000, 1000 * 2 ** reconnectRef.current);
        reconnectRef.current += 1;
        setTimeout(() => {
          connect();
        }, timeout);
      };

      ws.onerror = (ev) => {
        onError?.(ev);
      };
    }

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      if (statusTimer.current != null) {
        clearTimeout(statusTimer.current);
        statusTimer.current = null;
      }
    };
  }, [url, protocols, onMessage, onOpen, onClose, onError, enqueueStatus]);

  const send = useCallback((msg: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { status, send };
}

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Kezelés nélküli felületi hiba", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slateBg p-6">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h1 className="text-2xl font-extrabold text-slate-900">Hiba történt</h1>
            <p className="mt-2 text-sm text-slate-600">Váratlan hiba lépett fel. Kérlek töltsd újra az oldalt.</p>
            <button type="button" className="btn-base btn-primary btn-md mt-4" onClick={() => window.location.reload()}>
              Alkalmazás újratöltése
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
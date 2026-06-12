import React from "react";
import { Link } from "react-router";

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    console.error("UI error captured by boundary:", error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <section className="space-y-5 rounded-xl border border-rose-400/30 bg-rose-950/20 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-slate-200">Try refreshing the page or contact us if the issue persists.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="rounded bg-white px-4 py-2 font-semibold text-slate-900" onClick={() => window.location.reload()}>
              Refresh
            </button>
            <a className="rounded border border-white/30 px-4 py-2 text-white" href="mailto:hello@wnd.agency">
              Contact Support
            </a>
            <Link className="rounded border border-white/30 px-4 py-2 text-white" to="/">
              Go Home
            </Link>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

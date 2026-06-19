import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <div className="text-8xl font-display font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Page not found</h1>
        <p className="text-slate-400 mb-8">This page doesn't exist. Let's get you back on track.</p>
        <Link to="/"><Button size="lg">Back to Home</Button></Link>
      </div>
    </div>
  );
}

import React from 'react';
import { Compass, Server, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenExamDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenExamDocs }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12 px-4 sm:px-8 text-neutral-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-neutral-900 mb-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>WanderGuide</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
            Full-stack tourist exploration and geospatial discovery platform built with React 19, TypeScript, Leaflet, and Express.js REST API.
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
            <span>Course Project: Full Stack Development (FSD)</span>
            <span aria-hidden="true">·</span>
            <span>External Examination Ready</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
          <a href="#destinations" className="hover:text-neutral-900 transition-colors">
            Destinations
          </a>
          <a href="#interactive-map" className="hover:text-neutral-900 transition-colors">
            Interactive Map
          </a>
          <a href="#reviews-feed" className="hover:text-neutral-900 transition-colors">
            Traveler Reviews
          </a>
          <button
            onClick={onOpenExamDocs}
            className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Examiner Technical Deck</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
        <div>© 2026 WanderGuide. All rights reserved for FSD University Demonstration.</div>
        <div className="flex items-center gap-3">
          <span>Leaflet Maps & OpenStreetMap</span>
          <span aria-hidden="true">·</span>
          <span>REST API Architecture</span>
        </div>
      </div>
    </footer>
  );
};

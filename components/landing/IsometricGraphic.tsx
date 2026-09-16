'use client';

import React from 'react';

interface IsometricGraphicProps {
  className?: string;
  variant?: 'stack' | 'steps' | 'cube' | 'layers';
}

export default function IsometricGraphic({
  className = '',
  variant = 'stack',
}: IsometricGraphicProps) {
  if (variant === 'layers') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[200px]">
          <defs>
            <linearGradient id="layerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="layerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
            <linearGradient id="layerSide" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Bottom Layer */}
          <path d="M100 125 L160 90 L100 55 L40 90 Z" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" opacity="0.6" />
          <path d="M40 90 L40 100 L100 135 L100 125 Z" fill="#312e81" opacity="0.6" />
          <path d="M100 125 L100 135 L160 100 L160 90 Z" fill="#1e1b4b" opacity="0.6" />

          {/* Middle Layer */}
          <path d="M100 95 L160 60 L100 25 L40 60 Z" fill="url(#layerGrad2)" stroke="#a855f7" strokeWidth="1.2" opacity="0.85" />
          <path d="M40 60 L40 72 L100 107 L100 95 Z" fill="url(#layerSide)" />
          <path d="M100 95 L100 107 L160 72 L160 60 Z" fill="#2e1065" />

          {/* Top Floating Slab with Glow */}
          <g filter="url(#purpleGlow)">
            <path d="M100 65 L160 30 L100 -5 L40 30 Z" fill="url(#layerGrad1)" stroke="#e9d5ff" strokeWidth="1.5" />
            <path d="M40 30 L40 44 L100 79 L100 65 Z" fill="#7e22ce" />
            <path d="M100 65 L100 79 L160 44 L160 30 Z" fill="#581c87" />
          </g>

          {/* Glowing accent dot */}
          <circle cx="100" cy="30" r="3.5" fill="#f5d0fe" />
        </svg>
      </div>
    );
  }

  if (variant === 'steps') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[200px]">
          <defs>
            <linearGradient id="stepTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <linearGradient id="stepDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          {/* Step 1 */}
          <path d="M35 110 L75 88 L55 76 L15 98 Z" fill="#4c1d95" stroke="#7c3aed" strokeWidth="1" />
          <path d="M15 98 L15 106 L55 84 L55 76 Z" fill="#2e1065" />
          <path d="M55 76 L55 84 L75 96 L75 88 Z" fill="#1e1b4b" />

          {/* Step 2 */}
          <path d="M85 90 L125 68 L105 56 L65 78 Z" fill="#6d28d9" stroke="#a855f7" strokeWidth="1" />
          <path d="M65 78 L65 88 L105 66 L105 56 Z" fill="#3b0764" />
          <path d="M105 56 L105 66 L125 78 L125 68 Z" fill="#2e1065" />

          {/* Step 3 (Tallest glowing top) */}
          <path d="M135 65 L175 43 L155 31 L115 53 Z" fill="url(#stepTop)" stroke="#f3e8ff" strokeWidth="1.2" />
          <path d="M115 53 L115 70 L155 48 L155 31 Z" fill="#7c3aed" />
          <path d="M155 31 L155 48 L175 60 L175 43 Z" fill="#581c87" />
        </svg>
      </div>
    );
  }

  // Default 'stack' (Photo 1 multi-turn conversation 3D isometric stack)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[240px]">
        <defs>
          <linearGradient id="mainSlabTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="mainSlabLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#581c87" />
          </linearGradient>
          <linearGradient id="mainSlabRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
          <filter id="ambientViolet" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <ellipse cx="120" cy="110" rx="70" ry="35" fill="#7c3aed" opacity="0.25" filter="url(#ambientViolet)" />

        {/* Dark base rails */}
        <path d="M30 140 L110 185 L210 130 L130 85 Z" fill="#0f101c" stroke="#2e1065" strokeWidth="1" />
        
        {/* Receding vertical fin ribs (like Photo 1 left card) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const offsetX = i * 16;
          const offsetY = i * -8;
          return (
            <g key={i} opacity={0.35 + i * 0.1}>
              <path
                d={`M${50 + offsetX} ${130 + offsetY} L${60 + offsetX} ${125 + offsetY} L${60 + offsetX} ${90 + offsetY} L${50 + offsetX} ${95 + offsetY} Z`}
                fill="#271542"
                stroke="#581c87"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* Center glowing hero upright slab */}
        <g filter="url(#ambientViolet)">
          {/* Top Face */}
          <path d="M120 40 L165 15 L155 10 L110 35 Z" fill="#ffffff" />
          {/* Front Face */}
          <path d="M110 35 L120 40 L120 120 L110 115 Z" fill="url(#mainSlabLeft)" stroke="#f3e8ff" strokeWidth="1" />
          {/* Side Face */}
          <path d="M120 40 L165 15 L165 95 L120 120 Z" fill="url(#mainSlabTop)" stroke="#f3e8ff" strokeWidth="1.2" />
        </g>

        {/* Supporting trailing slabs */}
        <path d="M175 35 L205 18 L205 78 L175 95 Z" fill="#3b0764" stroke="#7c3aed" strokeWidth="0.8" opacity="0.75" />
        <path d="M165 95 L175 89 L175 95 L165 101 Z" fill="#581c87" />
      </svg>
    </div>
  );
}

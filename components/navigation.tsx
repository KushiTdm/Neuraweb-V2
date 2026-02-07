'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NeuraWeb</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Button asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Button className="w-full" asChild>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

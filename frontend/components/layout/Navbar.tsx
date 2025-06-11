'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Button } from '@/components/ui/button';
import { FaBars, FaFilm } from 'react-icons/fa';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <FaFilm className="h-8 w-8 text-secondary" />
          <span className="text-2xl font-bold text-accent">MovieSystem</span>
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/movies" className="text-accent hover:text-secondary transition-colors">
            الأفلام
          </Link>
          {user ? (
            <>
              <Link
                href="/reservations"
                className="text-accent hover:text-secondary transition-colors"
              >
                حجوزاتي
              </Link>
              <Button
                variant="destructive"
                onClick={() => {}}
                className="bg-secondary hover:bg-red-700"
              >
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-accent hover:text-secondary transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link href="/register">
                <Button variant="default" className="bg-secondary hover:bg-red-700">
                  التسجيل
                </Button>
              </Link>
            </>
          )}
        </div>
        <button
          className="md:hidden text-accent"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
           <FaBars className="h-6 w-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary px-4 py-3">
          <div className="flex flex-col space-y-2">
            <Link
              href="/movies"
              className="text-accent hover:text-secondary transition-colors"
              onClick={toggleMenu}
            >
              الأفلام
            </Link>
            {user ? (
              <>
                <Link
                  href="/reservations"
                  className="text-accent hover:text-secondary transition-colors"
                  onClick={toggleMenu}
                >
                  حجوزاتي
                </Link>
                <Button
                  variant="destructive"
                  onClick={toggleMenu}
                  className="bg-secondary hover:bg-red-700"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-accent hover:text-secondary transition-colors"
                  onClick={toggleMenu}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="text-accent hover:text-secondary transition-colors"
                  onClick={toggleMenu}
                >
                  التسجيل
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
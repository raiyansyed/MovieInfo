import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  return (
    <nav className="bg-[#403963] text-white w-full">
      <div className="h-20 flex items-center px-6">
        <Link to="/" onClick={close} className="font-bold text-2xl shrink-0">
          Movie Pulse
        </Link>

        {/* Desktop links */}
        <div className="ml-auto hidden md:flex items-center gap-10 font-semibold">
          <Link to="/recommendations">AI Recommendations</Link>
          <Link to="/">Home</Link>
            <Link to="/favorites">Favorites</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-[#4c4373] focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={toggle}
        >
          <span className="block w-6 h-0.5 bg-white relative">
            <span
              className={`absolute left-0 -top-2 w-6 h-0.5 bg-white transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            ></span>
            <span
              className={`absolute left-0 top-2 w-6 h-0.5 bg-white transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            ></span>
            <span
              className={`absolute left-0 top-0 w-6 h-0.5 bg-white transition ${
                open ? "opacity-0" : ""
              }`}
            ></span>
          </span>
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 pb-6 gap-4 font-semibold text-lg">
          <Link to="/recommendations" onClick={close}>
            AI Recommendations
          </Link>
          <Link to="/" onClick={close}>
            Home
          </Link>
          <Link to="/favorites" onClick={close}>
            Favorites
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
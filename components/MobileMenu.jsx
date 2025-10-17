"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MobileMenu({ isOpen, onClose }) {
  const reduxUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(reduxUser);
  const role = user?.role || "";

  useEffect(() => {
    if (!reduxUser && typeof window !== "undefined") {
      const stored =
        JSON.parse(localStorage.getItem("admin_user")) ||
        JSON.parse(localStorage.getItem("photographer_user"));
      setUser(stored);
    }
  }, [reduxUser]);

  return (
    <>
      {/* ✅ Overlay */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        ></div>
      )}

      {/* ✅ Sidebar-like mobile menu */}
      <div
        className={`mobile-menu ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-270px",
          width: "270px",
          height: "100%",
          backgroundColor: "#1B5A90",
          color: "#fff",
          zIndex: 999,
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          transition: "left 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* ✅ Header */}
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <span>Menu</span>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <i className="fe fe-x"></i>
          </button>
        </div>

        {/* ✅ Menu items */}
        <div style={{ padding: "10px 0" }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {role === "ADMIN" ? (
              <>
                <li>
                  <a href="./" className="menu-link d-flex align-items-center px-3 py-2">
                    <i className="fe fe-home me-2"></i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./photographers"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-user-plus me-2"></i>
                    <span>Photographers</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./transactions-list"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-activity me-2"></i>
                    <span>Bookings Management</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./reviews"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-star-o me-2"></i>
                    <span>Reviews Management</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./profile"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-user me-2"></i>
                    <span>Profile</span>
                  </a>
                </li>
              </>
            ) : role === "PHOTOGRAPHER" ? (
              <>
                <li>
                  <a
                    href="./appointments"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-layout me-2"></i>
                    <span>Bookings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./gallery"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-vector me-2"></i>
                    <span>Portfolios</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./reviews"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-star-o me-2"></i>
                    <span>Reviews</span>
                  </a>
                </li>
                <li>
                  <a
                    href="./profile"
                    className="menu-link d-flex align-items-center px-3 py-2"
                  >
                    <i className="fe fe-user me-2"></i>
                    <span>Profile</span>
                  </a>
                </li>
              </>
            ) : (
              <li className="px-3 py-2 text-light opacity-75">No Access</li>
            )}
          </ul>
        </div>
      </div>

      {/* ✅ CSS */}
      <style jsx>{`
        .menu-link {
          color: #ffffffcc; /* Trắng nhẹ */
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          display: block;
        }
        .menu-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        .menu-link i {
          color: #fff;
        }
      `}</style>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    avatarUrl: "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Lấy profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const storedUser =
          JSON.parse(localStorage.getItem("admin_user")) ||
          JSON.parse(localStorage.getItem("photographer_user"));
        if (!storedUser) return;

        const role = storedUser?.role;
        let api = "/api/v1/profiles/me";
        if (role === "ADMIN") api = "/api/v1/admin/me";

        const token =
          localStorage.getItem("admin_token") ||
          localStorage.getItem("photographer_token");

        const res = await fetch(api, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const responseData = data?.responseData;

        setProfile({
          avatarUrl:
            responseData?.avatarUrl ||
            "/theme/admin/assets/img/patients/patient2.jpg",
          firstName: responseData?.firstName || "",
          lastName: responseData?.lastName || "",
          role: responseData?.role || role || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    fetchProfile();
  }, []);

  // ✅ Logout
  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("photographer_user");
    localStorage.removeItem("photographer_token");
    router.push("/login");
  }

  // ✅ Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <>
      <div className="header d-flex align-items-center justify-content-between">
        {/* ✅ Nút menu (mở/đóng) */}
        <a
          className="mobile_btn d-md-none"
          id="mobile_btn"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleMobileMenu();
          }}
        >
          <i className="fa fa-bars"></i>
        </a>

        {/* ✅ Logo desktop */}
        <a
          href="/"
          className="logo d-none d-md-flex align-items-center text-decoration-none"
        >
          <img
            src="/theme/assets/img/logo-2.jpg"
            alt="Logo"
            style={{ height: "50px", width: "auto", marginRight: "10px" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
            BOOKSNAP
          </span>
        </a>

        {/* ✅ Logo mobile */}
        <a
          href="/"
          className="logo d-flex d-md-none align-items-center text-decoration-none mx-auto"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <img
            src="/theme/assets/img/logo-2.jpg"
            alt="Logo"
            style={{ height: "45px", width: "auto" }}
          />
          <span
            style={{
              fontWeight: "bold",
              fontSize: "17px",
              color: "black",
              marginLeft: "6px",
            }}
          >
            BOOKSNAP
          </span>
        </a>

        {/* ✅ Dropdown user */}
        <ul className="nav user-menu ms-auto">
          <li className="nav-item dropdown has-arrow">
            <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <span className="user-img">
                <img
                  className="rounded-circle"
                  src={profile.avatarUrl}
                  width="31"
                  height="31"
                  alt={fullName || "User"}
                />
              </span>
              <span className="ml-2 d-none d-md-inline">
                {fullName || "Loading..."}
              </span>
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <img
                    src={profile.avatarUrl}
                    alt="User"
                    className="avatar-img rounded-circle"
                  />
                </div>
                <div className="user-text">
                  <h6>{fullName || "Chưa đăng nhập"}</h6>
                  <p className="text-muted mb-0">{profile.role}</p>
                </div>
              </div>
              <a className="dropdown-item" href="/profile">
                My Profile
              </a>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* ✅ Mobile menu (React-controlled) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

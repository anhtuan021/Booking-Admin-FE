"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RequireAuth from "../components/RequireAuth";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";

export default function AdminHome() {
  const user = useSelector((state) => state.auth.user);
  const [photographers, setPhotographers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalPhotographers, setTotalPhotographers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorPhotographers, setErrorPhotographers] = useState("");
  const [errorCustomers, setErrorCustomers] = useState("");
  const [errorBookings, setErrorBookings] = useState("");

  // ====================== FETCH PHOTOGRAPHERS ======================
  useEffect(() => {
    async function fetchPhotographers() {
      setLoading(true);
      setErrorPhotographers("");
      try {
        const res = await fetch(`/api/v1/photographers/search`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch photographers");
        const data = await res.json();
        const list = (data.responseData || []).filter((item) => item.id);
        const sorted = list.sort((a, b) => b.id - a.id);
        setPhotographers(sorted);
        setTotalPhotographers(list.length);
      } catch (err) {
        setErrorPhotographers(err.message || "Error fetching photographers");
      } finally {
        setLoading(false);
      }
    }
    fetchPhotographers();
  }, []);

  // ====================== FETCH CUSTOMERS ======================
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setErrorCustomers("");
      try {
        const res = await fetch(`/api/v1/customers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        const list = (data.responseData || [])
          .filter((item) => item.id)
          .map((item) => {
            // Chuẩn hóa email giống Photographer
            const email =
              item.email ||
              item.account?.email ||
              item.accounts?.[0]?.email ||
              "-";
            return {
              ...item,
              email,
            };
          })
          .sort((a, b) => a.id - b.id);

        setCustomers(list);
        setTotalCustomers(list.length);
      } catch (err) {
        setErrorCustomers(err.message || "Error fetching customers");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  // ====================== FETCH BOOKINGS ======================
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setErrorBookings("");
      try {
        const res = await fetch(`/api/v1/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        const list = (data.responseData || []).filter((item) => item.id);
        const sorted = list.sort((a, b) => a.id - b.id);
        setBookings(sorted);
      } catch (err) {
        setErrorBookings(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // ====================== UI RENDER ======================
  return (
    <RequireAuth>
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">
                    Welcome {user?.role} | {user?.firstName + " " + user?.lastName || ""}!
                  </h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ===================== DASHBOARD CARDS ===================== */}
            <div className="row">
              {/* Photographers count */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorPhotographers
                              ? "!"
                              : totalPhotographers}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Photographers</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customers count */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-success">
                        <i className="fe fe-credit-card"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorCustomers
                              ? "!"
                              : totalCustomers}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Customers</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-success w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings count */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-danger border-danger">
                        <i className="fe fe-money"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading ? "..." : errorBookings ? "!" : bookings.length}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Bookings</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-danger w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-warning border-warning">
                        <i className="fe fe-folder"></i>
                      </span>
                      <div className="dash-count">
                        <h3>
                          {loading
                            ? "..."
                            : errorBookings
                              ? "!"
                              : Number(
                                bookings
                                  .map((b) =>
                                    moment(b.date).isSame(moment(), "month")
                                      ? b.totalPayment || 0
                                      : 0
                                  )
                                  .reduce((a, b) => a + b, 0)
                              ).toLocaleString("vi-VN")}
                        </h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Monthly Revenue</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-warning w-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== TABLES ===================== */}
            <div className="row">
              {/* Photographers table */}
              <div className="col-md-6 d-flex">
                <div className="card card-table flex-fill">
                  <div className="card-header">
                    <h4 className="card-title">Photographers List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                      <table className="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Speciality</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={5}>Loading...</td></tr>
                          ) : errorPhotographers ? (
                            <tr><td colSpan={5} className="text-danger">{errorPhotographers}</td></tr>
                          ) : photographers.length === 0 ? (
                            <tr><td colSpan={5}>No data available</td></tr>
                          ) : (
                            photographers.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.businessName || item.title || "-"}</td>
                                <td>{item.email || "-"}</td>
                                <td>{item.specialties?.join(", ") || "-"}</td>
                                <td>{item.status || "-"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Customers table */}
              <div className="col-md-6 d-flex">
                <div className="card card-table flex-fill">
                  <div className="card-header">
                    <h4 className="card-title">Customers List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                      <table className="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={3}>Loading...</td></tr>
                          ) : errorCustomers ? (
                            <tr><td colSpan={3} className="text-danger">{errorCustomers}</td></tr>
                          ) : customers.length === 0 ? (
                            <tr><td colSpan={3}>No data available</td></tr>
                          ) : (
                            customers.map((customer) => (
                              <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.firstName + " " + customer.lastName || "-"}</td>
                                <td>{customer.email}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

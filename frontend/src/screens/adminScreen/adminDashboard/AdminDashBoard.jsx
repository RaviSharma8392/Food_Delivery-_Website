import React, { useState, useEffect } from "react";
import {
  getSalesToday,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
} from "../../../api/index";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          salesTodayRes,
          weeklySales,
          totalMonthlySales,
          totalMonthlySalesOnline,
        ] = await Promise.all([
          getSalesToday(),
          getWeeklySales(),
          getMonthlySalesCash(),
          getMonthlySalesOnline(),
        ]);

        setSalesData({
          todaySalesInCash: salesTodayRes.data?.cash || 0,
          todaySalesInOnline: salesTodayRes.data?.online || 0,
          weekelySalesInCash: weeklySales.data?.cash || 0,
          weekelySalesInOnline: weeklySales.data?.online || 0,
          monthlySales: totalMonthlySales.data?.total || 0,
          monthlySalesOnline: totalMonthlySalesOnline.data?.total || 0,
        });

        console.log(salesTodayRes.data);
        console.log("All Sales Data", {
          salesTodayRes,
          weeklySales,
          totalMonthlySales,
          totalMonthlySalesOnline,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getPercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            style={{ width: "3rem", height: "3rem" }}
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  const {
    todaySalesInCash,
    todaySalesInOnline,
    weekelySalesInCash,
    weekelySalesInOnline,
    monthlySales,
    monthlySalesOnline,
  } = salesData;

  const totalToday = todaySalesInCash + todaySalesInOnline;
  const totalWeekly = weekelySalesInCash + weekelySalesInOnline;
  const totalMonthly = monthlySales + monthlySalesOnline;

  const cashPercentage = getPercentage(monthlySales, totalMonthly);
  const onlinePercentage = getPercentage(monthlySalesOnline, totalMonthly);

  return (
    <div
      className="container-fluid px-4 py-3 bg-light"
      style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-graph-up me-2"></i>
            Sales Analytics
          </h1>
          <p className="text-muted small mb-0">
            Track and analyze your sales performance
          </p>
        </div>
      </div>

      <div className="row g-4">
        <SummaryCard
          title="Today's Sales"
          cash={todaySalesInCash}
          online={todaySalesInOnline}
          total={totalToday}
          icon="bi-currency-rupee"
          iconBg="bg-primary bg-opacity-10 text-primary"
        />

        <SummaryCard
          title="Weekly Sales"
          cash={weekelySalesInCash}
          online={weekelySalesInOnline}
          total={totalWeekly}
          icon="bi-calendar-week"
          iconBg="bg-success bg-opacity-10 text-success"
        />

        <SummaryCard
          title="Monthly Sales"
          cash={monthlySales}
          online={monthlySalesOnline}
          total={totalMonthly}
          icon="bi-calendar-month"
          iconBg="bg-warning bg-opacity-10 text-warning"
        />
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3 pb-2">
              <h5 className="mb-0 fw-bold">Payment Methods Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <PaymentCard
                  label="Cash Payments"
                  amount={monthlySales}
                  icon="bi-cash-coin"
                  color="success"
                />
                <PaymentCard
                  label="Online Payments"
                  amount={monthlySalesOnline}
                  icon="bi-credit-card"
                  color="primary"
                />
                <div className="col-md-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Total Revenue</h6>
                      <span className="text-muted small">This month</span>
                    </div>
                    <h3 className="text-dark">
                      {formatCurrency(totalMonthly)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">
                    Cash: {cashPercentage}%
                  </span>
                  <span className="text-muted small">
                    Online: {onlinePercentage}%
                  </span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${cashPercentage}%` }}
                    role="progressbar"></div>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${onlinePercentage}%` }}
                    role="progressbar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, cash, online, total, icon, iconBg }) => {
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  return (
    <div className="col-xl-4 col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-uppercase text-muted mb-3 fw-bold small">
                {title}
              </h6>
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-success bg-opacity-10 text-success p-2 me-2">
                  <i className="bi bi-cash-coin"></i>
                </span>
                <div>
                  <p className="text-muted small mb-0">Cash</p>
                  <h4 className="mb-0 text-success">{formatCurrency(cash)}</h4>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary p-2 me-2">
                  <i className="bi bi-credit-card"></i>
                </span>
                <div>
                  <p className="text-muted small mb-0">Online</p>
                  <h4 className="mb-0 text-primary">
                    {formatCurrency(online)}
                  </h4>
                </div>
              </div>
              <div className="mt-4 pt-2 border-top">
                <p className="text-muted small mb-1">Total Sales</p>
                <h3 className="mb-0">{formatCurrency(total)}</h3>
              </div>
            </div>
            <div className={`icon-shape rounded-3 p-3 ${iconBg}`}>
              <i className={`bi ${icon} fs-4`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({ label, amount, icon, color }) => {
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  return (
    <div className="col-md-4 mb-4 mb-md-0">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span
            className={`badge bg-${color} bg-opacity-10 text-${color} p-2 me-3`}>
            <i className={`bi ${icon}`}></i>
          </span>
          <div>
            <h6 className="mb-1">{label}</h6>
            <span className="text-muted small">This month</span>
          </div>
        </div>
        <h4 className={`text-${color}`}>{formatCurrency(amount)}</h4>
      </div>
    </div>
  );
};

export default AdminDashBoard;

import { NavLink } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function ItemNavbar() {
  const baseLinkStyle = {
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: "9999px",
    transition: "all 0.3s ease",
    border: "1px solid",
    textDecoration: "none",
    display: "inline-block",
  };

  const navStyles = {
    background: "linear-gradient(to right, #f0f8ff, #ffffff, #f3e8ff)",
    borderBottom: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  };

  const containerStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyles = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1d4ed8",
  };

  const getLinkStyle = (isActive, color) => ({
    ...baseLinkStyle,
    color: isActive ? "#fff" : color,
    backgroundColor: isActive ? color : "#fff",
    borderColor: color,
    boxShadow: isActive
      ? `0 0 0 3px ${
          color === "#2563eb"
            ? "rgba(37, 99, 235, 0.3)"
            : "rgba(220, 38, 38, 0.3)"
        }`
      : "none",
  });

  return (
    <nav style={navStyles}>
      <div style={containerStyles}>
        <NavLink to="/kitchen" style={{ fontSize: "24px", color: "#333" }}>
          <IoIosArrowRoundBack />
        </NavLink>

        <div style={titleStyles}>Kitchen Dashboard</div>

        <div style={{ display: "flex", gap: "12px" }}>
          <NavLink
            to="/kitchen/items/add"
            style={({ isActive }) => getLinkStyle(isActive, "#2563eb")}>
            ➕ Add Items
          </NavLink>

          <NavLink
            to="/kitchen/items/delete"
            style={({ isActive }) => getLinkStyle(isActive, "#dc2626")}>
            Manage Items
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

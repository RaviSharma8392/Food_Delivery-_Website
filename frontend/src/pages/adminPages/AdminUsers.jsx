import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  DatePicker,
  Input,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users`);
        setUsers(response.data);

        const totalRevenue = response.data.reduce(
          (sum, user) => sum + (user.totalSpent || 0),
          0
        );
        const activeUsers = response.data.filter(
          (user) => user.orderCount > 0
        ).length;

        setStats({
          totalUsers: response.data.length,
          activeUsers,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const joinDate = moment(user.createdAt);
      matchesDate = joinDate.isBetween(dateRange[0], dateRange[1], null, "[]");
    }

    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMM D, YYYY"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Orders",
      dataIndex: "orderCount",
      key: "orders",
      render: (count) => count || 0,
      sorter: (a, b) => (a.orderCount || 0) - (b.orderCount || 0),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (amount) => `$${(amount || 0).toFixed(2)}`,
      sorter: (a, b) => (a.totalSpent || 0) - (b.totalSpent || 0),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "Admin" ? "red" : role === "Kitchen" ? "blue" : "green"
          }>
          {role}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Kitchen", value: "Kitchen" },
        { text: "User", value: "User" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => viewUserDetails(record)}>View Details</a>
        </Space>
      ),
    },
  ];

  const viewUserDetails = (user) => {
    // console.log("View user:", user);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Users Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: "24px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="Search users by name, email or phone"
              allowClear
              enterButton
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={12}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Order History
              </Title>
              {record.orders && record.orders.length > 0 ? (
                <Table
                  columns={[
                    {
                      title: "Order ID",
                      dataIndex: "_id",
                      key: "orderId",
                      render: (id) => id.slice(-6),
                    },
                    {
                      title: "Date",
                      dataIndex: "createdAt",
                      key: "date",
                      render: (date) =>
                        moment(date).format("MMM D, YYYY h:mm A"),
                    },
                    {
                      title: "Restaurant",
                      dataIndex: ["restaurantId", "name"],
                      key: "restaurant",
                    },
                    {
                      title: "Items",
                      key: "items",
                      render: (_, order) => order.items.length,
                    },
                    {
                      title: "Amount",
                      dataIndex: "totalAmount",
                      key: "amount",
                      render: (amt) => `$${amt.toFixed(2)}`,
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status) => (
                        <Tag
                          color={
                            status === "delivered"
                              ? "green"
                              : status === "cancelled"
                              ? "red"
                              : status === "out_for_delivery"
                              ? "orange"
                              : "blue"
                          }>
                          {status.replace(/_/g, " ").toUpperCase()}
                        </Tag>
                      ),
                    },
                  ]}
                  dataSource={record.orders}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <p>No orders found for this user.</p>
              )}
            </div>
          ),
          rowExpandable: (record) => record.orders && record.orders.length > 0,
        }}
      />
    </div>
  );
};

export default AdminUsersPage;

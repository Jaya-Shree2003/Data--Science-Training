db.sensor_logs.insertMany([
  {
    device_id: 101,
    room_id: 1,
    sensor_type: "power",
    value: 3.45,
    unit: "kWh",
    timestamp: ISODate("2025-07-25T08:00:00Z"),
    raw_data: { voltage: 230, current: 15, power_factor: 0.98 }
  },
  {
    device_id: 102,
    room_id: 2,
    sensor_type: "power",
    value: 2.15,
    unit: "kWh",
    timestamp: ISODate("2025-07-25T08:05:00Z"),
    raw_data: { voltage: 220, current: 10, power_factor: 0.95 }
  },
  {
    device_id: 103,
    room_id: 1,
    sensor_type: "power",
    value: 4.60,
    unit: "kWh",
    timestamp: ISODate("2025-07-25T08:10:00Z"),
    raw_data: { voltage: 240, current: 20, power_factor: 0.92 }
  },
  {
    device_id: 104,
    room_id: 3,
    sensor_type: "power",
    value: 1.80,
    unit: "kWh",
    timestamp: ISODate("2025-07-25T08:15:00Z"),
    raw_data: { voltage: 215, current: 8, power_factor: 0.88 }
  },
  {
    device_id: 101,
    room_id: 1,
    sensor_type: "power",
    value: 3.90,
    unit: "kWh",
    timestamp: ISODate("2025-07-25T08:30:00Z"),
    raw_data: { voltage: 230, current: 16, power_factor: 0.96 }
  }
]);

db.sensor_logs.createIndex({ device_id: 1 });
db.sensor_logs.createIndex({ timestamp: -1 });
db.sensor_logs.createIndex({ room_id: 1 });

db.sensor_logs.find({ device_id: 101 })
  .sort({ timestamp: -1 })
  .limit(10);

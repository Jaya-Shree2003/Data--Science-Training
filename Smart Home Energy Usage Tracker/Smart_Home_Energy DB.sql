CREATE Smart_Home_Energy_Tracker;
USE Smart_Home_Energy_Tracker;
--- Create Tables
CREATE TABLE Rooms(
room_id INT PRIMARY KEY AUTO_INCREMENT,
room_name VARCHAR(100),
floor INT
);

CREATE TABLE Devices(
device_id INT AUTO_INCREMENT PRIMARY KEY,
device_name VARCHAR(100),
status VARCHAR(50),
room_id INT,
FOREIGN KEY (room_id) REFERENCES Rooms(room_id));

CREATE TABLE energy_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    usage_kwh DECIMAL(6,2),
    usage_date DATE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

--- Insert Queries
INSERT INTO rooms (room_name, floor) VALUES
('Conference Room', 1),
('Server Room', 2),
('Lobby', 1);

--- Devices
INSERT INTO devices (device_name, status, room_id) VALUES
('Air Conditioner', 'ON', 1),
('Heater', 'OFF', 1),
('Server Rack Fan', 'ON', 2),
('Display Screen', 'OFF', 3);

--- Energy_logs
INSERT INTO energy_logs (device_id, usage_kwh, usage_date) VALUES
(1, 3.5, '2025-07-22'),
(2, 1.2, '2025-07-24'),
(3, 5.8, '2025-07-23'),
(1, 4.0, '2025-07-24');

--- CRUD Operations
UPDATE Devices SET status="OFF" WHERE  device_id=1; 

INSERT INTO energy_logs (device_id, usage_kwh, usage_date)
VALUES (2, 2.5, '2025-07-25');

DELETE FROM devices WHERE device_id = 4;

SELECT d.device_name, d.status, r.room_name
FROM devices d
JOIN rooms r ON d.room_id = r.room_id;

--- Stored Procedure
DELIMITER  $$
CREATE PROCEDURE GetRoomUsage(IN Usage_date date)
BEGIN
     SELECT 
        r.room_name,
        usage_date AS date,
        SUM(e.usage_kwh) AS total_usage_kwh
    FROM energy_logs e
    JOIN devices d ON e.device_id = d.device_id
    JOIN rooms r ON d.room_id = r.room_id
    WHERE e.usage_date = usage_date
    GROUP BY r.room_name, usage_date;
END $$

DELIMITER ;
Drop procedure if exists GetRoomUsage;

Call GetRoomUSage('2025-07-24');
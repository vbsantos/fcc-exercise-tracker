CREATE TABLE exercise_tracker_users (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255)
);

CREATE TABLE exercise_tracker_exercises (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  description VARCHAR(255),
  duration INT,
  date DATETIME
);

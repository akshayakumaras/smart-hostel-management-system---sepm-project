// seed.js — Run AFTER schema.sql to fix the password hashes
// Usage: node seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./db');

async function seed() {
  const conn = await pool.getConnection();
  try {
    const studentHash = await bcrypt.hash('student', 10);
    const wardenHash  = await bcrypt.hash('warden',  10);

    // Upsert users with real hashes
    await conn.execute(
      `INSERT INTO users (name, username, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['Akshaya Kumar', 'student', 'akshaya@hostel.edu', studentHash, 'student']
    );
    await conn.execute(
      `INSERT INTO users (name, username, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['Dr. Rajesh Sharma', 'warden', 'warden@hostel.edu', wardenHash, 'warden']
    );

    // Get warden ID
    const [[warden]] = await conn.execute(
      `SELECT user_id FROM users WHERE username = 'warden'`
    );
    const [[student]] = await conn.execute(
      `SELECT user_id FROM users WHERE username = 'student'`
    );

    const wId = warden.user_id;
    const sId = student.user_id;

    // Student profile
    await conn.execute(
      `INSERT INTO student_profiles
         (user_id, roll_no, course, year, room_number, block, phone, fee_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE room_number = VALUES(room_number)`,
      [sId, 'RA2311003010518', 'B.Tech CSE', '3rd Year', 'A-205', 'Block A', '+91 7358689205', 'Paid']
    );

    // Notices
    const notices = [
      ['Hostel Closing for Winter Break',
       'The hostel will be closed from March 10-20 for winter break. Please complete checkout formalities before leaving.',
       'urgent'],
      ['Mess Menu Update',
       'New healthy options have been added to the weekly menu. Check the food menu section for complete details.',
       'important'],
      ['Room Inspection Schedule',
       'Monthly room inspection is scheduled for March 5th. Please keep your rooms tidy and follow hostel norms.',
       'important'],
      ['Hostel Maintenance Schedule',
       'The hostel will undergo routine maintenance on February 25th. Water supply will be interrupted from 9 AM to 12 PM.',
       'important'],
      ['Sports Day Announcement',
       'Inter-hostel sports day will be held on March 5th. Interested students please register with the hostel warden by February 28th.',
       'notice'],
      ['New Mess Timings',
       'From March 1st, dinner timings will be extended till 9:30 PM on weekdays. Weekend timings remain unchanged.',
       'notice'],
      ['Visitors Policy Update',
       'Visitors are now allowed on weekends between 10 AM - 6 PM only. All visitors must register at the reception.',
       'important'],
    ];
    for (const [title, content, priority] of notices) {
      await conn.execute(
        `INSERT IGNORE INTO notices (warden_id, title, content, priority)
         VALUES (?, ?, ?, ?)`,
        [wId, title, content, priority]
      );
    }

    // Food menu
    const menu = [
      ['Monday','Breakfast','Idli Sambar,Vada,Chutney,Tea/Coffee,Bread & Butter','7:00 AM - 9:00 AM'],
      ['Monday','Lunch','Rice,Dal Tadka,Paneer Butter Masala,Chapati,Curd,Pickle,Papad','12:30 PM - 2:00 PM'],
      ['Monday','Dinner','Chapati,Mixed Veg Curry,Dal Fry,Rice,Salad,Sweet','7:30 PM - 9:00 PM'],
      ['Tuesday','Breakfast','Poha,Upma,Boiled Eggs,Tea/Coffee,Fruit','7:00 AM - 9:00 AM'],
      ['Tuesday','Lunch','Rice,Rajma,Aloo Gobi,Chapati,Buttermilk,Salad','12:30 PM - 2:00 PM'],
      ['Tuesday','Dinner','Chapati,Egg Curry,Dal Makhani,Rice,Raita','7:30 PM - 9:00 PM'],
      ['Wednesday','Breakfast','Dosa,Sambar,Chutney,Tea/Coffee,Banana','7:00 AM - 9:00 AM'],
      ['Wednesday','Lunch','Rice,Chole Masala,Palak Paneer,Chapati,Curd,Papad','12:30 PM - 2:00 PM'],
      ['Wednesday','Dinner','Chapati,Aloo Matar,Moong Dal,Rice,Salad,Kheer','7:30 PM - 9:00 PM'],
      ['Thursday','Breakfast','Paratha,Curd,Pickle,Tea/Coffee,Juice','7:00 AM - 9:00 AM'],
      ['Thursday','Lunch','Rice,Dal Tadka,Jeera Aloo,Chapati,Buttermilk,Pickle','12:30 PM - 2:00 PM'],
      ['Thursday','Dinner','Chapati,Paneer Bhurji,Dal Fry,Fried Rice,Raita','7:30 PM - 9:00 PM'],
      ['Friday','Breakfast','Puri Bhaji,Fruit Salad,Tea/Coffee','7:00 AM - 9:00 AM'],
      ['Friday','Lunch','Biryani,Raita,Salad,Papad','12:30 PM - 2:00 PM'],
      ['Friday','Dinner','Chapati,Dal Makhani,Aloo Sabzi,Rice,Sweet','7:30 PM - 9:00 PM'],
      ['Saturday','Breakfast','Upma,Boiled Eggs,Tea/Coffee,Banana','7:00 AM - 9:00 AM'],
      ['Saturday','Lunch','Rice,Sambar,Rasam,Curd,Papad,Pickle','12:30 PM - 2:00 PM'],
      ['Saturday','Dinner','Chapati,Mixed Dal,Veg Pulao,Salad','7:30 PM - 9:00 PM'],
      ['Sunday','Breakfast','Idli,Vada,Sambar,Chutney,Tea/Coffee','7:00 AM - 9:00 AM'],
      ['Sunday','Lunch','Special Thali - Rice,Dal,2 Sabzi,Chapati,Sweet,Curd','12:30 PM - 2:00 PM'],
      ['Sunday','Dinner','Chapati,Paneer Curry,Dal,Rice,Ice Cream','7:30 PM - 9:00 PM'],
    ];
    for (const [day, meal_type, items, meal_time] of menu) {
      await conn.execute(
        `INSERT INTO food_menu (day, meal_type, items, meal_time, updated_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE items = VALUES(items), meal_time = VALUES(meal_time)`,
        [day, meal_type, items, meal_time, wId]
      );
    }

    // Sample complaints
    const cmps = [
      [sId, 'Plumbing',   'A-205', 'Slow water drainage in bathroom',  'resolved'],
      [sId, 'Electrical', 'A-205', 'Light fixture needs replacement',   'inprogress'],
      [sId, 'Maintenance','A-205', 'AC not working properly',           'pending'],
    ];
    for (const [sid, cat, room, desc, status] of cmps) {
      await conn.execute(
        `INSERT IGNORE INTO complaints (student_id, category, room_number, description, status)
         VALUES (?, ?, ?, ?, ?)`,
        [sid, cat, room, desc, status]
      );
    }

    // Sample ragging report
    await conn.execute(
      `INSERT IGNORE INTO ragging_reports
         (student_id, reporter_name, room_number, incident_date, location, description, status)
       VALUES (NULL, 'Anonymous', 'B-408', '2026-02-21',
               'Second floor common area',
               'Senior students from 4th floor were asking for money from juniors late at night.',
               'investigating')`,
      []
    );

    console.log('✅  Database seeded successfully!');
    console.log('    Student login →  username: student  |  password: student');
    console.log('    Warden  login →  username: warden   |  password: warden');
  } catch (err) {
    console.error('❌  Seeding failed:', err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();

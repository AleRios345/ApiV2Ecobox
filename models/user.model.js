import { db } from "../database/connection.database.js";

// Create a new user profile
const createProfile = async ({
  email,
  password,
  username,
  institution,
  icon_url,
}) => {
  const query = {
    text: `
      INSERT INTO users (email, hashed_password, username, institution, icon_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, username, institution, icon_url, created_at, updated_at;
    `,
    values: [email, password, username, institution, icon_url],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Update user profile information
const updateProfile = async (userId, { username, institution, icon_url,email,password }) => {
  const query = {
    text: `
      UPDATE users
      SET
        username = COALESCE($2, username),
        institution = COALESCE($3, institution),
        icon_url = COALESCE($4, icon_url),
        email = COALESCE($5, email),
        hashed_password = COALESCE($6, hashed_password),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, username, institution, icon_url, updated_at;
    `,
    values: [userId, username, institution, icon_url, email, password],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Find user by email
const findOneByEmail = async (email) => {
  const query = {
    text: `
      SELECT 
        u.id, u.email, u.username, u.institution, u.icon_url,
        ut.total_bottles, ut.total_points,u.hashed_password
      FROM users u
      LEFT JOIN user_totals ut ON u.id = ut.user_id
      WHERE u.email = $1;
    `,
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const findOneByUsername = async (username) => {
  const query = {
    text: `
      SELECT 
        u.id, u.email, u.username, u.institution, u.icon_url,
        ut.total_bottles, ut.total_points
      FROM users u
      LEFT JOIN user_totals ut ON u.id = ut.user_id
      WHERE u.username = $1;
    `,
    values: [username],
  };
  const { rows } = await db.query(query);
  return rows[0];
}

// Find user by username
const informationByEmail = async (email) => {
  const query = {
    text: `
      SELECT 
        u.id, u.email, u.username, u.institution, u.icon_url,
        ut.total_bottles, ut.total_points
      FROM users u
      LEFT JOIN user_totals ut ON u.id = ut.user_id
      WHERE u.email = $1;
    `,
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};


// Get weekly bottles statistics
const getWeeklyBottles = async (userId) => {
  const query = {
    text: `
      SELECT 
        week_start,
        monday, tuesday, wednesday, thursday, friday, saturday, sunday,
        total_week
      FROM weekly_bottle_stats
      WHERE 
        user_id = $1 AND
        week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
      ORDER BY week_start;
    `,
    values: [userId],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const updateBottlesAndWeeklyStats = async (userId, boottleCounts) => {
  const query = {
    text: `SELECT add_bottles($1, $2)`,
    values: [userId, boottleCounts],
  };

  const { rows } = await db.query(query);
  return rows[0];
};


const scoreBoardWeekly = async () => {
  const query = {
    text: `
      SELECT 
        u.username, u.icon_url, ut.total_points, ut.total_bottles
      FROM users u
      LEFT JOIN user_totals ut ON u.id = ut.user_id
      ORDER BY ut.total_points DESC
      LIMIT 5;
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

// Export model functions
export const USER_MODEL = {
  createProfile,
  findOneByEmail,
  informationByEmail,
  updateProfile,
  getWeeklyBottles,
  updateBottlesAndWeeklyStats,
  findOneByUsername,
  scoreBoardWeekly
};

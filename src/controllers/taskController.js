const db = require("../config/db");
const redisClient = require("../config/redis");
const taskService = require("../services/taskService");
const { clearUserTaskCache } = require("../utils/cache");

// exports.createTask = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Title Required",
//       });
//     }

//     await db.query(
//       "INSERT INTO tasks(title,description,user_id) values(?,?,?)",
//       [title, description, req.user.id],
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Task Created",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    await taskService.createTask(title, description, req.user.id);
    await clearUserTaskCache(req.user.id);

    return res.status(201).json({
      success: true,
      message: "Task Created",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const offset = (page - 1) * limit;

    // Cache key (unique for every user + filters)
    const cacheKey = `tasks:${req.user.id}:${page}:${limit}:${search}:${status}`;
    // ============================
    // 1. Check Redis Cache
    // ============================
    const cachedData = await redisClient.get(cacheKey);
    const data = JSON.parse(cachedData);
    // console.log("cachedData", data);

    if (cachedData) {
      console.log("Cache Hit");

      return res.status(200).json({
        ...data,
        source: "Redis",
      });
    }
    console.log("Cache Miss");

    let query = `SELECT * FROM tasks WHERE user_id = ?`;
    const values = [req.user.id];

    let countQuery = `SELECT COUNT(*) as total from tasks WHERE user_id = ?`;
    const countValues = [req.user.id];

    // search
    if (search) {
      query += ` AND title LIKE ?`;
      values.push(`%${search}%`);

      countQuery += ` AND title LIKE ?`;
      countValues.push(`%${search}%`);
    }

    // status
    if (status) {
      query += ` AND status = ?`;
      values.push(status);

      countQuery += ` AND status = ?`;
      countValues.push(status);
    }

    query += ` 
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?`;
    values.push(limit);
    values.push(offset);

    const [tasks] = await db.query(query, values);
    const [[countResult]] = await db.query(countQuery, countValues);
    const totalRecords = countResult.total;
    const totalPages = Math.ceil(totalRecords / limit);
    // console.log(query)
    // console.log(req.query);
    // console.log("status =>", status);
    const response = {
      success: true,
      source: "Database",
      currentPage: page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      tasks,
    };

    // ============================
    // 4. Save to Redis (60 sec)
    // ============================

    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 60,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getTaskById = async (req, res) => {
  const taskId = req.params.id;
  //   console.log(taskId);
  try {
    const [tasks] = await db.query(
      `SELECT * FROM tasks WHERE id = ?
       AND user_id = ? 
      `,
      [taskId, req.user.id],
    );
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const validStatus = ["pending", "completed"];

    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [tasks] = await db.query(
      `SELECT * FROM tasks WHERE id = ? and user_id = ?`,
      [taskId, req.user.id],
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await db.query(
      `
      UPDATE tasks
      SET
      title = ?,
      description = ?,
      status = ?
      WHERE id = ?
      `,
      [title, description, status, taskId],
    );

    // Clear Cache
    await clearUserTaskCache(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Task Updated",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const [result] = await db.query(
      `
        DELETE FROM tasks
        WHERE id = ?
        AND user_id = ?
        `,
      [taskId, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Clear Cache
    await clearUserTaskCache(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Task Deleted",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

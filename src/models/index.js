import { dbConfig } from "../configs";
import { Permission } from "./permission.model";
import { Account } from "./account.model";
import { Admin } from "./admin.model";
import { WorkDay } from "./workday.model";
import { QRCode } from "./qrcode.model";
import { Leave } from "./leave.model";
import { Report } from "./report.model";
import { UserPermission } from "./userPermission.model";
import Sequelize from "sequelize";

const sequelize = new Sequelize(dbConfig.url, {
  host: dbConfig.host,
  logging: false,
  
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.permission = Permission(sequelize, Sequelize);
db.account = Account(sequelize, Sequelize);
db.admin = Admin(sequelize, Sequelize);
db.userPermission = UserPermission(sequelize, Sequelize);
db.qrCode = QRCode(sequelize, Sequelize);
db.workDay = WorkDay(sequelize, Sequelize);
db.leave = Leave(sequelize, Sequelize);
db.report = Report(sequelize, Sequelize);

export { db }

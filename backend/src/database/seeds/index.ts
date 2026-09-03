import { dataSource } from "../../common/configs/postgres";

async function runSeeders() {
  try {
    // Initialize the data source before running seeders
    if (!dataSource.isInitialized) {
      console.log("🔌 Initializing database connection...");
      await dataSource.initialize();
      console.log("✅ Database connected successfully");
    }

    // Run seeders

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    // Close the connection after seeding
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log("🔒 Database connection closed");
    }
  }
}

runSeeders().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../src/service/firebaseDb";

// ✅ ฟังก์ชัน Fetch ข้อมูล WorkDay
export const fetchWorkDayData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "WorkDay"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return [];
  }
};

// ✅ ฟังก์ชันลบข้อมูล WorkDay ตาม `binId`
export const deleteBin = async (binId) => {
  if (!binId) {
    console.error("❌ Error: binId is required.");
    return false;
  }

  try {
    await deleteDoc(doc(db, "WorkDay", binId));
    console.log(`✅ Bin ${binId} deleted successfully`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting bin:", error);
    return false;
  }
};

// ✅ ฟังก์ชันลบข้อมูลทั้งหมด (ต้องใช้รหัสผ่านยืนยัน)
export const deleteAllWorkDayData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "WorkDay"));
    const deletePromises = querySnapshot.docs.map((docItem) =>
      deleteDoc(doc(db, "WorkDay", docItem.id))
    );

    await Promise.all(deletePromises);
    console.log("✅ All WorkDay data deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error deleting all data:", error);
    return false;
  }
};

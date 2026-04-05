function updateDeviceToken(data) {
  try {
    const sheet = SS.getSheetByName("Members");
    const emails = sheet.getRange(1, 4, sheet.getLastRow(), 1).getValues().flat();
    const email = String(data.email).toLowerCase().trim();
    const rowIndex = emails.indexOf(email);
    if (rowIndex === -1) return { success: false, message: "帳號未找到" };
    
    // 確保存儲 Token 的欄位存在 (假設存在第 14 欄，N 欄)
    ensureSheetWidth(sheet, 14);
    sheet.getRange(rowIndex + 1, 14).setValue(data.token);
    return { success: true };
  } catch (e) { return { success: false, message: e.toString() }; }
}
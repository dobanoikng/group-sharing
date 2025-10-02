# Flow thiết kế app chia tiền nhóm

## 1. Đối tượng tham gia

* **User**: người dùng app (có thể tham gia nhiều group).
* **Group**: một nhóm đi chơi / sự kiện.
* **Expense**: một khoản chi tiêu trong group.
* **Expense Split**: cách chia khoản chi cho từng thành viên.

---

## 2. Bảng dữ liệu (DB Schema)

### users

| Field      | Type | Note                    |
| ---------- | ---- | ----------------------- |
| id         | uuid | tham chiếu `auth.users` |
| name       | text | tên hiển thị            |
| email      | text | unique                  |
| avatar_url | text | ảnh đại diện            |
| created_at | ts   | thời điểm tạo           |

### groups

| Field       | Type | Note           |
| ----------- | ---- | -------------- |
| id          | uuid | PK             |
| name        | text | tên nhóm       |
| description | text | mô tả          |
| created_by  | uuid | FK -> users.id |
| created_at  | ts   | thời điểm tạo  |

### group_members

| Field     | Type | Note               |
| --------- | ---- | ------------------ |
| id        | uuid | PK                 |
| group_id  | uuid | FK -> groups.id    |
| user_id   | uuid | FK -> users.id     |
| role      | text | 'admin' / 'member' |
| joined_at | ts   | thời điểm tham gia |

### expenses

| Field      | Type    | Note                              |
| ---------- | ------- | --------------------------------- |
| id         | uuid    | PK                                |
| group_id   | uuid    | FK -> groups.id                   |
| created_by | uuid    | FK -> users.id (người thanh toán) |
| title      | text    | mô tả chi phí                     |
| amount     | numeric | số tiền                           |
| currency   | text    | default 'VND'                     |
| created_at | ts      | thời điểm tạo                     |

### expense_splits

| Field      | Type    | Note                         |
| ---------- | ------- | ---------------------------- |
| id         | uuid    | PK                           |
| expense_id | uuid    | FK -> expenses.id            |
| user_id    | uuid    | FK -> users.id               |
| amount     | numeric | số tiền mà user này phải trả |

---

## 3. Luồng hoạt động

### Tạo group

1. User nhập tên nhóm → insert vào `groups`.
2. User tạo → insert vào `group_members` với role = admin.

### Thêm thành viên

* Admin mời → insert vào `group_members`.

### Thêm chi phí

1. User tạo expense → insert vào `expenses` (amount, title, created_by).
2. Chia chi phí → insert nhiều row vào `expense_splits` cho từng member.

### Tính toán số dư

* **Đã trả** = tổng `expenses.amount` mà user tạo.
* **Phải trả** = tổng `expense_splits.amount`.
* **Số dư** = Đã trả - Phải trả.

  * > 0: đang cho nhóm vay.
  * < 0: đang nợ nhóm.

---

## 4. Ví dụ

* Nhóm 3 người (A, B, C).
* A trả tiền ăn 300k → expense 300k.
* Chia đều → mỗi người 100k.

Kết quả:

* A: đã trả 300k, phải trả 100k → dư +200k.
* B: đã trả 0, phải trả 100k → dư -100k.
* C: đã trả 0, phải trả 100k → dư -100k.

---

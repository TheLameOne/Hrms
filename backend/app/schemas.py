from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# --- Employee Schemas ---

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# --- Attendance Schemas ---

class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# --- Dashboard Schemas ---

class DashboardSummary(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int

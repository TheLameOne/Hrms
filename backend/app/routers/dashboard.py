from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Employee, Attendance
from app.schemas import DashboardSummary

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    total_employees = db.query(func.count(Employee.id)).scalar()

    today = date.today()
    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Present")
        .scalar()
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Absent")
        .scalar()
    )

    return DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
    )

from typing import List
from sqlalchemy import Float, ForeignKey, String, Integer, Date
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime
from .extensions import bcrypt

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(25))
    password: Mapped[str] = mapped_column(String(60))

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    price: Mapped[float] = mapped_column(Float)

    lots: Mapped[List["Lot"]] = relationship(back_populates="item")

class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(20))
    quantity: Mapped[int] = mapped_column(Integer)
    expiry_date: Mapped[datetime] = mapped_column(Date)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))

    item: Mapped["Item"] = relationship(back_populates="lots")

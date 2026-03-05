from sqlalchemy import String, create_engine, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from db.Config import db_path


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    score: Mapped[int] = mapped_column()

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, score={self.score!r})"


class Rooms(Base):
    __tablename__ = "rooms"
    id_room: Mapped[int] = mapped_column(primary_key=True)
    user1: Mapped[str] = mapped_column(String(30))
    user2: Mapped[str] = mapped_column(String(30))
    coordinates: Mapped[str] = mapped_column(String(30))
    res_u1: Mapped[float] = mapped_column()
    res_u2: Mapped[float] = mapped_column()

    def __repr__(self) -> str:
        return (f"Room (id={self.id_room!r}, user1={self.user1!r},"
                f" user2={self.user2!r}, res_u1={self.res_u1!r},"
                f" res_u2={self.user2!r})")




# создать бд
engine = create_engine(db_path, echo=False)
Base.metadata.create_all(engine)

from sqlalchemy import Text, ARRAY
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from pgvector.sqlalchemy import Vector

class Base(DeclarativeBase):
    pass

class Recipe(Base):
    __tablename__ = "recipes"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    ingredients: Mapped[list[str]] = mapped_column(ARRAY(Text))
    directions: Mapped[list[str]] = mapped_column(ARRAY(Text))
    ner: Mapped[list[str]] = mapped_column(ARRAY(Text))
    embedding: Mapped[list[float]] = mapped_column(Vector(768))

    
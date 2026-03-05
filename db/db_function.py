from sqlalchemy import select
from sqlalchemy.orm import Session
from db.Table import Users, Rooms


def add_user(engine, user):
    """Функция для создания пользователя"""
    with Session(engine) as session:
        new_user = Users(
            name=user,
            score=0
        )
        session.add(new_user)
        session.commit()
        session.close()
    return "Ok"


def get_user(engine, user_name):
    """Функция для поиска пользователя по имени"""
    with Session(engine) as session:
        data = select(Users).where(Users.name == user_name)
        user = session.scalars(data).fetchall()
        session.close()
    if (user == []):
        return None
    return user[0]


def update_user(engine, user_name, plus_n):
    """Функция для обновления очков"""
    with Session(engine) as session:
        data = select(Users).where(Users.name == user_name)
        user = session.scalars(data).one()
        user.score = user.score + plus_n
        session.commit()
        session.close()
    return "Ok"

#---------------------------------------------------------------#

def create_room(engine, user_name):
    """Функция для создания комнаты"""
    with Session(engine) as session:
        new_room = Rooms(
            user1=user_name,
            user2="",
            coordinates="53.173713 44.960436",
            res_u1=-1.0,
            res_u2=-1.0
        )
        session.add(new_room)
        session.commit()
        session.close()
    return "Ok"

def get_my_room(engine, user_name):
    """Функция для поиска id своей комнаты"""
    with Session(engine) as session:
        data = select(Rooms).where(Rooms.user1 == user_name)
        id = session.scalars(data).fetchall()
        session.close()
    if (id == []):
        return None
    return id[-1]

def get_waiting_room(engine):
    """Функция для поиска свободной комнаты"""
    with Session(engine) as session:
        data = select(Rooms).where(Rooms.user2 == "")
        id = session.scalars(data).fetchall()
        session.close()
    if (id == []):
        return None
    return id[0]


def update_user_room(engine, id_room, user_name):
    """Функция для присоединения пользователя к комнате"""
    with Session(engine) as session:
        data = select(Rooms).where(Rooms.id_room == id_room)
        room = session.scalars(data).one()
        room.user2 = user_name
        session.commit()
        session.close()
    return "Ok"


def update_result_user_room(engine, id_room, user_name, res):
    """Функция для обновления результата игры в комнате"""
    with Session(engine) as session:
        data = select(Rooms).where(Rooms.id_room == id_room)
        room = session.scalars(data).one()
        if room.user1 == user_name:
            room.res_u1 = res
        else:
            room.res_u2 = res
        session.commit()
        session.close()
    return "Ok"


# НЕ ПРИГОДИТЬСЯ, БУДЕМ ХРАНИТЬ ВСЕ ИГРЫ
def delete_user_room(engine, id_room):
    """Функция для удаления комнаты"""
    with Session(engine) as session:
        data = session.get(Rooms, id_room)
        session.delete(data)
        session.close()
    return "Ok"



def get_room(engine, id_room):
    """Функция для поиска id своей комнаты"""
    with Session(engine) as session:
        data = select(Rooms).where(Rooms.id_room == id_room)
        id = session.scalars(data).fetchall()
        session.close()
    if (id == []):
        return None
    return id[-1]

#------------------------------------------------------------#
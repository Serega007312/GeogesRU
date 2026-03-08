import json
import os


from flask import Flask, render_template, redirect, send_from_directory
from sqlalchemy import create_engine

from db.Config import db_path
from db.db_function import (add_user, get_user,
                            update_user,create_room,
                            get_my_room, get_waiting_room,
                            delete_user_room, update_user_room,
                            update_result_user_room, get_room)

app = Flask(__name__)
engine = create_engine(db_path, echo=False)

web = "http://localhost:5000"

@app.route("/start")
def create_name():
    return render_template("Create_name.html")


@app.route("/menu")
def menu():
    return render_template("Menu.html")


@app.route("/waiting_room")
def waiting_room():
    return render_template("Waiting_room.html")


@app.route("/score_board")
def score_board():
    return render_template("Score_board.html")


@app.route("/connect_room")
def connect_room():
    return render_template("Connect_room.html")


@app.route("/game/<int:room_id>")
def game(room_id):
    return render_template("Main.html")


@app.route('/favicon.ico')
def favicon():
    # Перенаправляем браузер на файл в папке static
    return "_"

# Обработка взаимодействия с бд

@app.route("/add_user/<string:user_name>")
def add_username(user_name):
    if (get_user(engine, user_name) == None):
        add_user(engine, user_name)
        return f"{user_name} успешно добавлен"
    else:
        return f"{user_name} уже существует"

@app.route("/find_waiting_room/<string:user_name>")
def find_waiting_room(user_name):
    user = get_user(engine, user_name)
    if (user == None):
        j = {"redirect": "/start"}
        return json.dumps(j)
    else:
        room_id = get_waiting_room(engine)
        if room_id == None:
            create_room(engine, user_name)
            new_room_id = get_my_room(engine, str(user_name))
            j = {"redirect": "/waiting_room", "id_room": new_room_id.id_room}
            return json.dumps(j)
        else:
            update_user_room(engine, room_id.id_room, str(user_name))
            j = {"redirect": "/game", "id_room": room_id.id_room}
            return json.dumps(j)

@app.route("/go_game/<string:user_name>")
def go_game(user_name):
    user = get_user(engine, user_name)
    if (user == None):
        j = {"redirect": "/start"}
        return json.dumps(j)
    else:
        room_id = get_my_room(engine, user_name)
        if room_id == None:
            create_room(engine, user_name)
            new_room_id = get_my_room(engine, str(user_name))
            j = {"redirect": "/waiting_room", "id_room": new_room_id}
            return json.dumps(j)
        else:
            if room_id.user2 != "":
                j = {"redirect": "/game", "id_room": room_id.id_room}
                return json.dumps(j)
            else:
                j = {"redirect": ""}
                return json.dumps(j)


@app.route("/game_res/<string:user_name>/<int:id_room>/<float:res>")
def game_res(user_name, id_room, res):
    update_result_user_room(engine, id_room, user_name, res)
    j = {"redirect": "/menu", "status":"ok"}
    return json.dumps(j)


@app.route("/who_win/<string:user_name>/<int:id_room>")
def who_win(user_name, id_room):
    print("1")
    room = get_room(engine, id_room)
    if room == None:
        j = {"status": "None"}
        return json.dumps(j)
    else:
        if room.res_u1 != -1.0 and room.res_u2 != -1.0:
            if room.res_u1 > room.res_u2:
                if room.user2 == user_name:
                    j = {"status": "Ты выйграл"}
                    update_user(engine, user_name, 1)
                else:
                    j = {"status": "Ты проиграл"}
                return json.dumps(j)
            elif room.res_u1 == room.res_u2:
                j = {"status": "Ничья"}
                return json.dumps(j)
            else:
                if room.user1 == user_name:
                    j = {"status": "Ты выйграл"}
                    update_user(engine, user_name, 1)
                else:
                    j = {"status": "Ты проиграл"}
                return json.dumps(j)
        else:
            j = {"status": "Ещё не всё"}
            return json.dumps(j)



if __name__ == "__main__":
    app.run(debug=True)


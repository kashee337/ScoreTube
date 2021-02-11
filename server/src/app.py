""" Server for ScoreTube """
import json
import os
import shutil
import sys
from pathlib import Path

from flask import Flask, g, jsonify, request
from flask_cors import CORS

sys.path.append(str(Path(__file__).parent))
import const
from db_editor import DbEditor

app = Flask(__name__)
CORS(app)

DATA_BASE = Path(__file__).parent / const.DATA_BASE
PUBLIC_DIR = Path(__file__).parent / const.PUBLIC_DIR


def connect_db():
    """db connectionの取得
    Returns:
        sqlite3.Connection: connection to spatialite-db
    """
    db_connect = getattr(g, "_database", None)
    if db_connect is None:
        g._database = DbEditor()
        db_connect = g._database
    return db_connect


def change_duplicate_name(name):
    """パス重複した場合にprefixをつけて変更

    Args:
        name (str): 保存先パス

    Returns:
        str: 変更されたパス(重複しない場合は変更しない)
    """
    name = Path(name)
    base_name = name.name
    cnt = 1
    while name.is_file():
        name = name.with_name(f"{cnt:03}_" + base_name)
        cnt += 1
    return str(name)


pdf_pool = []


def pool_file(file):
    """一時フォルダにfileを保存しパス名をreturn

    Args:
        file ([type]): request結果のfile

    Returns:
        str: 一時保存先パス
    """
    out_dir = Path(PUBLIC_DIR) / "pdf/tmp"
    out_dir.mkdir(exist_ok=True)
    out_path = change_duplicate_name(out_dir / file.filename)
    file.save(out_path)
    file.close()
    return out_path


@app.route("/regist_pool", methods=["POST"])
def regist_pool():
    response = {}
    try:
        out_path = pool_file(request.files["file"])
        pdf_pool.append(out_path)
        response["error"] = None
    except (ValueError, AttributeError) as e:
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/regist_reset")
def regist_reset():
    response = {}
    try:
        global pdf_pool
        pdf_pool = []
        response["error"] = None
    except (ValueError, AttributeError) as e:
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/regist_commit", methods=["POST"])
def regist_commit():
    response = {}
    try:
        data = request.data.decode("utf-8")
        data = json.loads(data)
        assert "title" in data.keys() and "composer" in data.keys(), "hoge"
        connect = connect_db()

        for path, title, composer in zip(pdf_pool, data["title"], data["composer"]):
            new_path = path.replace("/tmp/", "/")
            connect.regist(new_path, title, composer)
            shutil.move(path, new_path)
            print("commit", new_path, title, composer)
        response["error"] = None
    except (ValueError, AttributeError, AssertionError) as e:
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/search")
def search():
    response = {}
    try:
        search_query = request.args.get("s_query")
        q_type = request.args.get("q_type")
        connect = connect_db()
        response["queryResults"] = connect.search(search_query, q_type)
        response["error"] = None
    except (ValueError, AttributeError) as e:
        response["queryResults"] = {"key": [], "title": [], "composer": [], "path": []}
        response["error"] = str(e)

    return jsonify(response), 200


@app.teardown_appcontext
def close_connection(exception):
    """close db-connection"""
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(const.SERVER_HOST, port=const.SERVER_PORT)

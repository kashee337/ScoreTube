""" Server for ScoreTube """
import json
import logging
import os
import shutil
import sys
from pathlib import Path

from flask import Flask, g, jsonify, request
from flask_cors import CORS

import const

sys.path.append(str(Path(__file__).parent))
from db_editor import DbEditor

logging.basicConfig(format="%(levelname)s:%(message)s", level=logging.DEBUG)
logger = logging.getLogger(__file__)
app = Flask(__name__)
CORS(app)


# DB_DIR = Path(__file__).parent / const.DB_DIR
# PDF_DIR = Path(__file__).parent / const.PDF_DIR
DB_DIR = Path(__file__).parent / os.environ["DB_DIR"]
PDF_DIR = Path(__file__).parent / os.environ["PDF_DIR"]
DB_DIR.mkdir(exist_ok=True, parents=True)
PDF_DIR.mkdir(exist_ok=True, parents=True)


def connect_db():
    """db connectionの取得
    Returns:
        sqlite3.Connection: connection to spatialite-db
    """
    db_connect = getattr(g, "_database", None)
    if db_connect is None:
        g._database = DbEditor(PDF_DIR, DB_DIR)
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
    out_dir = PDF_DIR / "tmp"
    out_dir.mkdir(exist_ok=True)
    out_path = change_duplicate_name(out_dir / file.filename)
    file.save(out_path)
    file.close()
    return out_path


@app.route("/regist_pool", methods=["POST"])
def regist_pool():
    """ pdfを仮保存する """
    response = {}
    try:
        out_path = pool_file(request.files["file"])
        pdf_pool.append(out_path)
        logger.debug(out_path)
        response["error"] = None
    except (ValueError, AttributeError) as e:
        logger.error(e)
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/regist_reset")
def regist_reset():
    """ 仮保存情報をresetする """
    response = {}
    try:
        global pdf_pool
        for path in pdf_pool:
            os.remove(path)
        pdf_pool = []
        response["error"] = None
        logger.debug("clear tmp-regist")
    except (ValueError, AttributeError) as e:
        logger.error(e)
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/regist_commit", methods=["POST"])
def regist_commit():
    """ 仮保存ファイルを本保存し、情報をdbに書き込む """
    response = {}
    try:
        global pdf_pool
        data = request.data.decode("utf-8")
        data = json.loads(data)
        assert "title" in data.keys() and "composer" in data.keys(), "hoge"
        connect = connect_db()

        for path, title, composer in zip(pdf_pool, data["title"], data["composer"]):
            new_path = path.replace("/tmp/", "/")
            connect.regist(new_path, title, composer)
            shutil.move(path, new_path)
            logger.debug(f"commit {new_path}, title:{title}, composer:{composer}")

        pdf_pool = []
        logger.debug("regist commit")
        response["error"] = None
    except (ValueError, AttributeError, AssertionError) as e:
        logger.error(e)
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/delete")
def delete():
    """ 登録済みのファイルを削除する """
    response = {}
    try:
        path = request.args.get("path")
        logger.debug(f"delete {path}")

        connect = connect_db()
        connect.delete_by_path(path)
        os.remove(path)
        response["queryResults"] = connect.search("", "title")
        response["error"] = None
    except (ValueError, AttributeError) as e:
        logger.error(e)
        response["error"] = str(e)

    return jsonify(response), 200


@app.route("/search")
def search():
    """ q_type(title or composer)でquery検索 """
    response = {}
    try:
        search_query = request.args.get("s_query")
        q_type = request.args.get("q_type")
        connect = connect_db()
        logger.debug(f"search:{search_query},q_type:{q_type}")
        response["queryResults"] = connect.search(search_query, q_type)
        response["error"] = None
    except (ValueError, AttributeError) as e:
        logger.error(e)
        response["error"] = str(e)

    return jsonify(response), 200


@app.teardown_appcontext
def close_connection(exception):
    """close db-connection"""
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(os.environ["HOST"], port=os.environ["PORT"])
    # app.run(const.HOST, const.PORT)

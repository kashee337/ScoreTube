import glob
import logging
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

logger = logging.getLogger(__file__)


class DbEditor:
    def __init__(self, pdf_dir, db_dir):

        db_path = Path(db_dir) / "song.db"
        self.pdf_dir = Path(pdf_dir)
        self.connect = sqlite3.connect(db_path)

        logger.debug(f"db_path:{db_path}")
        logger.debug(f"pdf_dir:{pdf_dir}")

        # create
        cur = self.connect.cursor()
        cmd = """CREATE TABLE IF NOT EXISTS song(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                composer VARCHAR,
                path VARCHAR NOT NULL
        )"""
        cur.execute(cmd)
        self.clear_lostfile()

    def search(self, search_query, q_type="title"):
        """ q_typeに応じてdb内を検索 """
        q_type = "title" if q_type not in ["title", "composer"] else q_type
        cur = self.connect.cursor()

        cmd = f"""
            SELECT * 
            FROM song
            WHERE {q_type} LIKE '%{search_query}%'
          """
        data = defaultdict(list)
        rows = cur.execute(cmd)
        for row in rows:
            data["key"].append(row[0])
            data["title"].append(row[1])
            data["composer"].append(row[2])
            data["path"].append(row[3])

        return data

    def regist(self, path, title, composer):
        """ dbに登録 """
        cur = self.connect.cursor()
        cmd = """INSERT INTO song (title,composer,path) VALUES (?,?,?)"""
        cur.execute(cmd, (title, composer, str(path)))
        self.connect.commit()
        return

    # @staticmethod
    # def get_song_info(path):
    #     title = title_dict[path]
    #     composer = composer_dict[path]

    #     return title, composer

    def clear_lostfile(self):
        """ ファイルが存在しない場合はdbから消しておく """
        cur = self.connect.cursor()
        cmd = "SELECT id,path FROM song"
        rows = cur.execute(cmd)
        for row in rows:
            pid = row[0]
            path = Path(row[1])
            if not path.is_file():
                self.delete_by_pid(pid)
                logger.debug(f"{path} is not in db. so it's deleted.")

    def delete_by_pid(self, pid):
        cur = self.connect.cursor()
        cmd = f"DELETE FROM song WHERE id=={pid}"
        cur.execute(cmd)

    def delete_by_path(self, path):
        cur = self.connect.cursor()
        cmd = f"DELETE FROM song WHERE path=='{path}'"
        cur.execute(cmd)

    def init_db(self):
        cur = self.connect.cursor()
        # drop
        cmd = "DROP TABLE IF EXISTS song"
        cur.execute(cmd)
        # create
        cmd = """CREATE TABLE IF NOT EXISTS song(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                composer VARCHAR,
                path VARCHAR NOT NULL
        )"""
        cur.execute(cmd)
        # insert
        path_list = glob.glob(str(self.pdf_dir / "*.pdf"))
        for path in path_list:
            title, composer = self.get_song_info(path)
            cmd = """INSERT INTO song (title,composer,path) VALUES (?,?,?)""", (
                title,
                composer,
                path,
            )
            cur.execute(cmd)

        self.connect.commit()

    def close(self):
        self.connect.close()

    def __del__(self):
        self.close()

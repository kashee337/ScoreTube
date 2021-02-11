import glob
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
import const

DATA_BASE = Path(__file__).parent / const.DATA_BASE
PUBLIC_DIR = Path(__file__).parent / const.PUBLIC_DIR


class DbEditor:
    def __init__(self, db_path=DATA_BASE):
        self.connect = sqlite3.connect(db_path)
        self.score_reader = None
        self.clear()

    def search(self, search_query, q_type="title"):
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
        path = Path("/pdf") / Path(path).name
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

    def clear(self):
        print("clear")
        cur = self.connect.cursor()
        cmd = "SELECT id,path FROM song"
        rows = cur.execute(cmd)
        for row in rows:
            pid = row[0]
            path = PUBLIC_DIR / Path(row[1][1:])
            if not path.is_file():
                self.delete_by_pid(pid)

    def delete_by_pid(self, pid):
        cur = self.connect.cursor()
        cmd = f"DELETE FROM song WHERE id=={pid}"
        cur.execute(cmd)
        print("delete", pid)

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
        path_list = glob.glob(str(PUBLIC_DIR / "pdf/") + "*.pdf")
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

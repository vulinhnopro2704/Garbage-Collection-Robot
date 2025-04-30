# detector/services.py

import logging
from typing import Any, Dict, List, Optional
from firebase_admin import db
from detector.firebase_client import rtdb

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class RealtimeDBService:
    """
    Generic service to perform CRUD on Firebase Realtime Database.
    Usage:
        svc = RealtimeDBService(path="detections")
        key = svc.create({"foo": "bar"})
        item = svc.get(key)
        svc.update(key, {"foo": "baz"})
        svc.delete(key)
        all_items = svc.list(limit=50)
    """

    def __init__(self, path: str):
        # Tham chiếu tới node /<path> :contentReference[oaicite:6]{index=6}
        self._ref = rtdb.reference(path)

    def create(self, data: Dict[str, Any]) -> str:
        """
        Thêm một record mới. Trả về key do RTDB tự sinh.
        """
        try:
            new_ref = self._ref.push(data)  # push() = add + generate key :contentReference[oaicite:7]{index=7}
            return new_ref.key
        except Exception as e:
            logger.exception(f"RTDB create error at {self._ref.path}: {e}")
            raise

    def get(self, key: Optional[str] = None) -> Any:
        """
        Lấy data: nếu key=None => trả về toàn bộ node; nếu key có => child(key).get()
        """
        try:
            target = self._ref if key is None else self._ref.child(key)
            return target.get()  # blocking call, trả về Python dict hoặc value :contentReference[oaicite:8]{index=8}
        except Exception as e:
            logger.exception(f"RTDB get error at {self._ref.path}/{key}: {e}")
            raise

    def update(self, key: str, updates: Dict[str, Any]) -> None:
        """
        Cập nhật một record (partial update).
        """
        try:
            self._ref.child(key).update(updates)  # supports nested updates :contentReference[oaicite:9]{index=9}
        except Exception as e:
            logger.exception(f"RTDB update error at {self._ref.path}/{key}: {e}")
            raise

    def delete(self, key: str) -> None:
        """
        Xóa record theo key.
        """
        try:
            self._ref.child(key).delete()
        except Exception as e:
            logger.exception(f"RTDB delete error at {self._ref.path}/{key}: {e}")
            raise

    def list(self, order_by: Optional[str] = None, limit: Optional[int] = None) -> List[Any]:
        """
        Lấy danh sách các record.
        - order_by: tên field để order_by_child (nếu cần) :contentReference[oaicite:10]{index=10}
        - limit: giới hạn số item trả về với limit_to_last :contentReference[oaicite:11]{index=11}
        """
        try:
            q = self._ref
            if order_by:
                q = q.order_by_child(order_by)
            if limit:
                q = q.limit_to_last(limit)
            return q.get() or []  # trả về dict key->value, có thể convert thành list :contentReference[oaicite:12]{index=12}
        except Exception as e:
            logger.exception(f"RTDB list error at {self._ref.path}: {e}")
            raise

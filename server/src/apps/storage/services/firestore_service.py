# detector/services.py

import logging
from typing import Any, Dict, List, Optional, Union
from google.cloud.firestore import Client, DocumentReference, DocumentSnapshot, Query
from firebase_admin import firestore as _firestore
from detector.firebase_client import db

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class FirestoreService:
    """
    Generic Firestore service for CRUD operations.
    Usage:
        service = FirestoreService(db, "detections")
        doc_id = service.create({"foo": "bar"})
        data = service.get(doc_id)
        service.update(doc_id, {"foo": "baz"})
        service.delete(doc_id)
        items = service.list(query_filters=[("timestamp", ">", some_dt)], limit=50)
    """

    def __init__(self, client: Client, collection_name: str):
        self._client = client
        self._collection = self._client.collection(collection_name)

    def create(self, data: Dict[str, Any], doc_id: Optional[str] = None) -> str:
        """
        Create a new document. If doc_id is given, uses it; otherwise auto-generated.
        Returns the document ID.
        """
        try:
            if doc_id:
                self._collection.document(doc_id).set(data)
                return doc_id
            ref = self._collection.add(data)[1]  # add returns (write_result, doc_ref)
            return ref.id
        except Exception as e:
            logger.exception(f"Error creating document in {self._collection.id}: {e}")
            raise

    def get(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a single document by ID. Returns None if not found.
        """
        try:
            snap: DocumentSnapshot = self._collection.document(doc_id).get()
            if snap.exists:
                return snap.to_dict()
            return None
        except Exception as e:
            logger.exception(f"Error getting document {doc_id} in {self._collection.id}: {e}")
            raise

    def update(self, doc_id: str, updates: Dict[str, Any]) -> None:
        """
        Update fields of an existing document. Fails if document does not exist.
        """
        try:
            self._collection.document(doc_id).update(updates)
        except Exception as e:
            logger.exception(f"Error updating document {doc_id} in {self._collection.id}: {e}")
            raise

    def delete(self, doc_id: str) -> None:
        """
        Delete a document by ID. Silent if not exists.
        """
        try:
            self._collection.document(doc_id).delete()
        except Exception as e:
            logger.exception(f"Error deleting document {doc_id} in {self._collection.id}: {e}")
            raise

    def list(
        self,
        query_filters: Optional[List[tuple]] = None,
        order_by: Optional[List[tuple]] = None,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Query documents with optional filters, ordering, and limit.
        - query_filters: List of (field, op_string, value), e.g. [("timestamp", ">", dt)]
        - order_by:      List of (field, direction), direction is "ASCENDING" or "DESCENDING"
        """
        try:
            q: Union[Query, Client] = self._collection
            if query_filters:
                for field, op, val in query_filters:
                    q = q.where(field, op, val)
            if order_by:
                for field, direction in order_by:
                    dir_enum = (_firestore.Query.ASCENDING 
                                if direction.upper() == "ASCENDING" 
                                else _firestore.Query.DESCENDING)
                    q = q.order_by(field, direction=dir_enum)
            if limit:
                q = q.limit(limit)
            snaps = q.stream()
            return [snap.to_dict() for snap in snaps]
        except Exception as e:
            logger.exception(f"Error querying {self._collection.id}: {e}")
            raise
